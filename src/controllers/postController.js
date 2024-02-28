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
};

module.exports = postController;