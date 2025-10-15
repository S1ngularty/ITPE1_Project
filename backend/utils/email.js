const transporter = require("../config/nodemailer")

exports.passwordRecovery=async(email)=>{
    transporter.sendMail({
        from:"ScrewIT <no-reply@ScrewIT.com>",
        to:email,
        subject:"Password Reset",
        html:`Click <a href="http://localhost:5173/api/v1/recovery-password">here</a> to reset your password`
    })
}
