const express = require("express");

const router = express.Router();

const protect = require(
  "../middleware/authMiddleware"
);

const {
  createInterview,getInterview, saveAnswers, evaluateInterview,saveInterview, getInterviewHistory
} = require(
  "../controllers/interviewController"
);

router.post(
  "/create",
  protect,
  createInterview
);


router.post(
    "/:id/answers",
    protect,
    saveAnswers
);

router.post(
    "/:id/evaluate",
    protect,
    evaluateInterview
);

router.get("/history/all", protect, getInterviewHistory);
router.get("/:id", protect, getInterview);


module.exports = router;