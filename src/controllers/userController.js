const User = require("../models/User");
const Post = require("../models/Post");

const bcrypt = require("bcrypt");
const authController = require("./authController");

const userController = {
    getUser: async (req, res) => {
        try {
          const user = await User.findById(req.params.id);
          res.status(200).json(user);
        } catch (err) {
          res.status(500).json(err);
        }
    },

      //DELETE A USER
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
}

module.exports = userController;