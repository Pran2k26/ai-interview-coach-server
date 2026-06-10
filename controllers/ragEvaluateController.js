
const { evaluateRAGAnswer } = require("../services/aiService");

const evaluate = async (req, res) => {

  try {

    const { question, answer } = req.body;

    const result = await evaluateRAGAnswer(
      question,
      answer
    );

    res.json({
      success: true,
      result,
    });

  } catch (err) {

    console.log(err);

    res.status(500).json({
      message: "Server Error",
    });

  }

};

module.exports = {
  evaluate,
};

