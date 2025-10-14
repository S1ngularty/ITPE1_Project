const UserActivity = require("../models/userActivity")
const { uploadToCloudinary,singleImage } = require("../utils/cloudinary");

const recentUploads = async(request)=>{
    if(!request) throw new Error ("no request found")
   const result = await UserActivity.create(request.body)
    if(!result) throw new Error("failed to save as recents")
}

const saveUploads = async(request)=>{
 if(!request.body) throw new Error("empty request")
const {activityID} = request.body
if(!activityID) throw new Error("screw ID is indefined")
console.log(activityID)
const updateActivity = await UserActivity.findById(activityID).exec()
updateActivity.saveStatus=true
updateActivity.save()
console.log(updateActivity)
if(!updateActivity) throw new Error("Failed to save the analysis record")
return updateActivity

}

fetchSaveAnalysis = async()=>{
    const savedAnalysis = await UserActivity.find({ saveStatus:true}).populate('user screw').exec()
    if(savedAnalysis.length<1) throw new Error("No saved analysis yet")
    return savedAnalysis
}

module.exports = {saveUploads, fetchSaveAnalysis}