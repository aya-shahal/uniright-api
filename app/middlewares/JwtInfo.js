let jwt = require("jsonwebtoken");

module.exports = function (req, res, next) {

    let token = req.headers['token'];
    let guestid = req.headers['guestid'];

    req.guestid = guestid;
    //console.log("checking jwt...");
    jwt.verify(token, _config("jwt.secret"),
        {expiresIn: _config("jwt.expires")}, function(error, decoded) {

            //if (error) {
                //console.log("xxx",error)
               // return next(error);
          //  }
           // if (!decoded  ) return res.forbidden();

            if(decoded){
                console.log(decoded.status+" user id ...."+decoded._id);
                req.userid = decoded._id;
            }

            next();

        });

};
