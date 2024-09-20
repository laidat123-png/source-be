require('dotenv').config();

const cloudinary = require('cloudinary');

cloudinary.config({
    cloud_name: "dzrwqg5vn",
    api_key: "759674996194753",
    api_secret: 'e_jbWc-ulEKRWxHMp_jOojWPNvs'
})

exports.uploads = (file, folder) => {
    return new Promise(resolve => {
        cloudinary.uploader.upload(file, (result) => {
            resolve({
                url: result.secure_url,
                id: result.public_id
            })
        }, {
            resource_type: "auto",
            folder: folder
        })
    })
}
