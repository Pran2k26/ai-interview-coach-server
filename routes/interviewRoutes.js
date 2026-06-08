const express = require("express");

const router = express.Router();

const protect = require(
  "../middleware/authMiddleware"
);

const {
  createInterview,getInterview, saveAnswers, evaluateInterview
} = require(
  "../controllers/interviewController"
);

router.post(
  "/create",
  protect,
  createInterview
);

router.get("/:id", protect, getInterview);

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

module.exports = router;