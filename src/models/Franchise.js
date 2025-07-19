const mongoose = require("mongoose");

const franchiseModelSchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: { type: String },
  description: { type: String },
});

const franchiseSchema = new mongoose.Schema(
  {
    intro: { type: String, required: true },
    eligibility: [{ type: String }],
    howToApply: { type: String },
    models: [franchiseModelSchema],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Franchise", franchiseSchema);
