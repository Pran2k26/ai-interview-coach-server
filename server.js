require("dotenv").config();

const express = require("express");
const app = express();
const cors = require("cors");
app.use(cors({
  origin: process.env.CLIENT_URL,
  credentials: true
}));
const mongoose = require("mongoose");


// Middleware
app.use(cors());
app.use(express.json());

// Routes
const authRoutes = require("./routes/authRoute");
const interviewRoutes = require("./routes/interviewRoutes");
const aiRoutes = require("./routes/aiRoutes");
const roadmapRoutes = require("./routes/roadmapRoutes");
const resumeRoutes = require("./routes/resumeRoutes");

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/interview", interviewRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/roadmap", roadmapRoutes);
app.use("/api/resume", resumeRoutes);

// Home Route
app.get("/", (req, res) => {
  res.send("Backend Working");
});

// MongoDB Connection
//console.log("MONGO_URI =", process.env.MONGO_URI);

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB Connected");
  })
  .catch((err) => {
    console.log(err);
  });

// Server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

