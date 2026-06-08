const Interview = require("../models/Interview");

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

// const evaluateInterview =
//   async (req, res) => {
//     try {
//       const interview =
//         await Interview.findById(
//           req.params.id
//         );

//         console.log("ANSWERS =", interview.answers);
//         console.log("EVALUATE ID =", req.params.id);

//       if (!interview) {
//         return res
//           .status(404)
//           .json({
//             message:
//               "Interview not found",
//           });
//       }

//       const results = [];

//       for (
//         let i = 0;
//         i <
//         interview.answers.length;
//         i++
//       ) {
//         const feedback =
//           await evaluateAnswer(
//             interview.answers[i]
//               .question,
//             interview.answers[i]
//               .answer
//           );

//         results.push({
//           question:
//             interview.answers[i]
//               .question,
//           answer:
//             interview.answers[i]
//               .answer,
//           feedback,
//         });
//       }

//       res.status(200).json(
//         results
//       );

//     } catch (error) {
//       console.log(error);

//       res.status(500).json({
//         message: "Server Error",
//       });
//     }
//   };
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

    const results = [];

    for (let i = 0; i < interview.answers.length; i++) {
      const feedback = await evaluateAnswer(
        interview.answers[i].question,
        interview.answers[i].answer
      );

      results.push({
        question: interview.answers[i].question,
        answer: interview.answers[i].answer,
        feedback,
      });

      // ✅ SAVE BACK TO DB (IMPORTANT UPGRADE)
      interview.answers[i].feedback = feedback;
    }

    await interview.save();

    return res.status(200).json(results);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Server Error" });
  }
};

module.exports = {
  createInterview,
  getInterview,
  saveAnswers,
  evaluateInterview,
};