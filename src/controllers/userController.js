const User = require("../models/User");
const Post = require("../models/Post");

const bcrypt = require("bcrypt");
const authController = require("./authController");
const {signAcessToken, signRefreshToken, verifyRefreshToken} = require("../utils/jwt_service")

const userController = {
    getUser: async (req, res) => {
        try {
          const user = await User.findById(req.params.id);
          res.status(200).json(user);
        } catch (err) {
          res.status(500).json(err);
        }
    },

    deleteUser: async (req, res) => {
        if (req.body.userId === req.params.id) {
            try {
                await User.findByIdAndDelete(req.params.id);
                res.status(200).json("User deleted");
            } catch (err) {
                res.status(500).json(err);
            }
        } else {
            res.status(403).json("You can only delete your account");
        }
    },

    updateUser: async (req, res) => {
        try {
            if (req.body.password) {
                try {
                    const salt = await bcrypt.genSalt(10)
                    req.body.password = await bcrypt.hash(req.body.password, salt);
                } catch (err) {
                    res.status(500).json(err);
                }
            }

            const user = await User.findByIdAndUpdate(
                req.params.id.trim(),
                {
                    $set: req.body,
                },
                { returnDocument: "after"}
            ).select("+password");

            const accessToken = await signAcessToken(user._id);
            
        } catch (err) {
            res.status(500).json(err);
        }
    },

    searchAllUser: async (req, res) => {
        try {
          const username = req.query.username;
          const user = await User.find({ username: { $regex: username } })
            .limit(2)
            .select("username profilePicture theme")
            .exec();
          return res.status(200).json(user);
        } catch (err) {
          return res.status(500).json(err);
        }
    },

    getLeaderboard: async (req, res) => {
        try {
          const users = await User.find().sort({ karmas: -1 }).limit(10);
          res.status(200).json(users);
        } catch (err) {
          return res.status(500).json(err);
        }
    },

    followUser: async (req, res) => {
        if (req.body.userId !== req.params.id) {
            try {
                const user =await User.findById(req.params.id);
                if (!user.followers.includes(req.body.userId)) {
                    await User.findByIdAndUpdate(req.param.id), {
                        $push: { followers: req.body.userId },
                    }
                    const updatedUser = await User.findByIdAndUpdate(
                        req.body.userId,
                        {
                          $push: { followings: req.params.id },
                        },
                        { returnDocument: "after" }
                    );
                    return res.status(200).json(updatedUser);
                } else {
                    await User.findByIdAndUpdate(req.params.id, {
                        $pull: { followers: req.body.userId },
                    });
                    
                    const updateUser = await User.findByIdAndUpdate(
                        req.body.userId,
                        {
                          $pull: { followings: req.params.id },
                        },
                        { returnDocument: "after" }
                    );

                    return res.status(200).json(updateUser);
                }
            } catch (err) {
                return res.status(500).json(err);
            }
        }else{
            return res.status(403).json("You can't follow yourself");
        }
    }
}

module.exports = userController;