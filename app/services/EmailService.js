const nodemailer = require("nodemailer");

module.exports = {

    /**
     * Send emails
     * @param req
     * @param res
     */
    sendemail: async function (email,subject,msg) {
        console.log("send email..to :"+email,msg)
        //return;



        const smtpTransport = nodemailer.createTransport({
            host: 'smtp.office365.com',
            logger: true,
            port: 587,
            auth: {
                user: "",
                pass: ""
            }
        });

        const mailOptions = {
            from: _config("app.gmailfrom"), // sender address
            to: email, // list of receivers
            subject: subject, // Subject line
            html: msg// plain text body
        };

        smtpTransport.sendMail(mailOptions, function (err, info) {
            if(err){
                console.log(err)
            }else{
                console.log(info);
                console.log("sent!")
            }
        });

    },
}
