const express = require("express");
const router = express.Router();
const multer = require("multer")
const upload = multer({ dest: "tmp_uploads/" });
const authMiddleware = require("../middleware/auth");
const userController = require("../controllers/userController");
const userActivityController= require("../controllers/userActivityController")
// router.get("/user",authMiddleware.verifyToken, userController.userList);
router.get("/user", authMiddleware.verifyToken, userController.getUser);
router.post("/user", authMiddleware.verifyToken, userController.update);
router.patch(
  "/user/updatePassword",
  authMiddleware.verifyToken,
  userController.updatePassword
);
router.delete("/user/:user", userController.userDelete);
router.get("/getUser",authMiddleware.verifyToken,userController.getName)
//activity
router.post("/saveActivity",authMiddleware.verifyToken,upload.single('image'),userActivityController.saveActivity)
router.get("/savedAnalysis",authMiddleware.verifyToken,userActivityController.fetchAnalysis)

router.post("/password-recovery",userController.recoverPassword)
router.post("/reset-password/:token",userController.recovery_setNewPassword)

router.get("/getDashboard",authMiddleware.verifyToken, userActivityController.getDashboardInfo)

router.post("/saved/:analysesRecordId",authMiddleware.verifyToken,userActivityController.editRecordAnalyses)
router.post("/unsaved",authMiddleware.verifyToken,userActivityController.unsaveRecordAnalyses)

router.post("/likes/add",authMiddleware.verifyToken,userActivityController.saveScrew)
router.post("/likes/remove",authMiddleware.verifyToken,userActivityController.removeToLikes)



module.exports = router;
