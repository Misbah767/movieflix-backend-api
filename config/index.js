// ----------------- DATABASE -----------------
import connectDB from "./mongodb.js";

// ----------------- CORS -----------------
import corsOptions from "./corsOptions.js";

// ----------------- EMAIL -----------------
import sendEmail from "./nodemailer.js";

// ----------------- EXPORT ALL -----------------
export { connectDB, corsOptions, sendEmail };
