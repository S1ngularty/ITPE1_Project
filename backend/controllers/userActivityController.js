const {saveUploads, fetchSaveAnalysis} = require("../services/userActivityService")


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


const fetchAnalysis= async(req,res)=>{
    try {
        const result = await fetchSaveAnalysis()
        return res.status(200).json({
            success:true,
            result
        })
    } catch (error) {
        console.log(error.message)
        return res.status(500).json({
            success:true,
            error:error.message
        })
    }
}

module.exports = {saveActivity, fetchAnalysis}