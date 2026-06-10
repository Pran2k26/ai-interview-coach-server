
const express = require("express");

const router = express.Router();

const {
  evaluate,
} = require("../controllers/ragEvaluateController");

router.post("/", evaluate);

module.exports = router;

