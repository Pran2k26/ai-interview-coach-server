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

    // NEW
    interviewType: {
      type: String,
      enum: ["AI", "RAG"],
      default: "AI",
    },

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

    duration: Number,
  },
  { timestamps: true }
);

module.exports = mongoose.model(
  "InterviewHistory",
  interviewHistorySchema
);