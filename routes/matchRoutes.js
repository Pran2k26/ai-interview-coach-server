const express = require("express");

const router = express.Router();

const upload = require("../middleware/upload");

const { matchResume } = require("../controllers/matchController");

router.post(
  "/",
  upload.single("resume"),
  matchResume
);

module.exports = router;