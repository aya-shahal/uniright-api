module.exports = {

    /**
     * The runtime "environment" of your app is either typically
     * 'development' or 'production'.
     */

    env: process.env.NODE_ENV || 'development', // production

    /**
     * The application base url
     */

    url: 'http://localhost:3061',

    /**
     * The `port` setting determines which TCP port your app will be deployed on.
     */

    port: process.env.PORT || 3003,

    /**
     * The application base url
     */

    imageurl: 'http://localhost:3003/upload',

    /**
     * Enabling trust proxy will have the following impact:
     * The value of req.hostname is derived from the value set in the X-Forwarded-Host header, which can be set by the client or by the proxy.
     * X-Forwarded-Proto can be set by the reverse proxy to tell the app whether it is https or http or even an invalid name. This value is reflected by req.protocol.
     * The req.ip and req.ips values are populated with the list of addresses from X-Forwarded-For.
     */

    trust_proxy: true,

    /**
     * The x-powered-by header key
     */

    x_powered_by: 'sam',

    /**
     * View engine to use for your app's server-side views
     */

    view_engine: "ejs",

    /**
     * The views directory path
     */

    views: require('path').join(__basepath, 'app/views'),

    /**
     * The api url prefix
     */

    api_prefix: "api",

    /**
     * The upload folder path
     */

    upload_path: "upload/",

    local_upload_path: "public/upload/",
    cryptrkey : "myTotalySecretKey",
    conractid : "contract id",

    pagination_limit: 20,
    csvuploadpath : "./",
    // gmail login info for sending mail
    gmailfrom : "samer@rowad-services.com",
    gmailpass: "zgvaymhdmeaiwi",
    // secret for session token
    secret : "893c53d48ecf4d609bcec71b220f2fff",

    // right school app push android
    androidsecret : "AAAAJd0XOYA:APA91bFGuxPi6fG6lPeRzNCFcjowcc7oLWOGoGAK2g2BzkB-1xHnvmqWpfGg80tEnDMUM5Uw_VQHeuA5WLN8_rxrTxpk58IgDGv2dboqZ7H9jEP7qnXg7TE4Z_Rbu-kO-BfNJPh1vTWv",

    // push ios,
    keyId : '7BGD3BRX62',
    teamId : 'CC39RKG333',
    topic : 'com.righttracksolutionschool.app', // appbundle

    localpathx:"/Users/samerdernaika/Desktop/projects/backend/uniright-api/public/upload/"

};

