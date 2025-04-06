require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const authRoutes = require("./routes/auth.routes");
const { apiLimiter, authLimiter } = require("./middleware/rateLimiter");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");
const setupSwagger = require("./config/swagger");
const path = require("path");

// Initialize Express app
const app = express();

// Middleware
app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(morgan("dev"));
// Apply rate limiting
app.use("/api/auth", authLimiter);
app.use("/api", apiLimiter);
app.use(mongoSanitize());
app.use(xss());
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        imgSrc: ["'self'", "data:", "https://*.unsplash.com"],
        connectSrc: ["'self'", "https://api.unsplash.com"],
      },
    },
    crossOriginResourcePolicy: { policy: "cross-origin" }, // Needed for Unsplash images
  })
);
app.use(
  cors({
    origin: [
      "http://localhost:5173", // Your Vite development server
    ],
    credentials: true,
  })
);

// Database connection
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/photos", require("./routes/photo.routes"));
app.use("/api/boards", require("./routes/board.routes"));
app.use("/api/users", require("./routes/follow.routes"));
app.use("/api/activity", require("./routes/activity.routes"));
app.use("/api", require("./routes/comment.routes"));
app.use("/api/notifications", require("./routes/notification.routes"));
app.use("/api/search", require("./routes/search.routes"));
app.use("/api/users", require("./routes/stats.routes"));
app.use(
  "/api/photos",
  express.static(
    path.join(__dirname, "public/uploads"),
    require("./routes/photo.routes")
  )
);

setupSwagger(app);
// Basic route for testing
app.get("/", (req, res) => {
  res.send("Fotofolio Backend is running");
});
const compression = require("compression");
app.use(compression());
app.set("trust proxy", 1);
const errorHandler = require("./middleware/errorHandler");
app.use(errorHandler);
// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
