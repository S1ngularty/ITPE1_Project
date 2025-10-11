const {saveUploads} = require("../services/userActivityService")


const saveActivity = async(req,res)=>{
    try {
        const result = await saveUploads(req)
        return res.status(200).json({
            success:true,
            result
        })
    } catch (error) {
        console.log(error.message)
        return res.status(500).json({
            success:false,
            error:error.message
        })
    }
}

module.exports = {saveActivity}