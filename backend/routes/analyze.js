const express = require("express");
const multer = require("multer");
const fs = require("fs");
const axios = require("axios");
const FormData = require("form-data");

const upload = multer({ dest: "tmp_uploads/" });
const router = express.Router();

router.post("/analyze1", upload.single("image"), async (req, res) => {
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

router.post("/analyze", upload.single("image"), async (req, res) => {
  try {
    if (!req.file) {
      return res
        .status(400)
        .json({ success: false, error: "No file uploaded" });
    }
    console.log("RF_KEY:", process.env.ROBOFLOW_API_KEY);

    const apiKey = process.env.ROBOFLOW_API_KEY; // check this prints a value
    const modelUrl =
      "https://classify.roboflow.com/screw_classification-mhe9w-instant-2";
    // 👆 confirm in Roboflow dashboard

    const imgBuffer = fs.readFileSync(req.file.path);

    const rfRes = await axios.post(`${modelUrl}?api_key=${apiKey}`, imgBuffer, {
      headers: { "Content-Type": "application/octet-stream" },
    });

    fs.unlink(req.file.path, () => {});

    return res.json({ success: true, result: rfRes.data });
  } catch (err) {
    console.error(
      "Error calling Roboflow classify:",
      err.response?.data || err.message
    );
    return res.status(500).json({
      success: false,
      error: err.response?.data || err.message,
    });
  }
});

module.exports = router;
