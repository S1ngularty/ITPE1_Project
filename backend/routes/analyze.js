const express = require("express");
const multer = require("multer");
const fs = require("fs");
const axios = require("axios");

const upload = multer({ dest: "tmp_uploads/" });
const router = express.Router();

router.post("/analyze", upload.single("image"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, error: "No file uploaded" });
    }

    // Read uploaded file as base64
    const imageBase64 = fs.readFileSync(req.file.path, { encoding: "base64" });

    // Roboflow serverless endpoint
    const url = "https://serverless.roboflow.com/screw-kuuzp/2";
    const apiKey = "YxFc6R5mRsUrSOBqrF0S"; // <-- put your key in .env

    const response = await axios({
      method: "POST",
      url,
      params: { api_key: apiKey,
         confidence: 0.2   // 👈 filter out predictions below 50% confidence
       },
      data: imageBase64,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      }
    });

    // Clean up tmp file
    fs.unlink(req.file.path, () => {});

    return res.json({
      success: true,
      predictions: response.data.predictions || [],
    });
  } catch (err) {
    console.error("Error communicating with Roboflow:", err.response?.data || err.message);
    res.status(500).json({
      success: false,
      error: err.response?.data || err.message,
    });
  }
});

module.exports = router;
