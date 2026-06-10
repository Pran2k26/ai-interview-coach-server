
const mongoose = require("mongoose");

const ragSessionSchema = new mongoose.Schema(
  {
    resumeText: {
      type: String,
      required: true,
    },

    questions: [
      {
        type: String,
      },
    ],

    currentQuestion: {
      type: Number,
      default: 0,
    },

    answers: [
      {
        question: String,
        answer: String,
        score: String,
        feedback: String,
      },
    ],

    completed: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "RagSession",
  ragSessionSchema
);

