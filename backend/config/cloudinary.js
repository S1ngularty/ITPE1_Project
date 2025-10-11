const cloudinary = require("cloudinary").v2;

  cloudinary.config({
    cloud_name:"dhcvwva85",
    api_key:"141158518292189",
    api_secret:"AxP8zHrBZhQgLix_xpMaIDZn0",
  });

  console.log(process.env.CLOUDINARY_API_KEY)

module.exports = cloudinary;
