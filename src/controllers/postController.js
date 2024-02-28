const Post = require("../models/Post");
const User = require("../models/User");
const {cloudinary} = require("../utils/cloudinary");

const postController = {
    createPost: async (req, res) => {
        try{
            const users = await User.findById(req.body.userId);
            if (req.body.imageUrl){
                const result = await cloudinary.uploader.upload(req.body.imageUrl, {
                    upload_preset: "post_image",
                });

                const makePost = {
                    ...req.body,
                    imageUrl: result.secure_url,
                    cloudinaryId: result.public_id,
                    username: users.username,
                    avaUrl: users.profilePicture,
                    theme: users.theme,
                }

                const newPost = new Post(makePost);

                try{
                    const savedPost = await newPost.save();
                }catch(err){
                    if (result) {
                        await cloudinary.uploader.destroy(result.secure_url);
                    }
                    return res.status(500).json(err);
                }
                
                return res.status(200).json(savedPost);
            } else {
                const makePost = {
                    ...req.body,
                    username: users.username,
                    avaUrl: users.profilePicture,
                    theme: users.theme,
                };
                const newPost = new Post(makePost);
                const savedPost = await newPost.save();
                return res.status(200).json(savedPost);
            }
        }catch(err){
            res.status(500).json(err);
        }
    },

    updatePost: async (req, res) => {
        try{
            const post = await Post.findById(req.params.id.trim());
            if (post.userId === req.body.userId){
                await post.updateOne({ $set: req.body });
                res.status(200).json({
                    message : "Post has been updated"});
            }else{
                return res.status(403).json({
                    message: "You can only update your post"});
            }
        }catch(err){
            res.status(500).json(err);
        }
    },

    deletePost: async (req, res) => {
        try{
            const post = await Post.findById(req.params.id);
            if (post.cloudinaryId) {
                await cloudinary.uploader.destroy(post.cloudinaryId);
            }
            await Post.findByIdAndDelete(req.params.id);
            res.status(200).json({
                message: "Delete post succesfully"
            });
        }catch(err){
            res.status(500).json(err);
        }
    },

    getPostsFromOne: async (req, res) => {
        try{
            const post = await Post.find({ userId: req.params.id });
            res.status(200).json({
                data: post
            });
        }catch(err){
            res.status(500).json(err);
        }
    },

    getAPost: async (req, res) => {
        try{
          const post = await Post.findById(req.params.id);
          res.status(200).json(post);
        }catch(err){
          return  res.status(500).json(err);
        }
    },

    getAllPosts: async (req, res) => {
        try {
          res.status(200).json(res.paginatedResults);
        } catch (err) {
          return res.status(500).json(err);
        }
    },

    getFriendsPost: async (req, res) => {
        try {
          const currentUser = await User.findById(req.body.userId);
          const userPost = await Post.find({ userId: req.body.userId });
          const friendPost = await Promise.all(
            currentUser.followings.map((friendId) => {
              return Post.find({ userId: friendId });
            })
          );
          res.status(200).json(userPost.concat(...friendPost));
        } catch (err) {
          res.status(500).json(err);
        }
    },
    
    upvotePost: async (req, res) => {
        try {
          const post = await Post.findById(req.params.id.trim());
          if (
            !post.upvotes.includes(req.body.userId) &&
            post.downvotes.includes(req.body.userId)
          ) {
            await post.updateOne({ $push: { upvotes: req.body.userId } });
            await post.updateOne({ $pull: { downvotes: req.body.userId } });
            await User.findOneAndUpdate(
              { _id: post.userId },
              { $inc: { karmas: 10 } }
            );
            return res.status(200).json("Post is upvoted!");
          } else if (
            !post.upvotes.includes(req.body.userId) &&
            !post.downvotes.includes(req.body.userId)
          ) {
            await post.updateOne({ $push: { upvotes: req.body.userId } });
            await User.findOneAndUpdate(
              { _id: post.userId },
              { $inc: { karmas: 10 } }
            );
            return res.status(200).json("Post is upvoted!");
          } else if (post.upvotes.includes(req.body.userId)) {
            await post.updateOne({ $pull: { upvotes: req.body.userId } });
            await User.findOneAndUpdate(
              { _id: post.userId },
              { $inc: { karmas: -10 } }
            );
            return res.status(200).json("Post is no longer upvoted!");
          }
        } catch (err) {
          return res.status(500).json(err);
        }
      },

    downvotePost: async (req, res) => {
        try {
          const post = await Post.findById(req.params.id.trim());
          if (
            !post.downvotes.includes(req.body.userId) &&
            post.upvotes.includes(req.body.userId)
          ) {
            await post.updateOne({ $push: { downvotes: req.body.userId } });
            await post.updateOne({ $pull: { upvotes: req.body.userId } });
            //POST OWNER LOSES KARMAS FROM THE DOWNVOTES
            await User.findOneAndUpdate(
              { _id: post.userId },
              { $inc: { karmas: -10 } }
            );
            return res.status(200).json("Post is downvoted!");
          } else if (
            !post.downvotes.includes(req.body.userId) &&
            !post.upvotes.includes(req.body.userId)
          ) {
            await post.updateOne({ $push: { downvotes: req.body.userId } });
            await User.findOneAndUpdate(
              { _id: post.userId },
              { $inc: { karmas: -10 } }
            );
            return res.status(200).json("Post is downvoted!");
          } else if (post.downvotes.includes(req.body.userId)) {
            await post.updateOne({ $pull: { downvotes: req.body.userId } });
            await User.findOneAndUpdate(
              { _id: post.userId },
              { $inc: { karmas: 10 } }
            );
            return res.status(200).json("Post is no longer downvoted!");
          }
        } catch (err) {
          return res.status(500).json(err);
        }
    },

    addFavoritePost: async (req, res) => {
        try {
          const user = await User.findById(req.body.userId);
          //if post is not in favorite yet
          if (!user.favorites.includes(req.params.id)) {
            await User.findByIdAndUpdate(
              { _id: req.body.userId },
              {
                $push: { favorites: req.params.id },
              },
              { returnDocument: "after" }
            );
            return res.status(200).json("added to favorites");
          } else {
            await User.findByIdAndUpdate(
              { _id: req.body.userId },
              {
                $pull: { favorites: req.params.id },
              }
            );
            return res.status(200).json("removed from favorites");
          }
        } catch (err) {
          res.status(500).json(err);
        }
    },
    
    getFavoritePosts: async (req, res) => {
        try {
          const currentUser = await User.findById(req.body.userId);
          const favoritePost = await Promise.all(
            currentUser.favorites.map((id) => {
              return Post.findById(id);
            })
          );
          res.status(200).json(favoritePost);
        } catch (err) {
          res.status(500).json(err);
        }
    },
};

module.exports = postController;