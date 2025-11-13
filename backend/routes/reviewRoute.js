const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/auth");
const reviewController = require("../controllers/reviewController");
const review = require("../models/review");

router
  .route("/review")
  .get(authMiddleware.verifyToken, reviewController.getReviews)
  .post(authMiddleware.verifyToken, reviewController.createReview);

module.exports = router;
