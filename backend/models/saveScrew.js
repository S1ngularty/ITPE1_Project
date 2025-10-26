const mongoose = require("mongoose");

const saveScrewSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    savedScrews: [
      {
        screwId: {
          type: mongoose.Schema.Types.ObjectId,
          required: true,
          ref: "Screw",
        },
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("SaveScrew", saveScrewSchema);
