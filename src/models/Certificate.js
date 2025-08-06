const mongoose = require('mongoose');

const certificateSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  course_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true
  },
  certificate_number: {
    type: String,
    required: true,
    unique: true
  },
  issued_at: {
    type: Date,
    default: Date.now
  },
  issued_by: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  pdf_url: {
    type: String,
    trim: true
  },
  status: {
    type: String,
    enum: ['issued', 'revoked'],
    default: 'issued'
  },
  metadata: {
    student_name: {
      type: String,
      required: true
    },
    course_name: {
      type: String,
      required: true
    },
    completion_date: {
      type: Date,
      required: true
    },
    instructor_name: {
      type: String,
      required: true
    },
    grade: {
      type: String,
      trim: true
    },
    total_lessons: {
      type: Number,
      default: 0
    },
    completed_lessons: {
      type: Number,
      default: 0
    },
    final_score: {
      type: Number,
      min: 0,
      max: 100
    }
  },
  template_used: {
    type: String,
    default: 'default'
  },
  valid_until: {
    type: Date
  }
}, {
  timestamps: true
});

// Indexes for better query performance
certificateSchema.index({ user_id: 1 });
certificateSchema.index({ course_id: 1 });
certificateSchema.index({ certificate_number: 1 });
certificateSchema.index({ status: 1 });
certificateSchema.index({ issued_at: -1 });

// Virtual for certificate URL
certificateSchema.virtual('url').get(function() {
  return `/certificates/${this.certificate_number}`;
});

// Virtual for formatted issue date
certificateSchema.virtual('formattedIssueDate').get(function() {
  return this.issued_at.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
});

// Method to generate certificate number
certificateSchema.statics.generateCertificateNumber = function() {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substr(2, 5);
  return `CERT-${timestamp}-${random}`.toUpperCase();
};

// Method to revoke certificate
certificateSchema.methods.revoke = function(reason) {
  this.status = 'revoked';
  this.metadata.revocation_reason = reason;
  this.metadata.revoked_at = new Date();
  return this.save();
};

// Method to check if certificate is valid
certificateSchema.methods.isValid = function() {
  if (this.status === 'revoked') return false;
  if (this.valid_until && new Date() > this.valid_until) return false;
  return true;
};

// Static method to find valid certificates
certificateSchema.statics.findValid = function() {
  return this.find({ 
    status: 'issued',
    $or: [
      { valid_until: { $exists: false } },
      { valid_until: { $gt: new Date() } }
    ]
  });
};

// Static method to find certificates by user
certificateSchema.statics.findByUser = function(userId) {
  return this.find({ user_id: userId }).populate('course_id');
};

// Static method to find certificates by course
certificateSchema.statics.findByCourse = function(courseId) {
  return this.find({ course_id: courseId }).populate('user_id');
};

// Pre-save middleware to generate certificate number if not provided
certificateSchema.pre('save', async function(next) {
  if (!this.certificate_number) {
    this.certificate_number = this.constructor.generateCertificateNumber();
  }
  next();
});

module.exports = mongoose.model('Certificate', certificateSchema); 