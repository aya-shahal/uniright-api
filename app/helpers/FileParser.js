const fs = require('fs');
let util = require('util')
let Utils = require("../helpers/Utils")
let url = require('url')
let mkdirp = require('mkdirp')
const csv = require("csvtojson");
module.exports =  {

    parseteacher:  async function (filename) {
        console.log("csv paring ",filename);
        const csv=require('csvtojson')

        let path = _config("app.localpathx")+filename
        // path = "/Users/apple/Desktop/project/mine/rowad-api/public/upload/"+filename
        //return;
        const jsonArray=await csv().fromFile(path)

        for (let i = 0; i < jsonArray.length; i++) {


            const item = jsonArray[i];
            let id = item.id;
            let firstname = item.teacher;
            let familiyname = "";
            let sex = "";
            let nationality = "";
            let dateofbirth = "";
            let email = item.email;
            let phone = item.phone;



            //if(id.length<1){
             //   console.log("skip name error")
             //   continue;
           // }


            try{

                // add teacher
                let checkifbrandfound = await Teacher.findOne({ fname: { $eq: firstname } }).exec();
                let isnew = false;
                if(!checkifbrandfound){
                    checkifbrandfound = new Teacher();
                    isnew = true;
                }

                checkifbrandfound.teacherid=id;
                checkifbrandfound.fname=firstname;
                checkifbrandfound.lname=familiyname;
                checkifbrandfound.sex=sex;
                checkifbrandfound.nationality=nationality;
                checkifbrandfound.dateofbirth=dateofbirth;
                checkifbrandfound.phone=phone;
                checkifbrandfound.email=email;
                checkifbrandfound.username = "teacher"+i+Utils.randomstring(4);
                checkifbrandfound.password = "pax"+Utils.randomstring(6);

                await checkifbrandfound.save();
                console.log("saved "+checkifbrandfound.fname);

                console.log("continue "+i);
            }catch (e) {
                console.log("error",e)
            }



        }

        console.log("done")


        return {ok:jsonArray}

    },

    parsestudents:  async function (filename) {
        console.log("csv paring ",filename);
        const csv=require('csvtojson')

        let path = _config("app.localpathx")+filename
        // path = "/Users/apple/Desktop/project/mine/rowad-api/public/upload/"+filename
        //return;
        const jsonArray=await csv().fromFile(path)

        for (let i = 0; i < jsonArray.length; i++) {

            let catidlist = []
            const item = jsonArray[i];
            let id = item.id;
            let firstname = item.firstname;
            let fathername = item.fathername;
            let mothername = item.mothername;
            let familiyname = item.familiyname;
            let sex = item.sex;
            let nationality = item.nationality;
            let registrationrecord = item.registrationrecord;
            let birthlocation = item.birthlocation;
            let dateofbirth = item.dateofbirth;
            let classx = item.class;
            let classlang = "ar";
            let classdivision = item.classdivision;
            let studentphone = item.studentphone;
            let fatherphone = item.fatherphone;
            studentphone = fatherphone;
            let motherphone = item.motherphone;
            let bloodtype = item.bloodtype;
            let registredat = item.registredat;






            if(!id || id.length<1){
                console.log("skip name error")
                continue;
            }


            try{


                // add parent
                let checkparentfound = await Parent.findOne({ fathername:fathername,fatherfamily:familiyname,mothername:mothername }).exec();
                if(!checkparentfound){
                    checkparentfound = new Parent();
                }else{
                    console.log("parent already found ",familiyname)
                }
                checkparentfound.fathername=fathername;
                checkparentfound.fatherfamily=familiyname;
                checkparentfound.mothername=mothername;
                checkparentfound.fatherphone = fatherphone;
                checkparentfound.motherphone = motherphone;
                checkparentfound.username = "parent"+i+Utils.randomstring(4);
                checkparentfound.password = "pax"+Utils.randomstring(6);
                await checkparentfound.save();

                // add class
                let checkclassfound = await Classx.findOne({ name:classx,lang:classlang,section:classdivision }).exec();
                if(!checkclassfound || !checkclassfound.name){
                    checkclassfound = new Classx();
                }

                checkclassfound.name=classx;
                checkclassfound.lang=classlang;
                checkclassfound.section=classdivision;
                await checkclassfound.save();

                // add student
              //  let checkifbrandfound = await Student.findOne({ studentid: { $eq: id } }).exec();
                let checkifbrandfound = await Student.findOne({ fname: { $eq: firstname },lname: { $eq: familiyname } }).exec();
                let isnew = false;
                if(checkifbrandfound){
                    console.log("already found",{ fname: { $eq: firstname },lname: { $eq: familiyname } })
                }
                if(!checkifbrandfound || !checkifbrandfound.fname){
                    checkifbrandfound = new Student();
                    isnew = true;
                }

                checkifbrandfound.studentid=id;
                checkifbrandfound.fname=firstname;
                checkifbrandfound.lname=familiyname;
                checkifbrandfound.sex=sex;
                checkifbrandfound.nationality=nationality;
                checkifbrandfound.registrationrecord=registrationrecord;
                checkifbrandfound.birthlocation=birthlocation;
                checkifbrandfound.dateofbirth=dateofbirth;
                checkifbrandfound.studentphone=studentphone;
                checkifbrandfound.blood=bloodtype;
                checkifbrandfound.registredat=registredat;
                checkifbrandfound.parent = checkparentfound.id;
                checkifbrandfound.classx = checkclassfound.id;
                checkifbrandfound.username = "stude"+i+Utils.randomstring(4);
                checkifbrandfound.password = "pax"+Utils.randomstring(6);

                await checkifbrandfound.save();
                //console.log("saved "+checkifbrandfound.fname);

                //console.log("continue "+i);
            }catch (e) {
                console.log("error",e)
            }



        }

        console.log("done")


        return {ok:jsonArray}

    },

    parseteacherclass:  async function (filename) {
        console.log("csv paring ",filename);
        const csv=require('csvtojson')

        let path = _config("app.localpathx")+filename
        // path = "/Users/apple/Desktop/project/mine/rowad-api/public/upload/"+filename
        //return;
        const jsonArray=await csv().fromFile(path)

        for (let i = 0; i < jsonArray.length; i++) {


            const item = jsonArray[i];
            let teacher = item.teacher;

            let matier = item.matier.trim();
            let classx = item.class.trim();
            if(classx=="الأول"){
                classx = "الاول"
            }
            let classlang = "ar";
            let classdivision = item.section.trim();



            if(teacher.length<1){
                console.log("skip name error")
                continue;
            }


            try{

                // add class
                let checkclassfound = await Classx.findOne({ name:classx,lang:classlang,section:classdivision }).exec();
                if(!checkclassfound){
                    checkclassfound = new Classx();
                }else{
                    console.log("class found")
                }

                checkclassfound.name=classx;
                checkclassfound.lang=classlang;
                checkclassfound.section=classdivision;
                await checkclassfound.save();


                // add matier
              let checkmatier = await Matier.findOne({ name:matier,classx:checkclassfound.id }).exec();
                if(!checkmatier){
                    checkmatier = new Matier();
                }else{
                    console.log("matier found")
                }

                checkmatier.classx=checkclassfound.id;
                checkmatier.name=matier;
                await checkmatier.save();

                // check teacher
                let checkteacher = await Teacher.findOne({ fname: { $eq: teacher } }).exec();
                if(!checkteacher ){
                    console.log("teacher not found")
                    continue;
                }

                let checkteachermatier = await TeacherMatier.findOne({ teacher: { $eq: checkteacher.id },matier:checkmatier.id }).exec();
                if(!checkteachermatier ){
                    checkteachermatier = new TeacherMatier();
                }

                checkteachermatier.teacher=checkteacher.id;
                checkteachermatier.matier=checkmatier.id;
                checkteachermatier.classx=checkclassfound.id;

                await checkteachermatier.save();

                console.log("continue "+i);
            }catch (e) {
                console.log("error",e)
            }



        }

        console.log("done")


        return {ok:jsonArray}

    },

    parsequiz:  async function (data,filename) {

        const csv=require('csvtojson')

        let path = _config("app.localpathx")+filename
        // path = "/Users/apple/Desktop/project/mine/rowad-api/public/upload/"+filename
        //return;

        console.log("csv paring ",path);
        const jsonArray=await csv().fromFile(path)



        let newdata = new Form();
        newdata.name = data.name;
        newdata.namekr = data.namekr;

        newdata.matier = data.matier;
        let inputlist = []
        for (let i = 0; i < jsonArray.length; i++) {
            const item = jsonArray[i];
            let question = item.question.trim();
            let type = item.type.trim();
            let value = item.value.trim();
            inputlist.push({
                sno:(1+i),
                name:question,
                type:type,
                value:value
            })

        }

        newdata.inputlist = inputlist;
        await newdata.save();

        console.log("done")


        return {ok:jsonArray}

    },
    nativedownload : async function (file, options,callback) {

        if (!file) throw("Need a file url to download")

        if (!callback && typeof options === 'function') {
            callback = options
        }

        options = typeof options === 'object' ? options : {}
        options.timeout = options.timeout || 20000
        options.directory = options.directory ? options.directory : '.'

        let uri = file.split('/')
        options.filename = options.filename || uri[uri.length - 1]

        let path = options.directory + "/" + options.filename


        let  req = http
        if (url.parse(file).protocol === 'https:') {
            req = https
        } else {
            req = http
        }

        let request = req.get(file, function(response) {

            if (response.statusCode === 200) {

                mkdirp(options.directory, function(err) {
                    if (err) throw err
                    let file = fs.createWriteStream(path)
                    response.pipe(file)
                })

            } else {

                if (callback) callback(response.statusCode)

            }

            response.on("end", function(){
                if (callback) callback(false, path)
            })

            request.setTimeout(options.timeout, function () {
                request.abort()
                callback("Timeout")
            })

        }).on('error', function(e) {

            if (callback) callback(e)

        })


    },

    // download pdf
    downloadpdf : async function (pdfurl,filename) {
        try {

            const options = {
                directory: './public/pdf/',
                filename: filename
            }
            const httpDownload = util.promisify(this.nativedownload);
            return await httpDownload(pdfurl,options)

        }catch (e) {
            Logger.systemlog("error while downloading pdf  "+e.message);
            return "error while downloading pdf  "
        }

    },

    // parse csv file
    parse:  async function (csvFile) {
        console.log("csv paring ",csvFile);
        const csv=require('csvtojson')
        const jsonArray=await csv().fromFile(_config("app.csvuploadpath")+csvFile)
        let result = []

        for (let i = 0; i < jsonArray.length; i++) {
           //  console.log(jsonArray[i])
            const sub1 = jsonArray[i].sub1
            const sub2 = jsonArray[i].sub2

            const banner = await Category.findOne({name:sub1}).exec();
             if(banner && banner.name){
                 console.log(sub1+" "+banner._id)

                 let newcat = new Category()
                 newcat.name = sub2;
                 newcat.category = banner._id;
                 await newcat.save();
             }else{
                 console.log(sub1+" not found")
             }

            }


    },


};
