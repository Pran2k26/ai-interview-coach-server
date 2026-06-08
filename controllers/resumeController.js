
const fs = require("fs");
const pdfParse = require("pdf-parse");

const { analyzeResumeAI } = require("../services/aiService");

const analyzeResume = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        message: "No resume uploaded",
      });
    }

    // Read uploaded PDF
    const dataBuffer = fs.readFileSync(req.file.path);

    // Extract text from PDF
    const pdfData = await pdfParse(dataBuffer);

    // Send text to AI
    const aiResponse = await analyzeResumeAI(pdfData.text);

    console.log("Raw AI Response:");
    console.log(aiResponse);

    // Remove markdown if AI returns ```json ... ```
    const cleanedResponse = aiResponse
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    // Convert string to JSON
    const result = JSON.parse(cleanedResponse);

    res.status(200).json(result);

  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Server Error",
      error: error.message,
    });
  }
};

module.exports = {
  analyzeResume,
};

