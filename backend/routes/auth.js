const express = require("express");
const router = express.Router();

const authController = require("../controllers/auth");
const userController = require("../controllers/userController")
const authMiddleware = require("../middleware/auth");

router.post("/login", authController.login);
router.post("/register", userController.createUser);

router.post("/authTest", authMiddleware.verifyToken, (req, res) => {
  return res.json(req.user);
});

module.exports = router;
