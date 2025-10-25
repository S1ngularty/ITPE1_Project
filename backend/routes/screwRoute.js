const express = require("express");
const router = express.Router();
const upload = require("../middleware/multer");
const screwController = require("../controllers/screwController");

router.post("/screw", upload.array("images", 3), screwController.create);
router.get("/screw",screwController.fetchScrews)
router.get("/screw/:screwId",screwController.getScrewById )
module.exports = router;
