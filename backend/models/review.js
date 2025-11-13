const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
  analysis: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "UploadAnalysis",
    required: true,
  },
  rating: {
    type: Number,
    min: 1,
    max: 5,
    required: true, // Consider making this required if you want ratings
  },
  comment: {
    type: String,
    required: true,
    maxlength: 1000, // Add character limit
  },
  type: {
    type: String,
    enum: ["bug", "feature_request", "general_feedback", "accuracy_issue"],
    default: "general_feedback",
  },
  helpfulCount: {
    type: Number,
    default: 0,
  },
  reportCount: {
    type: Number,
    default: 0,
  },
}, {
  timestamps: true, // Adds createdAt and updatedAt automatically
});

module.exports = mongoose.model("Review", reviewSchema);