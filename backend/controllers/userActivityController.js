const {
  saveUploads,
  dashboardInfo,
  fetchSaveAnalysis,
  editSaveAnalyses,
  unsavedAnalyses,
} = require("../services/uploadAnalysis");

const savedScrewService = require("../services/savedScrews");

const saveActivity = async (req, res) => {
  try {
    const result = await saveUploads(req);
    return res.status(200).json({
      success: true,
      result,
    });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

const fetchAnalysis = async (req, res) => {
  try {
    const result = await fetchSaveAnalysis(req);
    return res.status(200).json({
      success: true,
      result,
    });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({
      success: true,
      error: error.message,
    });
  }
};

const getDashboardInfo = async (req, res) => {
  try {
    const result = await dashboardInfo(req.user);
    return res.status(200).json({
      success: true,
      result,
    });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

const editRecordAnalyses = async (req, res) => {
  try {
    const result = await editSaveAnalyses(req);
    return res.status(200).json({
      success: true,
      result,
    });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

const unsaveRecordAnalyses = async (req, res) => {
  try {
    const result = await unsavedAnalyses(req);
    return res.status(200).json({
      success: true,
      result,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      error,
    });
  }
};

const saveScrew = async (req, res) => {
  try {
    const result = await savedScrewService.saveScrew(req);
    return res.status(200).json({
      success: true,
      result,
    });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

const removeToLikes = async (req, res) => {
  try {
    const result = await savedScrewService.removeToLikes(req);
    return res.status(200).json({
      success: true,
      result,
    });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

module.exports = {
  saveActivity,
  fetchAnalysis,
  getDashboardInfo,
  editRecordAnalyses,
  unsaveRecordAnalyses,
  saveScrew,
  removeToLikes
};
