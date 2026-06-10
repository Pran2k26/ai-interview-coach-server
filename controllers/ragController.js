// const fs = require("fs");

// const pdfParse = require("pdf-parse");

// const {

//   storeResume,

//   generateRAGQuestions,

// } = require("../services/ragService");

// const ragInterview = async (req, res) => {

//   try {

//     const buffer =
//       fs.readFileSync(req.file.path);

//     const pdf =
//       await pdfParse(buffer);

//     await storeResume(pdf.text);

//     const questions =
//       await generateRAGQuestions();

//     res.json({

//       questions: questions.split("\n"),

//     });

//   }

//   catch (err) {

//     console.log(err);

//     res.status(500).json({

//       message: "Server Error",

//     });

//   }

// };

// module.exports = {

//   ragInterview,

// };


const fs = require("fs");
const pdfParse = require("pdf-parse");

const {
  storeResume,
  generateRAGQuestions,
} = require("../services/ragService");

const ragInterview = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        message: "Please upload a resume",
      });
    }

    const buffer = fs.readFileSync(req.file.path);

    const pdf = await pdfParse(buffer);

    await storeResume(pdf.text);

    const questions = await generateRAGQuestions();

    res.status(200).json({
      success: true,
      questions,
    });

  } catch (err) {
    console.log(err);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

module.exports = {
  ragInterview,
};


