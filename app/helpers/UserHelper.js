let _ = require('lodash');

let Security = require("../helpers/Security");


module.exports =  {

    getSessionTimeout:async function () {
        //console.log("getSessionTimeout")
        //return "10h"
       // const data  = await Settings.findOne().lean().exec();
        let timeout = _config("jwt.expires")
       // if(data){
         //   timeout= data.session*60; // return number in seconds
      //  }
        return parseInt(timeout);
    },


    sendResetPasswordEmail:async function (userid,email) {
        console.log("sendActivationEmail ",userid,email)
        let resettoken = Security.base64encode(""+userid);
        let link = _config("app.url")+"/resetpassword/"+resettoken;
        const msg = "Hey , please click on the link below to reset your password : <a href='"+link+"'> Click Here</a>";
        EmailService.sendemail(email, "RESET YOUR PASSWORD", msg);
    },

    sendVerificationEmail:async function (userid,email) {
        console.log("sendVerificationEmail ",userid,email)
        return;
        let resettoken = Security.base64encode(""+userid);
        let link = _config("app.url")+"/verifyemail/"+resettoken;
        const msg = "Hey , please click on the link below to verify your email : <a href='"+link+"'> Click Here</a>";
        EmailService.sendemail(email, "VERIFY YOUR EMAIL", msg);
    },
    sendVerificationAccount:async function (phone,activationcode) {
        return;
        SmsService.sendsms("Verify Your account , Your activation code is : "+activationcode,phone);
    },
    sendPhoneVerification:async function (phone,activationcode) {
        return;
        SmsService.sendsms("Verify Your phone , Your activation code is : "+activationcode,phone);
    },

};
