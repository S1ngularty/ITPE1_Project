const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/auth");
const userController = require("../controllers/userController");
// router.get("/user",authMiddleware.verifyToken, userController.userList);
router.get("/user", authMiddleware.verifyToken, userController.getUser);
router.post("/user", authMiddleware.verifyToken, userController.update);
router.patch(
  "/user/updatePassword",
  authMiddleware.verifyToken,
  userController.updatePassword
);
router.delete("/user/:user", userController.userDelete);

module.exports = router;
