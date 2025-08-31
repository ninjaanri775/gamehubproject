const express = require("express");
const auth = require("../middleware/authMiddleware");
const Offer = require("../models/offer");
const User = require("../models/User");

const router = express.Router();


router.get("/", auth, async (req, res) => {
  const user = await User.findById(req.user._id).populate("favorites");
  res.json(user.favorites || []);
});


router.post("/:offerId", auth, async (req, res) => {
  const { offerId } = req.params;
  const offer = await Offer.findById(offerId);
  if (!offer) return res.status(404).json({ message: "Offer not found" });

  const user = await User.findById(req.user._id);
  const idx = user.favorites.findIndex(id => String(id) === String(offerId));
  if (idx >= 0) user.favorites.splice(idx, 1);
  else user.favorites.push(offerId);

  await user.save();
  const populated = await user.populate("favorites");
  res.json(populated.favorites);
});

module.exports = router;
