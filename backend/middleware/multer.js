const multer = require("multer");
const path = require("path");

module.exports = multer({
  limits: { fileSize: 100 * 1024 * 1024 },
  storage: multer.memoryStorage(),
  fileFilter: (req, file, cb) => {
    let ext = path.extname(file.originalname).toLowerCase();
    if (ext !== ".jpg" && ext !== ".jpeg" && ext !== ".png") {
      console.log("unsupported file type");
      return;
    }
    cb(null, true);
  },
});
