const mongoose = require("mongoose");

const interviewHistorySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    role: String,
    level: String,

    questions: [
      {
        question: String,
        userAnswer: String,
        aiFeedback: String,
        score: Number,
      },
    ],

    totalScore: {
      type: Number,
      default: 0,
    },

    duration: Number, // in minutes
  },
  { timestamps: true }
);

module.exports = mongoose.model("InterviewHistory", interviewHistorySchema);