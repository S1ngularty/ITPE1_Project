const mongoose = require("mongoose");

const screwSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "screw name must be provided"],
    unique: true,
  },
  category: {
    default: "Machine Screw",
    enum: ["Wood Screw", "Machine Screw", "Structural Fastener"],
  },
  sizes: {
    type: Array,
    required: true,
  },
  material: {
    type: String,
    required: true,
  },
  driverType: {
    type: String,
  },
  threadedType: {
    type: String,
  },
  strength: {
    type: String,
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
