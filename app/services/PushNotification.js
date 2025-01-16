let PushNotifications = require("node-pushnotifications");
module.exports = {

    globalsend: function(registrationIds,title,msg){

        console.log("send push ",msg)
        //return;
        try {
            if(!registrationIds || registrationIds.length<2){
                console.log("invalid push token")
                return;
            }
            registrationIds = registrationIds.replace('"','');
            registrationIds = registrationIds.replace('"','');
            const settings = {
                gcm: {
                    id: _config("app.androidsecret"),
                    isAlwaysUseFCM: true
                },
                apn: {
                    token: {
                        key: "./certs/ios.p8", // optionally: fs.readFileSync('./certs/iossandbox.p8')
                        keyId: _config("app.keyId"),
                        teamId: _config("app.teamId")
                    },
                    production: true // true for APN production environment, false for APN sandbox environment,
                },
            };
            const push = new PushNotifications(settings);

            const data = {
                title: title, // REQUIRED for Android
                body: msg,
            };

            console.log("sending",data)

            push.send(registrationIds, data, (err, result) => {
                if (err) {
                    console.log(err);
                } else {
                    console.log(result);
                    console.log(result[0].message);
                }
            });
        }catch (e) {

            console.log("error",e)
        }

    },




};
