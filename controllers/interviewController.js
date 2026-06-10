const Interview = require("../models/Interview");
const InterviewHistory = require("../models/InterviewHistory");

const {
  generateQuestions,
  evaluateAnswer,
} = require("../services/aiService");

const createInterview = async (req, res) => {
  try {
    const { role, level } = req.body;

    const aiQuestions =
      await generateQuestions(
        role,
        level
      );

    const interview =
      await Interview.create({
        userId: req.user.id,
        role,
        level,
        questions: aiQuestions,
      });

    res.status(201).json(interview);

  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Server Error",
    });
  }
};

// Get Interview By ID

const getInterview = async (
  req,
  res
) => {
  try {
    const interview =
      await Interview.findById(
        req.params.id
      );

    if (!interview) {
      return res.status(404).json({
        message:
          "Interview not found",
      });
    }

    res.status(200).json(
      interview
    );

  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Server Error",
    });
  }
};

// Save Answers

const saveAnswers = async (req, res) => {
  try {
    const { answers } = req.body;

    console.log("Received answers:", answers);

    const interview = await Interview.findById(
      req.params.id
    );

    console.log("SAVE ID =", req.params.id);

    if (!interview) {
      return res.status(404).json({
        message: "Interview not found",
      });
    }

    interview.answers = answers.map(
      (answer, index) => ({
        question: interview.questions[index],
        answer: answer,
        feedback: "",
        score: 0,
      })
    );

    console.log(
      "Before save:",
      interview.answers
    );

    await interview.save();

    console.log(
      "After save:",
      interview.answers
    );

    res.status(200).json({
      message: "Answers Saved",
      interview,
    });

  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Server Error",
    });
  }
};

// Evaluate Interview


const evaluateInterview = async (req, res) => {
  try {
    const interview = await Interview.findById(req.params.id);

    if (!interview) {
      return res.status(404).json({ message: "Interview not found" });
    }

    if (!interview.answers || interview.answers.length === 0) {
      return res.status(400).json({
        message: "No answers found. Please save answers first.",
      });
    }

    let totalScore = 0;
    const results = [];

    for (let i = 0; i < interview.answers.length; i++) {
      const feedback = await evaluateAnswer(
        interview.answers[i].question,
        interview.answers[i].answer
      );

      interview.answers[i].feedback = feedback;

    //   const score = feedback?.score || 0;
    //   interview.answers[i].score = score;
    //   totalScore += score;
    let score = 0;

if (typeof feedback === "object" && feedback?.score !== undefined) {
  score = feedback.score;
}
else if (typeof feedback === "string") {
  const match = feedback.match(/(\d+)\s*\/\s*10/);
  score = match ? Number(match[1]) : 0;
}

interview.answers[i].score = score;
totalScore += score;

      results.push({
        question: interview.answers[i].question,
        answer: interview.answers[i].answer,
        feedback,
        score,
      });
    }

    await interview.save();

    // 🔥 SAVE HISTORY HERE (IMPORTANT FIX)

await InterviewHistory.create({
  userId: interview.userId,
  interviewId: interview._id,

  role: interview.role,
  level: interview.level,

  type: "AI Interview",

  questions: interview.answers.map((item) => ({
    question: item.question,
    userAnswer: item.answer,
    aiFeedback: item.feedback,
    score: item.score,
  })),

  totalScore,
  duration: 0,
});

    return res.status(200).json(results);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Server Error" });
  }
};

//save InterviewHistory

// const saveInterview = async (req, res) => {
//   try {
//     const userId = req.user.id; // from JWT middleware

//     const { role, level, questions, totalScore, duration } = req.body;

//     const interview = await InterviewHistory.create({
//       userId,
//       role,
//       level,
//       questions,
//       totalScore,
//       duration,
//     });

//     res.status(201).json(interview);
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };

//get interview InterviewHistory
const getInterviewHistory = async (req, res) => {
  try {
    const userId = req.user.id;

    const history = await InterviewHistory.find({ userId })
      .sort({ createdAt: -1 });

    res.json(history);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


const getInterviewHistoryById = async (req, res) => {
  try {
    const history = await InterviewHistory.findById(req.params.id);

    if (!history) {
      return res.status(404).json({ message: "History not found" });
    }

    res.json(history);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  createInterview,
  getInterview,
  saveAnswers,
  evaluateInterview,
  //saveInterview,
  getInterviewHistory,
  getInterviewHistoryById,
};