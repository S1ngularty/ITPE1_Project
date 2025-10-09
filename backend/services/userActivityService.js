const UserActivity = require("../models/userActivity")

const recentUploads = async(request)=>{
    if(!request) throw new Error ("no request found")
   const result = await UserActivity.create(request.body)
    if(!result) throw new Error("failed to save as recents")
}