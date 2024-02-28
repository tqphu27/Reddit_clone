const router = require("express").Router();
const {verifyAccessToken} = require('../utils/jwt_service')
const conversationController = require("../controllers/conversationController");

//CREATE CONVERSATION
router.post(
  "/",
  verifyAccessToken,
  conversationController.createConversation
);

//GET CONVERSATION OF A USER
router.get(
  "/:userId",
  verifyAccessToken,
  conversationController.getConversation
);

//GET AVAILABLE CONVERSATIONS BETWEEN USERS
router.get(
  "/find/:first/:second",
  verifyAccessToken,
  conversationController.getAvailableConversation
);

module.exports = router;
