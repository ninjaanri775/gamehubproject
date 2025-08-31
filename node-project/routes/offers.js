const express = require("express");
const Joi = require("joi");
const auth = require("../middleware/authMiddleware");
const isAdmin = require("../middleware/isAdmin");
const multer = require("multer");
const Offer = require("../models/offer");

const router = express.Router();
const { allowedCategories } = require("../models/offer");

// Multer config
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); // folder to save images
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + "-" + file.originalname);
  },
});
const upload = multer({ storage });

// Joi validation schema for creating offer
const createSchema = Joi.object({
  name: Joi.string().required(),
  title: Joi.string().optional(),
  priceValue: Joi.number().min(0).required(),
  priceText: Joi.string().required(),
  location: Joi.string().required(),
  discount: Joi.number().min(0).max(100).optional(),
  category: Joi.string().valid(...allowedCategories).required(),
});

// GET all offers
// GET all offers
router.get("/", async (req, res) => {
  try {
    const { search = "", min, max, category, sort } = req.query;

    const pipeline = [];

    if (search) {
      const words = search.trim().split(/\s+/);
      const q = {
        $or: words.flatMap((word) => [
          { name: { $regex: word, $options: "i" } },
          { title: { $regex: word, $options: "i" } },
          { location: { $regex: word, $options: "i" } },
          { category: { $regex: word, $options: "i" } },
        ]),
      };
      pipeline.push({ $match: q });
    }

    if (category) {
      pipeline.push({ $match: { category } });
    }

    // Random selection if no search or filters
    if (!search && !category && !min && !max) {
      pipeline.push({ $sample: { size: 20 } }); // return 20 random offers
    } else {
      // Compute effectivePrice for sorting/filtering
      pipeline.push({
        $addFields: {
          effectivePrice: {
            $cond: [
              { $gt: ["$discount", 0] },
              { $multiply: ["$priceValue", { $subtract: [1, { $divide: ["$discount", 100] }] }] },
              "$priceValue",
            ],
          },
        },
      });

      // Apply min/max filters
      if (min || max) {
        const priceFilter = {};
        if (min) priceFilter.$gte = Number(min);
        if (max) priceFilter.$lte = Number(max);
        pipeline.push({ $match: { effectivePrice: priceFilter } });
      }

      // Sorting
      if (sort === "price_asc") pipeline.push({ $sort: { effectivePrice: 1 } });
      else if (sort === "price_desc") pipeline.push({ $sort: { effectivePrice: -1 } });
      else pipeline.push({ $sort: { createdAt: -1 } });
    }

    const offers = await Offer.aggregate(pipeline);
    res.json(offers);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message, stack: err.stack });
  }
});

// POST create offer
router.post("/", auth, isAdmin, async (req, res) => {
  try {
    upload.single("image")(req, res, async function (err) {
      if (err) return res.status(400).json({ message: err.message });

      const { error } = createSchema.validate(req.body);
      if (error) return res.status(400).json({ message: error.details[0].message });

      const offerData = {
        ...req.body,
        priceValue: Number(req.body.priceValue),
        image: req.file?.path,
      };

      const created = await Offer.create(offerData);
      res.status(201).json(created);
    });
  } catch (err) {
    console.error("POST OFFER ERROR:", err);
    res.status(500).json({ message: err.message, stack: err.stack });
  }
});

// DELETE offer
router.delete("/:id", auth, isAdmin, async (req, res) => {
  try {
    const deleted = await Offer.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Offer not found" });
    res.json({ message: "Offer deleted" });
  } catch (err) {
    console.error("DELETE OFFER ERROR:", err);
    res.status(500).json({ message: err.message, stack: err.stack });
  }
});

module.exports = router;
