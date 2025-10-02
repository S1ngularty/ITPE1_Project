const express = require("express");
const router = express.Router();

const authController = require("../controllers/auth");
const authMiddleware = require("../middleware/auth");

router.post("/login", authController.login);
router.post("/register", authController.register);

router.post("/authTest", authMiddleware.verifyToken, (req, res) => {
  return res.json(req.user);
});

module.exports = router;
