import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

// ----------------- CREATE TRANSPORTER -----------------
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT) || 587,
  secure: process.env.SMTP_SECURE === "true",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
  logger: true,
  debug: true,
});

// ----------------- VERIFY CONNECTION -----------------
transporter.verify((err) => {
  if (err) {
    console.error("❌ SMTP Connection Error:", err.message);
  } else {
    console.log("✅ SMTP Connected Successfully");
  }
});

/**
 * Send Email
 * @param {string} to - recipient email
 * @param {string} subject - email subject
 * @param {"otp"|"verified"|"reset"|"passwordChanged"|"reminder"} type
 * @param {object} data
 * @param {boolean} forceSend
 */
export async function sendEmail(
  to,
  subject,
  type,
  data = {},
  forceSend = false
) {
  try {
    let content = "";

    switch (type) {
      case "otp":
        content = `
          <p style="font-size:16px;margin-bottom:15px;">Hi <b>${
            data.name || "User"
          }</b>,</p>
          <p style="font-size:16px;margin-bottom:20px;">Your OTP to verify your account is:</p>
          <div style="text-align:center;margin:20px 0;">
            <span style="font-size:32px;font-weight:bold;color:#ffffff;background:#4CAF50;padding:15px 30px;border-radius:8px;display:inline-block;letter-spacing:3px;">
              ${data.otp}
            </span>
          </div>
          <p style="font-size:14px;color:#555;">This OTP will expire in 10 minutes.</p>
        `;
        break;

      case "verified":
        content = `
          <p style="font-size:16px;margin-bottom:15px;">Hi <b>${
            data.name || "User"
          }</b>,</p>
          <p style="font-size:16px;color:#4CAF50;">Your account has been successfully verified ✅</p>
        `;
        break;

      case "reset":
        content = `
          <p style="font-size:16px;margin-bottom:15px;">Hi <b>${
            data.name || "User"
          }</b>,</p>
          <p style="font-size:16px;margin-bottom:20px;">Password reset OTP:</p>
          <div style="text-align:center;margin:20px 0;">
            <span style="font-size:32px;font-weight:bold;color:#ffffff;background:#FF9800;padding:15px 30px;border-radius:8px;display:inline-block;letter-spacing:3px;">
              ${data.otp}
            </span>
          </div>
          <p style="font-size:14px;color:#555;">This OTP will expire in 10 minutes.</p>
        `;
        break;

      case "passwordChanged":
        content = `
          <p style="font-size:16px;margin-bottom:15px;">Hello <b>${
            data.name || "User"
          }</b>,</p>
          <p style="font-size:16px;color:#4CAF50;">Your password has been changed successfully ✅</p>
        `;
        break;

      case "reminder":
        content = `
          <p style="font-size:16px;margin-bottom:15px;">Hi <b>${
            data.name || "User"
          }</b>,</p>
          <p style="font-size:16px;">Your task <b>${
            data.taskTitle
          }</b> is due at <b>${data.dueDate}</b></p>
        `;
        break;

      default:
        content = `
          <p style="font-size:16px;margin-bottom:15px;">Hello <b>${
            data.name || "User"
          }</b>,</p>
          <p style="font-size:16px;color:#333;">This is a notification from <b>MovieFlix</b> ✅</p>
        `;
    }

    if (data.role) {
      content += `<p style="font-size:14px;color:#555;"><b>Role:</b> ${data.role}</p>`;
    }

    const html = `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:auto;padding:30px;background:#f4f6f8;border-radius:12px;border:1px solid #ddd;">
        <div style="text-align:center;margin-bottom:25px;">
          <h1 style="color:#4CAF50;">🎬 MovieFlix</h1>
        </div>

        <div style="padding:20px;background:#ffffff;border-radius:10px;box-shadow:0 4px 12px rgba(0,0,0,0.05);">
          ${content}
        </div>

        <hr style="margin:25px 0;border:none;border-top:1px solid #eee;"/>

        <p style="font-size:12px;text-align:center;color:#888;">
          Need help? Contact
          <a href="mailto:${process.env.SENDER_EMAIL}" style="color:#4CAF50;text-decoration:none;">support</a>
        </p>
      </div>
    `;

    // ----------------- DEV MODE -----------------
    if (process.env.NODE_ENV === "development" && !forceSend) {
      console.log(`
📧 [DEV EMAIL]
To: ${to}
Subject: ${subject}
---------------------
${html}
`);
      return { success: true, messageId: "DEV_MODE" };
    }

    // ----------------- SEND EMAIL -----------------
    const info = await transporter.sendMail({
      from: `"MovieFlix" <${process.env.SENDER_EMAIL}>`,
      to,
      subject,
      html,
    });

    console.log(`✅ Email sent to ${to}: ${info.messageId}`);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error(`❌ Email failed to ${to}:`, error?.message || error);
    throw new Error(`Email send failed: ${error?.message || ""}`);
  }
}

export default sendEmail;
