const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const {userValidate} = require('../utils/validation')
const {signAcessToken, signRefreshToken, verifyRefreshToken} = require("../middleware/authMiddleware")
const client = require('../utils/connections_redis')
const createError = require('http-errors')

const authController = {
    //REGISTER\
    registerUser: async (req, res, next) => {
      try {
        if (req.body.password.length > 6) {
          try {
            const salt = await bcrypt.genSalt(10);
            const hashed = await bcrypt.hash(req.body.password, salt);
    
            //Create new user
            const newUser = await new User({
              username: req.body.username,
              email: req.body.email,
              password: hashed,
            });
    
            //Save user to DB
            const user = await newUser.save();
            res.status(200).json(user);
          } catch (err) {
            res.status(500).json(err.message);
          }
        }
        else {
          res.status(401).json({message:"Must be 7 character or more"});
        }
      }catch(error){
        next(error)
      }
      
    },

    getList: (req, res, next) => {
      console.log(req.headers)
      const listUsers = [
          {
              email: 'abc@gmail.com',
  
          },
          {
              email: 'def@gmail.com',
              
          },
      ]
      res.json({
          listUsers
      })
  },

    // Login
    loginUser: async (req, res, next) => {
        try{
            const user = await User.findOne({ username: req.body.username }).select(
              "+password"
              );
              
            if(!user){
                throw createError.NotFound('User not registered')
            }

            const validPassword = await bcrypt.compare(
              req.body.password,
              user.password
            );

            if(!validPassword){
              throw createError.Unauthorized();
            } 

            const accessToken = await signAcessToken(user._id);
            const refreshToken = await signRefreshToken(user._id);

            res.cookie("refreshToken", refreshToken, {
              httpOnly: true,
              secure: false,
              path: "/",
              sameSite: "none",
            });
            
            const returnedUser = {
              ...user._doc,
              accessToken: accessToken,
            };
            
            res.status(200).json(returnedUser);
            
        }catch(err){
            res.status(500).json(err)
        }
    },

    refreshToken: async (req, res) => {
      try {
        const refreshToken = req.cookies.refreshToken;
        if (!refreshToken){
          return res.status(401).json("You're not authenticated");
        }

        // const newAccessToken = await signAcessToken(user._id);
        const {userId} = await verifyRefreshToken(refreshToken)
        const accessToken = await signAcessToken(userId)
        const refToken = await signRefreshToken(userId)

        jwt.verify(refToken, process.env.JWT_REFRESH_KEY, (err, user) => {
          if (err) {
            console.log(err);
          }
          res.cookie("refreshToken", refToken, {
            httpOnly: true,
            secure: false,
            path: "/",
            sameSite: "strict",
          });
          res.status(200).json({
            accessToken: accessToken,
            // refreshToken: newRefreshToken,
          });
        })
      }catch(err){
        res.status(500).json(err)
      }
      
    },

    logOut: async (req, res) => {
      //Clear cookies when user logs out
      res.clearCookie("refreshToken");
      res.status(200).json({
        status: 200,
        message: "Logged out successfully!"});
    },
}

module.exports = authController;

    