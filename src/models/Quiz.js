const mongoose = require('mongoose');

const quizQuestionSchema = new mongoose.Schema({
  question_text: {
    type: String,
    required: true,
    trim: true
  },
  options: [{
    type: String,
    required: true,
    trim: true
  }],
  correct_answer: {
    type: Number,
    required: true,
    min: 0
  },
  type: {
    type: String,
    enum: ['mcq', 'true_false', 'multiple_select'],
    default: 'mcq'
  },
  points: {
    type: Number,
    required: true,
    min: 1,
    default: 1
  },
  explanation: {
    type: String,
    trim: true
  }
}, {
  timestamps: true
});

const quizSchema = new mongoose.Schema({
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
  lesson_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Lesson',
    required: true
  },
  questions: [quizQuestionSchema],
  passing_score: {
    type: Number,
    required: true,
    min: 0,
    max: 100,
    default: 70
  },
  time_limit: {
    type: Number, // in minutes
    min: 1
  },
  max_attempts: {
    type: Number,
    min: 1,
    default: 3
  },
  is_active: {
    type: Boolean,
    default: true
  },
  shuffle_questions: {
    type: Boolean,
    default: false
  },
  show_results: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Indexes for better query performance
quizSchema.index({ lesson_id: 1 });
quizSchema.index({ is_active: 1 });

// Virtual for total points
quizSchema.virtual('totalPoints').get(function() {
  return this.questions.reduce((total, question) => total + question.points, 0);
});

// Virtual for question count
quizSchema.virtual('questionCount').get(function() {
  return this.questions.length;
});

// Method to calculate score
quizSchema.methods.calculateScore = function(answers) {
  let totalScore = 0;
  let maxScore = 0;

  this.questions.forEach((question, index) => {
    maxScore += question.points;
    
    if (answers[index] !== undefined) {
      if (question.type === 'multiple_select') {
        // For multiple select, check if all correct answers are selected
        const correctAnswers = question.correct_answer;
        const selectedAnswers = answers[index];
        
        if (Array.isArray(selectedAnswers) && 
            selectedAnswers.length === correctAnswers.length &&
            selectedAnswers.every(answer => correctAnswers.includes(answer))) {
          totalScore += question.points;
        }
      } else {
        // For single choice questions
        if (answers[index] === question.correct_answer) {
          totalScore += question.points;
        }
      }
    }
  });

  return {
    score: totalScore,
    maxScore: maxScore,
    percentage: Math.round((totalScore / maxScore) * 100)
  };
};

// Method to check if user passed
quizSchema.methods.checkPassed = function(score, maxScore) {
  const percentage = (score / maxScore) * 100;
  return percentage >= this.passing_score;
};

// Static method to find active quizzes
quizSchema.statics.findActive = function() {
  return this.find({ is_active: true });
};

// Static method to find quizzes by lesson
quizSchema.statics.findByLesson = function(lessonId) {
  return this.findOne({ lesson_id: lessonId, is_active: true });
};

module.exports = mongoose.model('Quiz', quizSchema); 