const express = require("express");
const router = express.Router();

const { generateQuestions } = require("../services/aiService");

router.get("/test", async (req, res) => {
  try {
    const questions = await generateQuestions(
      "MERN Developer",
      "Fresher"
    );

    res.json({ questions });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "AI Error",
    });
  }
});

module.exports = router;