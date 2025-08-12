const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');


// Configure Cloudinary with your credentials(make connection btw backand and cloudinary)
cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET
});

// Create a storage object with Cloudinary (make folder name dynamic if needed)
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'wanderlust_DEV', // The folder in Cloudinary where images will be stored
    allowed_formats: ['jpg', 'png', 'jpeg','avif','webp'], // Allowed file formats
  },
});

module.exports = {
    cloudinary,
    storage
}