const transporter = require("../config/nodemailer")

exports.passwordRecovery=async(email,token)=>{
    transporter.sendMail({
        from:"ScrewIT <no-reply@ScrewIT.com>",
        to:email,
        subject:"Password Reset",
        html:`Click <a href="http://localhost:5173/recovery-password?token=${token}">here</a> to reset your password`
    })
}
