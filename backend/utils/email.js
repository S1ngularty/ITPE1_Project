const transporter = require("../config/nodemailer")

exports.passwordRecovery=async(email)=>{
    transporter.sendMail({
        from:"ScrewIT <no-reply@ScrewIT.com>",
        to:email,
        subject:"Password Reset",
        html:`Click <a href="http://localhost:5173/api/v1/password-recovery">here</a> to reset your password`
    })
}
