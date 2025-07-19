const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const Affiliation = require("../models/Affiliation");
const { authenticateToken, requireAdmin } = require("../middleware/auth");

// ✅ Helper to safely delete a file
const deleteFile = (filepath) => {
  fs.unlink(filepath, (err) => {
    if (err) console.warn("⚠️ File delete failed:", filepath);
  });
};

// ✅ Multer config — uploads saved in /logo
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "../logo"));
  },
  filename: function (req, file, cb) {
    const uniqueName = Date.now() + "-" + file.originalname;
    cb(null, uniqueName);
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowed = ["image/jpeg", "image/png", "image/webp"];
    if (allowed.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Only images (JPG, PNG, WEBP) are allowed"));
    }
  },
});

// ✅ Create affiliation
router.post("/", authenticateToken, requireAdmin, upload.single("logo"), async (req, res) => {
  try {
    const { name, category, description } = req.body;

    if (!name || !category || !description || !req.file) {
      return res.status(400).json({ success: false, message: "All fields and logo are required" });
    }

    const newAffiliation = new Affiliation({
      name,
      category,
      description,
      logo: {
        filename: req.file.filename,
        original_name: req.file.originalname
      }
    });

    await newAffiliation.save();
    res.status(201).json({ success: true, message: "Affiliation created", data: newAffiliation });
  } catch (err) {
    console.error("Create affiliation error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// ✅ Get all affiliations
router.get("/", authenticateToken, requireAdmin, async (req, res) => {
  try {
    const affiliations = await Affiliation.find().sort({ createdAt: -1 });
    res.json({ success: true, data: affiliations });
  } catch (err) {
    console.error("Fetch affiliations error:", err);
    res.status(500).json({ success: false, message: "Failed to fetch affiliations" });
  }
});

// ✅ Update affiliation
router.put("/:id", authenticateToken, requireAdmin, upload.single("logo"), async (req, res) => {
  try {
    const { name, category, description } = req.body;
    const updateData = { name, category, description };

    const existing = await Affiliation.findById(req.params.id);
    if (!existing) {
      return res.status(404).json({ success: false, message: "Affiliation not found" });
    }

    // ✅ If logo is replaced, delete the old one
    if (req.file) {
      if (existing.logo?.filename) {
        const oldPath = path.join(__dirname, "../logo", existing.logo.filename);
        deleteFile(oldPath);
      }

      updateData.logo = {
        filename: req.file.filename,
        original_name: req.file.originalname
      };
    }

    const updated = await Affiliation.findByIdAndUpdate(req.params.id, updateData, { new: true });
    res.json({ success: true, message: "Affiliation updated", data: updated });
  } catch (err) {
    console.error("Update affiliation error:", err);
    res.status(500).json({ success: false, message: "Failed to update affiliation" });
  }
});

// ✅ Delete affiliation
router.delete("/:id", authenticateToken, requireAdmin, async (req, res) => {
  try {
    const deleted = await Affiliation.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ success: false, message: "Affiliation not found" });
    }

    // ✅ Delete logo from disk
    if (deleted.logo?.filename) {
      const logoPath = path.join(__dirname, "../logo", deleted.logo.filename);
      deleteFile(logoPath);
    }

    res.json({ success: true, message: "Affiliation deleted successfully" });
  } catch (err) {
    console.error("Delete affiliation error:", err);
    res.status(500).json({ success: false, message: "Failed to delete affiliation" });
  }
});

module.exports = router;
