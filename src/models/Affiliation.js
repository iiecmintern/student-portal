const mongoose = require("mongoose");

const affiliationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  logo: {
    filename: String,     // stored filename
    original_name: String // original uploaded name
  },
  category: {
    type: String,
    enum: ["Educational", "Government", "NGO", "Private", "Other"],
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
}, { timestamps: true });

module.exports = mongoose.model("Affiliation", affiliationSchema);
