// require("dotenv").config();
// const express = require("express");
// const helmet = require("helmet");
// const cors = require("cors");
// const cookieParser = require("cookie-parser");
// const { connectDB } = require("./config/db");
// const morgan = require("morgan");

// const authRoutes = require("./routes/auth");
// const catalogRoutes = require("./routes/catalog");
// const quizRoutes = require("./routes/quiz");
// const progressRoutes = require("./routes/progress");

// const app = express();
// app.use(helmet());
// app.use(express.json());
// app.use(cookieParser());
// app.use(cors({ origin: process.env.CORS_ORIGIN, credentials: true }));
// app.use(morgan("dev"));

// app.use("/api/v1/auth", authRoutes);
// app.use("/api/v1", catalogRoutes);
// app.use("/api/v1/quiz", quizRoutes);
// app.use("/api/v1", progressRoutes);

// (async () => {
//   await connectDB(process.env.MONGO_URI);
//   app.listen(process.env.PORT, () => console.log(`🚀 server on :${process.env.PORT}`));
// })();








require("dotenv").config();
const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const { connectDB } = require("./config/db");
const morgan = require("morgan");

// Importing routes
const authRoutes = require("./routes/auth");
const catalogRoutes = require("./routes/catalog");
const quizRoutes = require("./routes/quiz");
const progressRoutes = require("./routes/progress");
const adminRoutes = require("./routes/admin");  // Added Admin Routes
const { createAdmin } = require("./seed/createadmin");

// Initializing express app
const app = express();

// Middleware setup
app.use(helmet());
app.use(express.json());
app.use(cookieParser());
app.use(cors({ origin: process.env.CORS_ORIGIN, credentials: true }));
app.use(morgan("dev"));

// Route setup
app.use("/api/v1/auth", authRoutes);  // Authentication routes
app.use("/api/v1", catalogRoutes);   // Catalog (Subjects, Chapters, Pages) routes
app.use("/api/v1/quiz", quizRoutes); // Quiz related routes
app.use("/api/v1", progressRoutes); // Progress tracking routes
app.use("/api/v1/admin", adminRoutes); // Admin routes (admin CRUD for Subjects, Chapters, Pages, Questions)

// Starting the server
(async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    await createAdmin();  // Create admin user if not exists
    app.listen(process.env.PORT, () => console.log(`🚀 server running on port :${process.env.PORT}`));
  } catch (error) {
    console.error("Failed to connect to the database:", error);
    process.exit(1);
  }
})();
