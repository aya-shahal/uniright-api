const imagesUpload = require("images-upload-middleware").default;
let ImageManager = require("./app/helpers/ImageManager");
require("./lib/helpers");

/* Configurations */

app.loadConfig();

/* Responses */

app.loadResponses();

/* Services */

app.loadServices();


/* Middlewares */

app.loadMiddlewares();

/* Models */

app.loadModels();

/* Controllers */

app.loadControllers();


app.set("env", _config("app.env"));
app.set("views", _config("app.views"));
app.set("view engine", _config("app.view_engine"));
app.set("x-powered-by", _config("app.x_powered_by"));
app.set('trust proxy', _config("app.trust_proxy"));

app.post('/multipleo', imagesUpload(
    './public/upload',
    _config("app.imageurl"),
    true
));



app.post('/multiple', async function(req, res, next) {
    // todo // better switch to https://www.npmjs.com/package/react-images-uploading
    // login code here
    const data = await ImageManager.multiuploadimagebody(req,res,"imageFiles","product")
   console.log("data",data,_config("app.imageurl")+"/"+data.imageFiles[0].filename)
    //data.map(i=>{

    //})
    let request = []
    if(data && data.imageFiles[0]){
        request.push(_config("app.imageurl")+"/"+data.imageFiles[0].filename)
    }
     //  ["http://188.166.52.152:3061/upload/f35af15d6641912e182af4e0a88b87aa.jpg"]
    res.send(JSON.stringify(request)); // redirect to the get request of the home page if you want or make the response you want
})

module.exports = app;
