const mongoose = require("mongoose")

const userActivitySchema = new mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    screw:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Screw",
        required:true
    },
},
{timestamps:true})

module.exports = mongoose.model("UserActivity", userActivitySchema)
