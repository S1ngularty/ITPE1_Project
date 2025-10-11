const UserActivity = require("../models/userActivity")
const { uploadToCloudinary,singleImage } = require("./cloudinary");

const recentUploads = async(request)=>{
    if(!request) throw new Error ("no request found")
   const result = await UserActivity.create(request.body)
    if(!result) throw new Error("failed to save as recents")
}

const saveUploads = async(request)=>{
 if(!request) throw new Error("empty request")
if(!request.file) throw new Error("file is not found")
    const uploaded = await singleImage(request.file,)
console.log(uploaded)
}

module.exports = {saveUploads}