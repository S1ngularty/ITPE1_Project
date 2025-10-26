const express = require("express");
const router = express.Router();
const upload = require("../middleware/multer");
const screwController = require("../controllers/screwController");
const authMiddleware = require("../middleware/auth")

router.post("/screw", upload.array("images", 3), screwController.create);
router.get("/screw",screwController.fetchScrews)
router.get("/screw/:screwId",authMiddleware.checkForAuth,screwController.getScrewById )
module.exports = router;
