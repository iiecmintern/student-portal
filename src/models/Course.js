const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true, maxlength: 255 },
    description: { type: String, required: true, trim: true },
    thumbnail_url: { type: String, default: null },
    price: { type: Number, required: true, min: 0, default: 0 },
    category: { type: String, required: true, trim: true, maxlength: 100 },
    status: {
      type: String,
      enum: ["draft", "published", "archived"],
      default: "draft",
    },
    created_by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    difficulty: {
      type: String,
      enum: ["beginner", "intermediate", "advanced"],
      default: "beginner",
    },
    tags: [{ type: String, trim: true }],
    lessons: [{ type: mongoose.Schema.Types.ObjectId, ref: "Lesson" }],
    enrolled_students_count: { type: Number, default: 0 },
    average_rating: { type: Number, default: 0, min: 0, max: 5 },
    total_ratings: { type: Number, default: 0 },
    total_lessons: { type: Number, default: 0 },
    duration: { type: Number, default: 0 }, // in minutes
    featured: { type: Boolean, default: false },
    certificate_template: { type: String, default: null },
    overview: { type: String, default: "" },
    curriculum: {
      topics: [{ type: String }],
      total_modules: { type: Number, default: 0 },
      total_quizzes: { type: Number, default: 0 },
    },
  },
  { timestamps: true }
);

courseSchema.index({
  created_by: 1,
  status: 1,
  category: 1,
  difficulty: 1,
  featured: 1,
  tags: 1,
});

courseSchema.virtual("url").get(function () {
  return `/courses/${this._id}`;
});

courseSchema.virtual("formattedPrice").get(function () {
  return `₹${this.price.toLocaleString('en-IN')}`;
});

courseSchema.virtual("durationHours").get(function () {
  return Math.round((this.duration / 60) * 10) / 10;
});

courseSchema.methods.updateEnrolledCount = async function () {
  const Enrollment = mongoose.model("Enrollment");
  const count = await Enrollment.countDocuments({
    course_id: this._id,
    status: "active",
  });
  this.enrolled_students_count = count;
  return this.save();
};

courseSchema.methods.updateAverageRating = async function () {
  const Review = mongoose.model("Review");
  const result = await Review.aggregate([
    { $match: { course_id: this._id } },
    {
      $group: {
        _id: null,
        avgRating: { $avg: "$rating" },
        totalRatings: { $sum: 1 },
      },
    },
  ]);

  if (result.length > 0) {
    this.average_rating = Math.round(result[0].avgRating * 10) / 10;
    this.total_ratings = result[0].totalRatings;
  } else {
    this.average_rating = 0;
    this.total_ratings = 0;
  }

  return this.save();
};

courseSchema.statics.findPublished = function () {
  return this.find({ status: "published" });
};

courseSchema.statics.findByInstructor = function (instructorId) {
  return this.find({ created_by: instructorId });
};

courseSchema.statics.findFeatured = function () {
  return this.find({ featured: true, status: "published" });
};

courseSchema.pre("save", async function (next) {
  if (this.lessons && this.lessons.length > 0) {
    this.total_lessons = this.lessons.length;
  }
  next();
});

module.exports = mongoose.model("Course", courseSchema);
