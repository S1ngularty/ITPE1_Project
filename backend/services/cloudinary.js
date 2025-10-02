const cloudinary = require("../config/cloudinary");
const streamifier = require("streamifier");

exports.uploadToCloudinary = async (fileBuffer) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder: "react-shop" },
      (err, result) => {
        if (err) return reject(err);
        return resolve(result);
      }
    );
    streamifier.createReadStream(fileBuffer).pipe(uploadStream);
  });
};

exports.destroyImage = (id) => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.destroy(id, (error, result) => {
      if (error) reject(error);
      resolve(result);
    });
  });
};
