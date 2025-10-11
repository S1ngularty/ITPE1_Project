const UserActivity = require("../models/userActivity")
const { uploadToCloudinary,singleImage } = require("./cloudinary");

const recentUploads = async(request)=>{
    if(!request) throw new Error ("no request found")
   const result = await UserActivity.create(request.body)
    if(!result) throw new Error("failed to save as recents")
}

const saveUploads = async(request)=>{
 if(!request.body) throw new Error("empty request")
const {screw_id} = request.body
if(!screw_id) throw new Error("screw ID is indefined")
console.log(screw_id)
const updateActivity = await UserActivity.findOne({user:request.user.userId, screw:screw_id}).exec()
updateActivity.saveStatus=true
updateActivity.save()
console.log(updateActivity)
if(!updateActivity) throw new Error("Failed to save the analysis record")
return updateActivity

}

module.exports = {saveUploads}