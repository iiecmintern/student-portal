const express = require("express");
const Franchise = require("../models/Franchise");
const { authenticateToken, requireAdmin } = require("../middleware/auth");

const router = express.Router();

// CREATE or UPDATE franchise content (upsert)
router.post("/", authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { intro, eligibility, howToApply, models } = req.body;

    let franchise = await Franchise.findOne();
    if (franchise) {
      // update existing
      franchise.intro = intro;
      franchise.eligibility = eligibility;
      franchise.howToApply = howToApply;
      franchise.models = models;
      await franchise.save();
    } else {
      // create new
      franchise = await Franchise.create({ intro, eligibility, howToApply, models });
    }

    res.status(200).json({ success: true, franchise });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET franchise content (public)
router.get("/", async (req, res) => {
  try {
    const franchise = await Franchise.findOne();
    if (!franchise) return res.status(404).json({ success: false, message: "No content found" });
    res.json({ success: true, franchise });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
