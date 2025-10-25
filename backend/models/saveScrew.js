const mongoose = require("mongoose");

const saveScrewSchema = mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
  savedScrews: [
    {
      screws: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "Screw",
      },
      savedAt: Date.now(),
    },
  ],
});

module.exports = mongoose.Model("SaveScrew", saveScrewSchema);
