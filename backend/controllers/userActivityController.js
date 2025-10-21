const userActivity = require("../models/userActivity")
const {saveUploads,dashboardInfo, fetchSaveAnalysis, editSaveAnalyses} = require("../services/userActivityService")


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

 const getDashboardInfo = async(req,res)=>{
    try {
        const result = await dashboardInfo(req.user)
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

const editRecordAnalyses = async(req,res)=>{
    try {
        const result = await editSaveAnalyses(req)
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

module.exports = {saveActivity, fetchAnalysis, getDashboardInfo, editRecordAnalyses}