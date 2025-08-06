const mongoose = require('mongoose');

const answerSchema = new mongoose.Schema({
  questionIndex: { type: Number, required: true },
  answer: mongoose.Schema.Types.Mixed // supports number or array (for multi-select)
}, { _id: false });

const quizAttemptSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  quiz: { type: mongoose.Schema.Types.ObjectId, ref: 'Quiz', required: true },
  lesson: { type: mongoose.Schema.Types.ObjectId, ref: 'Lesson', required: true },
  answers: {
    type: [answerSchema],
    default: []
  },
  correctAnswers: { type: Number, required: true },
  incorrectAnswers: { type: Number, required: true },
  totalQuestions: { type: Number, required: true },
  score: { type: Number, required: true },
  percentage: { type: Number, required: true },
  passed: { type: Boolean, required: true },
  attemptNumber: { type: Number, required: true }, // e.g., 1st attempt, 2nd attempt, etc.
}, {
  timestamps: true
});

// Indexes
quizAttemptSchema.index({ user: 1, quiz: 1 });
quizAttemptSchema.index({ user: 1, lesson: 1 });

module.exports = mongoose.model('QuizAttempt', quizAttemptSchema);
