const Post = require('../models/post');
const Comment = require('../models/comment');

class DeleteCommentCommand {
    constructor(postID, commentID) {
        this.postID = postID;
        this.commentID = commentID;
    }

    async execute() {
        const post = await Post.findById(this.postID);
        post.comment = post.comment.filter(cmt => cmt._id.toString() !== this.commentID);
        await post.save();
        await Comment.findByIdAndDelete(this.commentID);
        return post;
    }
}

module.exports = DeleteCommentCommand;