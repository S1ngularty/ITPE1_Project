const express = require("express");
const multer = require("multer");

const mlController = require("../controllers/mlController")
const authMiddleware =require("../middleware/auth")
const upload = multer({ dest: "tmp_uploads/" });
const router = express.Router();



router.post("/classify",authMiddleware.verifyToken, upload.single("image"), mlController.ml_classify);
router.post("/count",authMiddleware.verifyToken,upload.single("image"),mlController.ml_count)


module.exports = router;
