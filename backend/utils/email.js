const transporter = require("../config/nodemailer");

exports.passwordRecovery = async (email, token) => {
  transporter.sendMail({
    from: "ScrewIT <no-reply@ScrewIT.com>",
    to: email,
    subject: "Password Reset",
    html: `
  <div style="font-family: Arial, sans-serif; background-color: #f9f9f9; padding: 30px;">
    <div style="max-width: 500px; margin: 0 auto; background: #fff; border: 1px solid #ddd; border-radius: 8px; padding: 25px; text-align: center;">
      <h2 style="color: #333;">Reset Your Password</h2>
      <p style="color: #555; font-size: 15px;">
        You recently requested to reset your password for your ScrewIT account. Click the button below to reset it.
      </p>
      <a href="http://localhost:5173/recovery-password?token=${token}" 
         style="display: inline-block; background-color: #007bff; color: #fff; text-decoration: none; 
                padding: 10px 20px; border-radius: 5px; margin-top: 15px; font-weight: bold;">
        Reset Password
      </a>
      <p style="color: #777; font-size: 13px; margin-top: 25px;">
        If you didn’t request this, you can safely ignore this email.
      </p>
      <hr style="border: none; border-top: 1px solid #eee; margin: 25px 0;">
      <p style="color: #aaa; font-size: 12px;">© ${new Date().getFullYear()} ScrewIT. All rights reserved.</p>
    </div>
  </div>
`,
  });
};
