const mongoose = require("mongoose");

const screwSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Screw name must be provided"],
    unique: true,
  },
  category: {
    type: String,
    default: "Machine Screw",
    enum: [
      "Wood Screw",
      "Machine Screw",
      "Structural Fastener",
      "Anchor Screw",
    ],
  },
  sizes: [{ type: String }], // General available sizes
  material: {
    type: String,
    required: true,
  },
  driverType: {
    type: String,
    default: "Phillips",
  },
  tool: {
    type: String,
    default: "Phillips screwdriver", // tool to drive the screw
  },
  threadedType: {
    type: String,
    default: "Fully Threaded",
  },
  strength: {
    type: String,
    default: "Standard",
  },
  headType: {
    type: String,
    default: "Flat",
  },
  threadPitch: {
    type: String,
    default: "1.25 mm",
  },
  threadDetails: {
    pitch: { type: String },
    rotation: { type: String, default: "Right-hand" },
    availableSizes: [{ type: String }],
  },
  coating: {
    type: String,
    default: "Zinc Plated",
  },
  application: {
    type: String,
    default: "General fastening applications",
  },
  driveSize: {
    type: String,
    default: "PH2",
  },
  corrosionResistance: {
    type: String,
    default: "Medium",
  },
  torque: {
    maxTorqueNm: { type: Number },
    recommendedTorqueNm: { type: Number },
    recommendedTightness: { type: String }, // New: recommended tightness after scan
  },
  description: {
    type: String,
  },
  images: [
    {
      public_id: {
        type: String,
        required: true,
      },
      url: {
        type: String,
        required: true,
      },
    },
  ],
});

module.exports = mongoose.model("Screw", screwSchema);
