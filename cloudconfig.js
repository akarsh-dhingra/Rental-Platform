const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

cloudinary.config({
    // APNE BACKEND KO CLOUDINARY account SA JODNA HAI !
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET,
    // .env mai kuch bhi naam dede doesn't matter but 
    // joh apna .config hai usme  
// Form(file)->backend(parse)->cloud(store)->URL/LINK -> save in mongodb
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'wanderlust_DEV',
    allowedFormats: ["png","jpg","jpeg"], 
  },
});

module.exports ={
cloudinary,
storage
};
