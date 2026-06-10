const express = require("express");
const router = express.Router();

const protect = require("../middleware/authMiddleware");

const {
  evaluate,
} = require("../controllers/ragEvaluateController");

router.post("/", protect, evaluate);

module.exports = router;