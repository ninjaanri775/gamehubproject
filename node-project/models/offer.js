const mongoose = require("mongoose");

const allowedCategories = [
  // Outdoor
  "tennis",
  "football",
  "padel",
  "carting",
  "warsoft",
  // Indoor
  "MMA",
  "fitness halls",
  "gaming",
  "billiard",
  "table tennis",
  "arcade games"
];

const offerSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  title: { type: String, trim: true },
  priceValue: { type: Number, required: true, min: 0 },
  priceText: { type: String, required: true },
  location: { type: String, required: true, trim: true },
  discount: { type: Number, default: 0, min: 0, max: 100 },
  category: { type: String, enum: allowedCategories, required: true },
  image: { type: String }
}, { timestamps: true });

module.exports = mongoose.model("Offer", offerSchema);
module.exports.allowedCategories = allowedCategories; // export for validation elsewhere
