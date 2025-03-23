const Post = require('../models/post');

class DeletePostCommand {
    constructor(id) {
        this.id = id;
    }

    async execute() {
        return await Post.findByIdAndDelete(this.id);
    }
}

module.exports = DeletePostCommand;