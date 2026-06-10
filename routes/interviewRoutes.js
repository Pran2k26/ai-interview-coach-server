// const express = require("express");

// const router = express.Router();

// const protect = require(
//   "../middleware/authMiddleware"
// );

// const {
//   createInterview,getInterview, saveAnswers, evaluateInterview,saveInterview, getInterviewHistory
// } = require(
//   "../controllers/interviewController"
// );

// router.post(
//   "/create",
//   protect,
//   createInterview
// );


// router.post(
//     "/:id/answers",
//     protect,
//     saveAnswers
// );

// router.post(
//     "/:id/evaluate",
//     protect,
//     evaluateInterview
// );

// router.get("/history/all", protect, getInterviewHistory);
// router.get("/:id", protect, getInterview);


// module.exports = router;
const express = require("express");
const router = express.Router();

const protect = require("../middleware/authMiddleware");

const {
  createInterview,
  getInterview,
  saveAnswers,
  evaluateInterview,
  getInterviewHistory,
  getInterviewHistoryById,
} = require("../controllers/interviewController");


// ✅ Create interview
router.post("/create", protect, createInterview);


// ✅ Save answers
router.post("/:id/answers", protect, saveAnswers);


// ✅ Evaluate interview (AND SAVE HISTORY inside controller)
router.post("/:id/evaluate", protect, evaluateInterview);


// ✅ HISTORY (IMPORTANT: keep BEFORE /:id just in case frontend changes)
router.get("/history", protect, getInterviewHistory);

router.get("/history/:id", protect, getInterviewHistoryById);


// ✅ Get single interview
router.get("/:id", protect, getInterview);



module.exports = router;