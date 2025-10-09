const express = require("express");
const multer = require("multer");

const mlController = require("../controllers/mlController")
const upload = multer({ dest: "tmp_uploads/" });
const router = express.Router();



router.post("/classify", upload.single("image"), mlController.ml_classify);
router.post("/count",upload.single("image"),mlController.ml_count)


module.exports = router;
