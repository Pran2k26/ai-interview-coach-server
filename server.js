// require("dotenv").config();
// const express = require("express");
// const cors = require("cors");
// const mongoose = require("mongoose");
// const interviewRoutes = require(
//   "./routes/interviewRoutes"
// );
// const aiRoutes = require("./routes/aiRoutes");

// //console.log("Groq Key:", process.env.GROQ_API_KEY);

// const app = express();

// app.use(cors());
// app.use(express.json());
// app.use("/api/ai", aiRoutes);
// const authRoutes = require("./routes/authRoute");
// app.use(
//   "/api/interview",
//   interviewRoutes
// );


// console.log("MONGO_URI =", process.env.MONGO_URI);

// mongoose
//   .connect(process.env.MONGO_URI)
//   .then(() => console.log("MongoDB Connected"))
//   .catch((err) => console.log(err));

// app.get("/", (req, res) => {
//   res.send("Backend Working");
// });
// app.use("/api/auth", authRoutes);

// const PORT = process.env.PORT || 5000;

// app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
// });


require("dotenv").config();

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const app = express();

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
console.log("MONGO_URI =", process.env.MONGO_URI);

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

