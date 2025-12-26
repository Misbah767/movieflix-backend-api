import dotenv from "dotenv";
dotenv.config();

const allowedOrigins = process.env.CORS_ORIGINS
  ? process.env.CORS_ORIGINS.split(",")
  : [];

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: [
    "Content-Type",
    "Authorization",
    "X-Requested-With",
    "Accept",
    "X-Access-Token",
  ],
};

export default corsOptions;
