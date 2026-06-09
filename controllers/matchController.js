const fs = require("fs");
const pdfParse = require("pdf-parse");

const { matchResumeAI } = require("../services/aiService");

const matchResume = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        message: "Please upload a resume",
      });
    }

    const buffer = fs.readFileSync(req.file.path);

    const pdf = await pdfParse(buffer);

    const resumeText = pdf.text;

    const { jobDescription } = req.body;

    if (!jobDescription) {
      fs.unlinkSync(req.file.path);

      return res.status(400).json({
        message: "Job Description is required",
      });
    }

    let aiResponse = await matchResumeAI(
      resumeText,
      jobDescription
    );

    aiResponse = aiResponse
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    let result;

    try {
      result = JSON.parse(aiResponse);
    } catch (err) {
      console.log("AI Response:", aiResponse);

      fs.unlinkSync(req.file.path);

      return res.status(500).json({
        message: "AI returned invalid JSON",
      });
    }

    fs.unlinkSync(req.file.path);

    res.status(200).json(result);

  } catch (error) {
    console.log(error);

    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }

    res.status(500).json({
      message: "Server Error",
    });
  }
};

module.exports = {
  matchResume,
};