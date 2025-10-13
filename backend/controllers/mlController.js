const mlService = require("../services/mlService");

const ml_count = async (req, res) => {
  try {
    const result = await mlService.count(req);
    // console.log(result.response.data,result.storeRecent)
    return res.status(200).json({
      success: true,
      predictions: result.response.data.predictions || [],
      storeRecent: result.storeRecent
    });
  } catch (error) {
    console.error(
      "Error:",error.message
    );
    res.status(500).json({
      success: false,
      error:error.message,
      
    });
  }
};

const ml_classify = async (req, res) => {
  try {
    const result = await mlService.classify(req);
    console.log(result)
    return res.status(200).json({ success: true, result:result.screwDocument, storeRecent:result.storeRecent });
  } catch (error) {
    // console.log(error.message);
    return res.status(500).json({ success: false, error: error.message });
  }
};

module.exports = { ml_classify, ml_count };
