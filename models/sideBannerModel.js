const mongoose = require("mongoose");

const sideBannerSchema = new mongoose.Schema(
  {
    image: {
      type: String, // You can store the URL of the uploaded image
      required: true,
    },
    tags: {
      type: [String], // Array of tags associated with the banner
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

const SideBanner = mongoose.model("SideBanner", sideBannerSchema);

module.exports = SideBanner;
