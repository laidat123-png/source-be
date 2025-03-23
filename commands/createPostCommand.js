const Post = require('../models/post');
const cloudinary = require('../untils/cloudinary');

class CreatePostCommand {
    constructor(data, file, userID) {
        this.data = data;
        this.file = file;
        this.userID = userID;
    }

    async execute() {
        const uploader = async (path) => await cloudinary.uploads(path, 'postImage');
        if (this.file) {
            const { path } = this.file;
            const uploadRes = await uploader(path);
            this.data.image = uploadRes.url;
        }
        this.data.author = this.userID;
        return await Post.create(this.data);
    }
}

module.exports = CreatePostCommand;