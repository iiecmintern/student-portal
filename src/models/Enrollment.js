const mongoose = require('mongoose');

const enrollmentSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  course_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true,
  },
  enrolled_at: {
    type: Date,
    default: Date.now,
  },
  status: {
    type: String,
    enum: ['active', 'completed', 'cancelled'],
    default: 'active',
  },
  payment_status: {
    type: String,
    enum: ['pending', 'paid', 'refunded'],
    default: 'pending',
  },
  payment_amount: {
    type: Number,
    min: 0,
  },
  payment_method: {
    type: String,
    trim: true,
  },
  expires_at: {
    type: Date,
  },
  progress: {
    completed_lessons: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Lesson',
      },
    ],
    overall_progress: {
      type: Number,
      min: 0,
      max: 100,
      default: 0,
    },
    last_accessed: {
      type: Date,
      default: Date.now,
    },
    completed_at: {
      type: Date,
    },
  },
  certificate: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Certificate',
  },
}, {
  timestamps: true,
});

// ✅ Indexes
enrollmentSchema.index({ user_id: 1, course_id: 1 }, { unique: true });
enrollmentSchema.index({ user_id: 1 });
enrollmentSchema.index({ course_id: 1 });
enrollmentSchema.index({ status: 1 });
enrollmentSchema.index({ payment_status: 1 });
enrollmentSchema.index({ enrolled_at: -1 });

// ✅ Virtual for enrollment duration
enrollmentSchema.virtual('duration').get(function () {
  const endDate = this.progress.completed_at || new Date();
  return Math.floor((endDate - this.enrolled_at) / (1000 * 60 * 60 * 24));
});

// ✅ Method to update lesson progress
enrollmentSchema.methods.updateProgress = async function (lessonId) {
  // Prevent duplicates
  const alreadyCompleted = this.progress.completed_lessons.some(
    (id) => id.toString() === lessonId.toString()
  );

  if (!alreadyCompleted) {
    this.progress.completed_lessons.push(lessonId);
  }

  const Course = mongoose.model('Course');
  const course = await Course.findById(this.course_id);

  if (course && course.lessons.length > 0) {
    const completedCount = this.progress.completed_lessons.length;
    const totalCount = course.lessons.length;

    this.progress.overall_progress = Math.round((completedCount / totalCount) * 100);

    if (this.progress.overall_progress >= 100 && !this.progress.completed_at) {
      this.progress.completed_at = new Date();
      this.status = 'completed';
    }
  }

  this.progress.last_accessed = new Date();
  return this.save();
};

// ✅ Helper: Get progress percentage
enrollmentSchema.methods.getProgressPercentage = function (totalLessons) {
  if (!totalLessons || totalLessons === 0) return 0;
  const completed = this.progress.completed_lessons?.length || 0;
  return Math.round((completed / totalLessons) * 100);
};

// ✅ Method to check if a lesson is completed
enrollmentSchema.methods.isLessonCompleted = function (lessonId) {
  return this.progress.completed_lessons.some(
    (id) => id.toString() === lessonId.toString()
  );
};

// ✅ Statics
enrollmentSchema.statics.findActive = function () {
  return this.find({ status: 'active' });
};

enrollmentSchema.statics.findByUser = function (userId) {
  return this.find({ user_id: userId }).populate('course_id');
};

enrollmentSchema.statics.findByCourse = function (courseId) {
  return this.find({ course_id: courseId }).populate('user_id');
};

enrollmentSchema.statics.getEnrollmentCount = function (courseId) {
  return this.countDocuments({ course_id: courseId, status: 'active' });
};

module.exports = mongoose.model('Enrollment', enrollmentSchema);
