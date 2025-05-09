const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

cloudinary.config({
    cloud_name: process.env.CLOUDYNARY_CLOUD_NAME,
    api_key: process.env.CLOUDYNARY_KEY,
    api_secret: process.env.CLOUDYNARY_SECRET
});

const storage = new CloudinaryStorage({
    cloudinary,
    folder: 'YelpCamp',
    allowed_formats: ['jpeg', 'png', 'jpg']
});

module.exports = {
    cloudinary,
    storage
}