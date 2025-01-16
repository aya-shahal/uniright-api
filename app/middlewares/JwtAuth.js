let jwt = require("jsonwebtoken");
let UserHelper = require("../helpers/UserHelper");
module.exports = async function (req, res, next) {

    let token = req.headers['token'];
    let lang = req.headers['lang'];
    if(lang){
        req.lang=lang;
    }else{
        req.lang="en";
    }
    const timeout = await UserHelper.getSessionTimeout();

   // console.log("checking jwt...",token);
    jwt.verify(token, _config("jwt.secret"),
        {expiresIn: timeout}, async function(error, decoded) {

        if (error) return next(error);
          // console.log("ismanager",decoded)
            //if (!decoded || decoded.status === 0 ) return res.forbidden();


            const userid = decoded._id;
            const type = decoded.full_name;
            const ismanager = decoded.ismanager;
            //console.log("ismanager",decoded)


           // if(!ismanager){
             //   const testuser = await User.findById(userid).lean().exec();
             //   if(!testuser  || testuser.status === 0){
              //      return res.forbidden("Access Denied");
              //  }
           // }

            // check if not active anymoree
           // console.log("user id ...."+JSON.stringify(decoded._id))
            //console.log("user id ...."+userid);
            req.userid = userid;
            req.type= type;
            next();

    });

};
