const InterviewHistory = require("../models/InterviewHistory");
const { evaluateRAGAnswer } = require("../services/aiService");

const evaluate = async (req, res) => {
  try {

const {
  question,
  answer,
  role,
  level,
  completed,
  questions,
  totalScore,
} = req.body;

const userId = req.user.id;

    const result = await evaluateRAGAnswer(
      question,
      answer
    );

    let score = 0;

    const match = result.match(/(\d+)\/10/);

    if (match) score = Number(match[1]);

    // save when interview ends
    if (completed) {

   
await InterviewHistory.create({
  userId: req.user.id,
  role,
  level,
  interviewType: "RAG",

//   questions: req.body.questions,
  questions,

//   totalScore: req.body.totalScore,
totalScore,

  duration: 0,
});
    }

    res.json({
      success: true,
      result,
      score,
    });
    console.log(req.body);

  } catch (err) {

    console.log(err);

    res.status(500).json({
      message: "Server Error",
    });

  }
};

module.exports = { evaluate };