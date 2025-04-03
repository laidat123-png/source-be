const Post = require("../models/post");
const cloudinary = require('../untils/cloudinary');
const User = require("../models/user");
const Comment = require("../models/comment");
const CreatePostCommand = require('../commands/createPostCommand');
const UpdatePostCommand = require('../commands/updatePostCommand');
const DeletePostCommand = require('../commands/deletePostCommand');
const AddCommentCommand = require('../commands/addCommentCommand');
const DeleteCommentCommand = require('../commands/deleteCommentCommand');

exports.getAllPost = async (req, res) => {
    try {
        const posts = await Post.find({})
            .populate("author", "firstName lastName")
            .populate("comment")
            .sort("-createdAt");
        res.json({
            status: "success",
            posts
        });
    } catch (err) {
        res.json({
            status: "failed",
            err
        });
    }
};

exports.getPostByPage = async (req, res) => {
    try {
        let limit = Math.abs(req.query.limit) || 5;
        let page = (Math.abs(req.query.page) || 1) - 1;
        const posts = await Post.find({})
            .limit(limit)
            .skip(page * limit)
            .populate("author", "firstName lastName")
            .populate("comment")
            .sort('-createdAt');
        const totalPosts = await Post.countDocuments({});
        const totalPages = Math.ceil(totalPosts / limit);
        res.json({
            status: "success",
            posts,
            totalPages
        });
    } catch (err) {
        res.json({
            status: 'failed',
            err
        });
    }
};

exports.createOnePost = async (req, res) => {
    try {
        const { userID } = req.user;
        const data = JSON.parse(req.body.post);
        const file = req.files[0];
        const createPostCommand = new CreatePostCommand(data, file, userID);
        const newPost = await createPostCommand.execute();
        res.json({
            status: "success",
            post: newPost
        });
    } catch (err) {
        res.json({
            status: 'failed',
            err
        });
    }
};

exports.updatePost = async (req, res) => {
    try {
        const { id } = req.params;
        const data = JSON.parse(req.body.post);
        const file = req.files[0];
        const updatePostCommand = new UpdatePostCommand(id, data, file);
        const updatedPost = await updatePostCommand.execute();
        res.json({
            status: "success",
            post: updatedPost
        });
    } catch (err) {
        res.json({
            status: 'failed',
            err
        });
    }
};

exports.getOnePost = async (req, res) => {
    try {
        const { id } = req.params;
        const post = await Post.findById(id)
            .populate("author", "firstName lastName")
            .populate({
                path: "comment._id",
                populate: {
                    path: "author",
                    select: "firstName lastName image"
                }
            })
            .populate({
                path: "comment._id",
                populate: {
                    path: "reply._idReply",
                    populate: {
                        path: "author",
                        select: "firstName lastName image"
                    }
                }
            });
        res.json({
            status: "success",
            post
        });
    } catch (err) {
        res.json({
            status: "failed",
            err
        });
    }
};

exports.deletePost = async (req, res) => {
    try {
        const { id } = req.params;
        const { userID } = req.user;
        const admin = await User.findById(userID);
        if (admin.role === "admin") {
            const deletePostCommand = new DeletePostCommand(id);
            await deletePostCommand.execute();
            res.json({
                status: "success",
            });
        } else {
            res.json({
                status: "failed",
                messenger: "Bạn không phải admin"
            });
        }
    } catch (err) {
        res.json({
            status: 'failed',
            err
        });
    }
};

exports.findPostByTitle = async (req, res) => {
    try {
        const { keyword } = req.body;
        const result = await Post.find({
            title: { $regex: keyword, $options: "i" }
        })
            .populate("author", "firstName lastName")
            .populate("comment")
            .limit(5);
        res.json({
            status: "success",
            posts: result
        });
    } catch (err) {
        res.json({
            status: 'failed',
            err
        });
    }
};

exports.addCommentToPost = async (req, res) => {
    try {
        const { userID } = req.user;
        const { id } = req.params;
        const addCommentCommand = new AddCommentCommand(id, req.body, userID);
        const { post, commentID } = await addCommentCommand.execute();
        res.json({
            status: "success",
            result: post,
            idCmt: commentID
        });
    } catch (err) {
        res.json({
            status: "failed",
            err
        });
    }
};

exports.replyComment = async (req, res) => {
    try {
        const { id } = req.params;
        const { content, userID } = req.body;
        const cmt = await Comment.findById(id);
        const replyCmt = await Comment.create({
            content: content,
            author: userID
        });
        cmt.reply.unshift({ _idReply: replyCmt._id });
        await cmt.save();
        res.json({
            status: "success",
            replyCmt
        });
    } catch (err) {
        res.json({
            status: "failed",
            err
        });
    }
};

exports.deleteComment = async (req, res) => {
    try {
        const { idPost, idCmt } = req.params;
        const deleteCommentCommand = new DeleteCommentCommand(idPost, idCmt);
        const post = await deleteCommentCommand.execute();
        res.json({
            status: "success",
            messenger: "Xóa bình luận thành công",
            post
        });
    } catch (err) {
        res.json({
            status: "failed",
            messenger: "Xóa bình luận thất bại",
            err
        });
    }
};
// exports.getAllPost = async (req, res) => {
//     try {
//         const posts = await Post.find({})
//             .populate("author", "firstName lastName")
//             .populate("comment")
//             .sort("-createdAt");
//         res.json({
//             status: "success",
//             posts
//         });
//     } catch (err) {
//         res.json({
//             status: "failed",
//             err
//         });
//     }
// };