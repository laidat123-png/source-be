const Post = require('../models/post');
const Comment = require('../models/comment');

class AddCommentCommand {
    constructor(postID, commentData, userID) {
        this.postID = postID;
        this.commentData = commentData;
        this.userID = userID;
    }

    async execute() {
        const comment = await Comment.create({ ...this.commentData, author: this.userID });
        const post = await Post.findById(this.postID);
        post.comment.unshift(comment._id);
        await post.save();
        return { post, commentID: comment._id };
    }
}

module.exports = AddCommentCommand;