const express = require("express");
const multer = require("multer");
const fs = require("fs");
const axios = require("axios");
const FormData = require("form-data");

const mlController = require("../controllers/mlController")
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

router.post("/classify", upload.single("image"), mlController.ml_classify);

router.post("/roboflow-classify", upload.single("image"), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, error: "No file uploaded" });
  }

  try {
    const formData = new FormData();
    formData.append("file", fs.createReadStream(req.file.path));

    const roboflowResponse = await axios.post(
      "https://detect.roboflow.com/screw_classify-tnjdl/1",
      formData,
      {
        headers: {
          ...formData.getHeaders(), // important for multipart
        },
        params: {
          api_key: "YxFc6R5mRsUrSOBqrF0S", // your Roboflow API key
        },
      }
    );

    fs.unlink(req.file.path, () => {}); // delete temp file
    return res.json({ success: true, result: roboflowResponse.data });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
