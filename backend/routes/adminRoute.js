const express = require("express")
const router = express.Router()

const adminController = require("../controllers/adminController")
const authMiddleware = require("../middleware/auth")

router.get("/admin/dashboard",adminController.getDashboard)


module.exports = router