const express = require("express");
const router = express.Router()
const Post = require("../models/Post");
const upload = require("../utils/multer");
const {verifyAccessToken, verifyTokenAndUserPostAuthorization, verifyTokenAndCommentAuthorization} = require('../utils/jwt_service')
const postController = require("../controllers/postController");
const commentController = require("../controllers/commentController");

router.post(
    "/",
    upload.single("image"),
    verifyAccessToken,
    postController.createPost
);

router.put(
    "/:id",
    verifyTokenAndUserPostAuthorization,
    postController.updatePost
  );

router.delete(
    "/:id",
    verifyTokenAndUserPostAuthorization,
    postController.deletePost
);

router.get(
    "/user/:id",
    verifyAccessToken,
    postController.getPostsFromOne
);

router.get("/fullpost/:id", verifyAccessToken, postController.getAPost);

router.post(
    "/timeline",
    verifyAccessToken,
    postController.getFriendsPost
);

router.put(
    "/:id/upvote",
    verifyAccessToken,
    postController.upvotePost
  );
  
  //DOWNVOTE A POST
  router.put(
    "/:id/downvote",
    verifyAccessToken,
    postController.downvotePost
  );
  
  router.put(
    "/:id/favorite",
    verifyAccessToken,
    postController.addFavoritePost
  );
  //ADD A COMMENT
  router.post(
    "/comment/:id",
    verifyAccessToken,
    commentController.addComment
  );
  
  //GET ALL COMMENTS
  router.get(
    "/comments",
    verifyAccessToken,
    commentController.getAllComments
  );
  
  //GET FAVORITE POSTS
  router.get(
    "/favorites",
    verifyAccessToken,
    postController.getFavoritePosts
  );
  
  //GET ALL COMMENTS IN A POST
  router.get(
    "/comment/:id",
    verifyAccessToken,
    commentController.getCommentsInPost
  );
  
  //DELETE A COMMENT
  router.delete(
    "/comment/:id",
    verifyTokenAndCommentAuthorization,
    commentController.deleteComment
  );

module.exports = router;