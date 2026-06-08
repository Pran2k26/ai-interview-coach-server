
const express = require("express");

const router = express.Router();

const protect = require("../middleware/authMiddleware");

const {
  createRoadmap,
} = require("../controllers/roadmapController");

router.post(
  "/generate",
  protect,
  createRoadmap
);

module.exports = router;