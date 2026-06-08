const { generateRoadmapAI } = require("../services/aiService");

const createRoadmap = async (req, res) => {
  try {
    const { role, level, duration } = req.body;

    const roadmap = await generateRoadmapAI(
      role,
      level,
      duration
    );

    // Convert AI response string to JSON
    const parsedRoadmap = JSON.parse(roadmap);

    res.status(200).json(parsedRoadmap);

  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Server Error",
      error: error.message,
    });
  }
};

module.exports = {
  createRoadmap,
};

