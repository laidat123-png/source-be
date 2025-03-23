const Post = require('../models/post');
const cloudinary = require('../untils/cloudinary');

class UpdatePostCommand {
    constructor(id, data, file) {
        this.id = id;
        this.data = data;
        this.file = file;
    }

    async execute() {
        const uploader = async (path) => await cloudinary.uploads(path, 'postImage');
        if (this.file) {
            const { path } = this.file;
            const uploadRes = await uploader(path);
            this.data.image = uploadRes.url;
        }
        return await Post.findByIdAndUpdate(this.id, this.data, { new: true });
    }
}

module.exports = UpdatePostCommand;