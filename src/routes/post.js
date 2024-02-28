const express = require("express");
const router = express.Router()
const Post = require("../models/Post");
const upload = require("../utils/multer");
const {verifyAccessToken} = require('../utils/jwt_service')
const postController = require("../controllers/postController");

router.post(
    "/",
    upload.single("image"),
    verifyAccessToken,
    postController.createPost
);

router.put(
    "/:id",
    verifyAccessToken,
    postController.updatePost
  );

router.delete(
    "/:id",
    verifyAccessToken,
    postController.deletePost
);

router.get(
    "/user/:id",
    verifyAccessToken,
    postController.getPostsFromOne
);

router.get("/fullpost/:id", verifyAccessToken, postController.getAPost);

module.exports = router;