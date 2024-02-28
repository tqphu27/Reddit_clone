const router = require("express").Router();
const {verifyAccessToken} = require('../utils/jwt_service')
const messageController = require("../controllers/messageController");

//CREATE A MESSAGE
router.post(
  "/",
  verifyAccessToken,
  messageController.createMessage
);

//GET MESSAGE
router.get(
  "/:conversationId",
  verifyAccessToken,
  messageController.getMessage
);

module.exports = router;
