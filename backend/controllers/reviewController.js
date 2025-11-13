const reviewService = require("../services/reviewService");

exports.getReviews = async (req, res) => {
  try {
    const result = await reviewService.list();
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

exports.createReview = async (req, res) => {
  try {
    const result = await reviewService.create(req);
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
