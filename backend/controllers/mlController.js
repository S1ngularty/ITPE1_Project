const mlService = require("../services/mlService");

const ml_count = async (req, res) => {
  try {
    const result = await mlService.count(req);
    return res.status(200).json({
      success: true,
      predictions: response.data.predictions || [],
    });
  } catch (error) {
    console.error(
      "Error communicating with Roboflow:",
      err.response?.data || err.message
    );
    res.status(500).json({
      success: false,
      error: err.response?.data || err.message,
    });
  }
};

const ml_classify = async (req, res) => {
  try {
    const result = await mlService.classify(req);
    // console.log(result)
    return res.status(200).json({ success: true, result });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ success: false, error: error.message });
  }
};

module.exports = { ml_classify, ml_count };
