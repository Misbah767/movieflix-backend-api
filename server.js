import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";

// ----------------- CONFIG -----------------
import { connectDB, corsOptions } from "./config/index.js";

// ----------------- ROUTES -----------------
import routes from "./routes/index.js";

// ----------------- ERROR HANDLER -----------------
import { globalErrorHandler } from "./middleware/index.js";

// ----------------- ENV -----------------
dotenv.config();
const PORT = process.env.PORT || 5000;

const app = express();

// ----------------- CORS -----------------
app.use(cors(corsOptions));

// ----------------- MIDDLEWARE -----------------
app.use(express.json());
app.use(cookieParser());

// ----------------- TEST ROUTE -----------------
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "🚀 AuthMaster API is running",
  });
});

// ----------------- API ROUTES -----------------
app.use("/api", routes);

// ----------------- GLOBAL ERROR HANDLER -----------------
app.use(globalErrorHandler);

// ----------------- START SERVER -----------------
connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`🚀 Server running at http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ Database connection failed:", err.message);
    process.exit(1);
  });
