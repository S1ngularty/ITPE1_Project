const adminService = require("../services/adminService");

exports.getDashboard = async (req, res) => {
  try {
    const result = await adminService.dashboard();
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
