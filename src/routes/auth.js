const express = require("express");
const router = express.Router()
const {verifyAccessToken} = require('../utils/jwt_service')
const authController = require("../controllers/authController");

router.post("/register", authController.registerUser);
router.post("/login", authController.loginUser);
router.post("/refreshToken", authController.refreshToken);
router.post("/logout", verifyAccessToken, authController.logOut);

router.get("/getList", verifyAccessToken, authController.getList);

module.exports = router