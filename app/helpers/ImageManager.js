const multer = require("multer");
let fs = require("fs");
let uuidv4 = require("uuid/v4");
const path = require("path");
const util = require("util");
module.exports =  {

    uploadimagebase64row: async function (encoded,fileextesntion = "png") {

        //const fileextesntion = encoded.substring(encoded.indexOf('/') + 1, encoded.indexOf(';base64'));
        try
        {
            if(encoded.includes("doc") || encoded.includes("docx") || encoded.includes("pdf") || encoded.includes("video") || encoded.includes("image")){
                fileextesntion = encoded.substring(encoded.indexOf('/') + 1, encoded.indexOf(';base64'));
                encoded = encoded.split(',')[1];
            }
            let filename = uuidv4()+"."+fileextesntion;
            let filepath = _config("app.local_upload_path")+filename;
            await fs.writeFile(filepath, encoded, 'base64', function(error) {
                if (error) return false;
            });

            console.log("saving...",filename)

            return filename;
        }
        catch(error)
        {
            console.log("uploadimagebase64 false",error)
            return false;
        }
    },
    uploadimagebase64: async function (userid,req,save=true) {

        console.log("upload image")
        let encodedimage = req.body;
        let encoded = encodedimage.base64Image;
        let filename = uuidv4()+".png";
        let filepath = _config("app.local_upload_path")+filename;

        let userinfo = await User.findById(userid).exec();
        if(userinfo){
            if(!encoded && encoded.length<3){
                userinfo.picture = "userprofile.png";
                await userinfo.save();
                return null;
            }
            try
            {

                await fs.writeFile(filepath, encoded, 'base64', function(error) {
                    if (error) return false;
                });

                if(save){
                    userinfo.picture = filename;
                    await userinfo.save();
                }

                console.log("saving...",filename)
            }
            catch(error)
            {
                console.log("uploadimagebase64 false")
                return false;
            }
        }

        return filename;
    },

    multiuploadfields: async function (req,res,fieldname1 = "picture",fieldname2 = "picture",prefix = "profile") {

        const storage = multer.diskStorage({
            destination: "./public/upload/",
            filename: function(req, file, cb){
                cb(null,prefix+"-" + Date.now() + path.extname(file.originalname));
            }
        });
        let upload = multer({
            storage: storage,
            limits:{fileSize: 10000000},
        }).fields([{
            name: fieldname1
        }, {
            name: fieldname2
        }]);

        const uploadx = util.promisify(upload);

        try {

            await uploadx(req, res);

            let body= req.body;
           // console.log("files",req.files)
           // console.log(body)
            if(body && req.files && req.files[fieldname1]){
                body[fieldname1] = req.files[fieldname1];
                console.log("files1",req.files[fieldname1])
                if(body[fieldname1] && body[fieldname1].filter){
                    body[fieldname1] = body[fieldname1].filter(item => item !== undefined)
                }

            }
            if(body && req.files && req.files[fieldname2] && req.files[fieldname2]){
                console.log("files2",req.files[fieldname2])
                body[fieldname2] = req.files[fieldname2][0].filename;
                // unlink the other

                console.log("files2xxx ",body[fieldname2] , req.files[fieldname2][0].filename)
                try {
                    if(req.files[fieldname2][1]){
                        const deletedPath = "./public/upload/"+req.files[fieldname2][1].filename;
                        console.log("delete...",deletedPath)
                        fs.unlinkSync(deletedPath)
                    }
                }catch (err) {
                    console.error(err)
                }


            }
            if(body){
                console.log("success upload ")
                return body
            }else{
                return body
            }
        }catch (e) {

            console.log("error ",e)
        }


    },

    multiuploadimagebody: async function (req,res,fieldname = "picture",prefix = "profile") {

        const storage = multer.diskStorage({
            destination: "./public/upload/",
            filename: function(req, file, cb){
                cb(null,prefix+"-" + Date.now() + path.extname(file.originalname));
            }
        });

        let upload = multer({
            storage: storage,
            limits:{fileSize: 10000000},
        }).array(fieldname);

        const uploadx = util.promisify(upload);

        await uploadx(req, res);

        let body= req.body;
        //console.log("files",req.files)
       if(body && req.files){
            body[fieldname] = req.files;
        }
        console.log("multi picture file length " +req.files.length);
        if(body){
            console.log("success upload ")
            return body
        }else{
            return body
        }

    },

    uploadimagebody: async function (req,res,fieldname = "picture",prefix = "profile") {

        const storage = multer.diskStorage({
            destination: "./public/upload/",
            filename: function(req, file, cb){
                cb(null,prefix+"-" + Date.now() + path.extname(file.originalname));
            }
        });

        let upload = multer({
            storage: storage,
            limits:{fileSize: 10000000},
        }).single(fieldname);


        const uploadx = util.promisify(upload);

        await uploadx(req, res);

        let body= req.body;
        if(body && req.file){
            body[fieldname] = req.file.filename;
        }
        if(body){
            console.log("success upload ")
            return body
        }else{
            return body
        }

    },


};
