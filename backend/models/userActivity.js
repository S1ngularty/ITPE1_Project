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
        default:null
    },
    typeOfService:{
        type:String,
        default: null,
        enum:["classification","count"]
    },
    saveStatus:{
        type: Boolean,
        default:false
    },
    uploadedImage:{
        public_id:{
            type:String,
            required:true,
        },
        url:{
            type:String,
            required:true
        }
    }

},
{timestamps:true})

module.exports = mongoose.model("UserActivity", userActivitySchema)
