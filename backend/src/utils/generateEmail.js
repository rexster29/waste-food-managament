var nodemailer = require('nodemailer')

const sendEMail = async(option)=>{
    // Here the transporter allows to send the mail to other mail ids 
    console.log(1, "sendmail");
    const transporter = nodemailer.createTransport({
        service:'gmail',
        auth:{
            user:process.env.MAIL_USERNAME,
            pass:process.env.MAIL_PASSWORD
        }
    })
    const mailOptions = {
        from:process.env.MAIL_USERNAME, //system admin mail
        to:option.email,
        subject:option.subject,
        html:option.html
    }
    console.log(2, "sendmail");
    await transporter.sendMail(mailOptions)

}

module.exports = sendEMail


