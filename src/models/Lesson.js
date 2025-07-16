const mongoose = require('mongoose');

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
  video_embed_url: {
    type: String,
    trim: true
  },
  content: {
    type: String,
    required: true
  },
  order: {
    type: Number,
    required: true,
    min: 1
  },
  duration: {
    type: Number, // in minutes
    min: 0
  },
  course_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true
  },
  attachments: [{
    filename: String,
    original_name: String,
    url: String,
    size: Number,
    type: String
  }],
  resources: [{
    title: String,
    url: String,
    description: String
  }],
  is_free: {
    type: Boolean,
    default: false
  },
  quiz: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Quiz'
  }
}, {
  timestamps: true
});

// Indexes for better query performance
lessonSchema.index({ course_id: 1, order: 1 });
lessonSchema.index({ course_id: 1 });

// Compound unique index to ensure order is unique within a course
lessonSchema.index({ course_id: 1, order: 1 }, { unique: true });

// Virtual for lesson URL
lessonSchema.virtual('url').get(function() {
  return `/courses/${this.course_id}/lessons/${this._id}`;
});

// Virtual for formatted duration
lessonSchema.virtual('formattedDuration').get(function() {
  if (!this.duration) return 'N/A';
  const hours = Math.floor(this.duration / 60);
  const minutes = this.duration % 60;
  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }
  return `${minutes}m`;
});

// Method to get next lesson
lessonSchema.methods.getNextLesson = async function() {
  return this.model('Lesson').findOne({
    course_id: this.course_id,
    order: { $gt: this.order }
  }).sort({ order: 1 });
};

// Method to get previous lesson
lessonSchema.methods.getPreviousLesson = async function() {
  return this.model('Lesson').findOne({
    course_id: this.course_id,
    order: { $lt: this.order }
  }).sort({ order: -1 });
};

// Static method to find lessons by course
lessonSchema.statics.findByCourse = function(courseId) {
  return this.find({ course_id: courseId }).sort({ order: 1 });
};

// Static method to get lesson count for a course
lessonSchema.statics.getLessonCount = function(courseId) {
  return this.countDocuments({ course_id: courseId });
};

// Pre-save middleware to validate order
lessonSchema.pre('save', async function(next) {
  if (this.isNew || this.isModified('order')) {
    const existingLesson = await this.model('Lesson').findOne({
      course_id: this.course_id,
      order: this.order,
      _id: { $ne: this._id }
    });
    
    if (existingLesson) {
      const error = new Error('Lesson order must be unique within a course');
      return next(error);
    }
  }
  next();
});

// Pre-remove middleware to update course lesson count
lessonSchema.pre('remove', async function(next) {
  const Course = mongoose.model('Course');
  const course = await Course.findById(this.course_id);
  if (course) {
    course.lessons = course.lessons.filter(lessonId => lessonId.toString() !== this._id.toString());
    await course.save();
  }
  next();
});

module.exports = mongoose.model('Lesson', lessonSchema); 