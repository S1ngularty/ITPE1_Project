const express = require("express");
const multer = require("multer");
const fs = require("fs");
const axios = require("axios");
const FormData = require("form-data");

const upload = multer({ dest: "tmp_uploads/" });
const router = express.Router();

// API route that accepts image from frontend
router.post("/analyze", upload.single("image"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, error: "No file uploaded" });
    }

    // Prepare form data to send to Python
    const form = new FormData();
    form.append("file", fs.createReadStream(req.file.path));

    // Send to Python service
    const pyResponse = await axios.post("http://127.0.0.1:5001/analyze", form, {
      headers: form.getHeaders(),
    });

    // Delete temp file after sending
    fs.unlinkSync(req.file.path);

    // Send Python’s result back to frontend
    res.json(pyResponse.data);
  } catch (err) {
    console.error("Error communicating with ML service:", err.message);
    res.status(500).json({ success: false, error: "ML service error" });
  }
});

module.exports = router;
