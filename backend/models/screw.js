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
    enum: ["Wood Screw", "Machine Screw", "Structural Fastener", "Anchor Screw"],
  },
  sizes: {
    type: [Number],
    required: true,
  },
  material: {
    type: String,
    required: true,
  },
  driverType: {
    type: String,
    default: "Phillips",
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
