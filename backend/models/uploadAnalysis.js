const mongoose = require("mongoose");

const UploadAnalysisSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      default: `Analysis-${Date.now()}-${new Date().getMilliseconds()}`,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    screw: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Screw",
      default: null,
    },
    count: {
      type: Number,
      default: null,
    },
    typeOfService: {
      type: String,
      default: null,
      enum: ["classification", "count"],
    },
    saveStatus: {
      type: Boolean,
      default: false,
    },
    uploadedImage: {
      public_id: {
        type: String,
        required: true,
      },
      url: {
        type: String,
        required: true,
      },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("UploadAnalysis", UploadAnalysisSchema);
