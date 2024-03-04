const router = require("express").Router();
const {verifyTokenAndUserAuthorization} = require("../middleware/authMiddleware")
const userController = require("../controllers/userController");

//GET A USER
router.get("/:id", verifyTokenAndUserAuthorization, userController.getUser);

module.exports = router;