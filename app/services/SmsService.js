const axios = require("axios");

module.exports = {

    /**
     * Send emails
     * @param req
     * @param res
     */
    sendsms: function (msg,phone) {
        // Sending ...
        console.log("sending sms to..."+phone,msg)

        let data = {

            "recipients": [
                phone
            ],

            "body":msg,

            "sender":"Zajil"

        }
        axios.post("https://api.taqnyat.sa/v1/messages",
            data,
            { headers: { "authorization": "Bearer "+_config("app.SMSKEY") } }
        )
            .then((res) => {
              //  console.log("sucesss")
              //  console.log(res.data);
            })
            .catch((err) => {
                console.log(err);
            });

    },
}
