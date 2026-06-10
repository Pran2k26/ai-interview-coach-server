const express = require("express");

const router = express.Router();

const upload =
  require("../middleware/upload");

const {

  ragInterview,

} = require("../controllers/ragController");

router.post(

  "/",

  upload.single("resume"),

  ragInterview

);

module.exports = router;