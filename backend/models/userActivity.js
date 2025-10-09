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
    typeOfService:{
        type:String,
        default: null,
        enum:["classification","count"]
    },
    save:{
        type: Boolean,
        default:false
    },

},
{timestamps:true})

module.exports = mongoose.model("UserActivity", userActivitySchema)
