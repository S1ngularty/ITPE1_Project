const express = require("express");
const multer = require("multer");
const fs = require("fs");
const axios = require("axios");
const FormData = require("form-data");

const upload = multer({ dest: "tmp_uploads/" });
const router = express.Router();

router.post("/count", upload.single("image"), async (req, res) => {
  try {
    if (!req.file) {
      return res
        .status(400)
        .json({ success: false, error: "No file uploaded" });
    }

    // Read uploaded file as base64
    const imageBase64 = fs.readFileSync(req.file.path, { encoding: "base64" });

    // Roboflow serverless endpoint
    const url = "https://serverless.roboflow.com/screw-kuuzp/2";
    const apiKey = "YxFc6R5mRsUrSOBqrF0S"; // <-- put your key in .env

    const response = await axios({
      method: "POST",
      url,
      params: {
        api_key: apiKey,
        confidence: 0.2, // 👈 filter out predictions below 50% confidence
      },
      data: imageBase64,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });

    // Clean up tmp file
    fs.unlink(req.file.path, () => {});

    return res.json({
      success: true,
      predictions: response.data.predictions || [],
    });
  } catch (err) {
    console.error(
      "Error communicating with Roboflow:",
      err.response?.data || err.message
    );
    res.status(500).json({
      success: false,
      error: err.response?.data || err.message,
    });
  }
});


// ----------------- NEW Classification Route -----------------
router.post("/classify", upload.single("image"), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, error: "No file uploaded" });
  }

  try {
    // Prepare FormData for Flask YOLOv8 service
    const formData = new FormData();
    formData.append("file", fs.createReadStream(req.file.path));

    // Prepare base64 for Roboflow API
    const imageBase64 = fs.readFileSync(req.file.path, { encoding: "base64" });

    // Send both requests in parallel
    const [flaskResponse, roboflowResponse] = await Promise.all([
      // 1️⃣ YOLOv8 Flask service for screw name/type
      axios.post("http://localhost:5001/classify", formData, {
        headers: formData.getHeaders(),
      }),

      // 2️⃣ Roboflow hosted model for screw head type
      axios({
        method: "POST",
        url: "https://serverless.roboflow.com/screw-classification-xu5uf/1",
        params: { api_key: process.env.ROBOFLOW_API_KEY || "YxFc6R5mRsUrSOBqrF0S" },
        data: imageBase64,
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
      }),
    ]);

    // Clean up temp file
    fs.unlink(req.file.path, () => {});

    // Merge results
    return res.json({
      success: true,
      screw_name_classification: flaskResponse.data.classification || {},
      screw_dimensions: flaskResponse.data.dimensions || {},
      screw_head_classification: roboflowResponse.data
    });
  } catch (err) {
    console.error("Error in /classify:", err.response?.data || err.message);
    fs.unlink(req.file.path, () => {});
    return res.status(500).json({
      success: false,
      error: err.response?.data || err.message,
    });
  }
});

module.exports = router;
