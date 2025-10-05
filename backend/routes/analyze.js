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
    // Prepare FormData for first Roboflow detection model (screw name/type)
    const formData = new FormData();
    formData.append("file", fs.createReadStream(req.file.path));

    // Prepare base64 for second Roboflow model (screw head classification)
    const imageBase64 = fs.readFileSync(req.file.path, { encoding: "base64" });

    // Send both requests in parallel
    const [screwNameResponse, screwHeadResponse] = await Promise.all([
      // 1️⃣ Roboflow detection model for screw name/type
      axios.post(
        "https://detect.roboflow.com/screw_classify-tnjdl/1",
        formData,
        {
          headers: {
            ...formData.getHeaders(),
          },
          params: {
            api_key: process.env.ROBOFLOW_API_KEY || "YxFc6R5mRsUrSOBqrF0S",
          },
        }
      ),

      // 2️⃣ Roboflow hosted model for screw head type
      axios({
        method: "POST",
        url: "https://serverless.roboflow.com/screw-classification-xu5uf/1",
        params: {
          api_key: process.env.ROBOFLOW_API_KEY || "YxFc6R5mRsUrSOBqrF0S",
        },
        data: imageBase64,
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
      }),
    ]);
    console.log(screwNameResponse.data);

    // Clean up temp file
    fs.unlink(req.file.path, () => {});
    // Extract screw name prediction
    const classificationData = screwNameResponse.data;
  
    // Return merged results
    return res.json({
      success: true,
      classificationData,
      screw_head_classification: screwHeadResponse.data || {},
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
