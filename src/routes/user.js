const router = require("express").Router();
const {verifyTokenAndUserAuthorization} = require('../utils/jwt_service')
const userController = require("../controllers/userController");

//GET A USER
router.get("/:id", verifyTokenAndUserAuthorization, userController.getUser);

module.exports = router;