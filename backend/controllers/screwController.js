const screwService = require("../services/screwService");

exports.create = async (req, res) => {
  try {
    const result = await screwService.createScrew(req.body, req.files);
    return res.status(200).json({ success: true, result });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

exports.fetchScrews= async(req,res)=>{
 try {
    const result = await screwService.getScrews(req.query);
    return res.status(200).json({ success: true, result });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
}

exports.getScrewById= async(req,res)=>{
 try {
    const result = await screwService.getSpecificScrew(req);
    return res.status(200).json({ success: true, result });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
}

