const mongoose = require('mongoose');

const attachmentSchema = new mongoose.Schema({
  filename: { type: String, required: true },
  original_name: { type: String, required: true },
  url: { type: String, required: true },
  size: { type: Number, required: true },
  type: { type: String, required: true },
  is_downloadable: { type: Boolean, default: false }
}, { _id: false });

const resourceSchema = new mongoose.Schema({
  title: { type: String, required: true },
  url: { type: String, required: true },
  description: { type: String }
}, { _id: false });

const lessonSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 255
  },
  description: {
    type: String,
    trim: true
  },
  content: {
    type: String,
    required: true
  },
  video_embed_url: {
    type: String,
    trim: true
  },
  order: {
    type: Number,
    required: true,
    min: 1
  },
  duration: {
    type: Number,
    min: 0 // duration in minutes
  },
  course_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true
  },
  attachments: [attachmentSchema],
  resources: [resourceSchema],
  is_free: {
    type: Boolean,
    default: false
  },
  quiz: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Quiz'
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Compound index for order uniqueness within course
lessonSchema.index({ course_id: 1, order: 1 }, { unique: true });
lessonSchema.index({ course_id: 1 });

// Virtuals
lessonSchema.virtual('url').get(function () {
  return `/courses/${this.course_id}/lessons/${this._id}`;
});

lessonSchema.virtual('formattedDuration').get(function () {
  if (!this.duration) return 'N/A';
  const hours = Math.floor(this.duration / 60);
  const minutes = this.duration % 60;
  return hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;
});

// Instance methods
lessonSchema.methods.getNextLesson = async function () {
  return this.model('Lesson')
    .findOne({ course_id: this.course_id, order: { $gt: this.order } })
    .sort({ order: 1 });
};

lessonSchema.methods.getPreviousLesson = async function () {
  return this.model('Lesson')
    .findOne({ course_id: this.course_id, order: { $lt: this.order } })
    .sort({ order: -1 });
};

// Static methods
lessonSchema.statics.findByCourse = function (courseId) {
  return this.find({ course_id: courseId }).sort({ order: 1 });
};

lessonSchema.statics.getLessonCount = function (courseId) {
  return this.countDocuments({ course_id: courseId });
};

// Pre-save validation
lessonSchema.pre('save', async function (next) {
  if (this.isNew || this.isModified('order')) {
    const exists = await this.model('Lesson').findOne({
      course_id: this.course_id,
      order: this.order,
      _id: { $ne: this._id }
    });
    if (exists) {
      return next(new Error('Lesson order must be unique within a course'));
    }
  }
  next();
});

// Pre-remove cleanup
lessonSchema.pre('remove', async function (next) {
  const Course = mongoose.model('Course');
  const course = await Course.findById(this.course_id);
  if (course) {
    course.lessons = course.lessons.filter(id => id.toString() !== this._id.toString());
    await course.save();
  }
  next();
});

module.exports = mongoose.model('Lesson', lessonSchema);
