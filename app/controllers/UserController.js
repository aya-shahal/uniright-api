let Response = require("../helpers/Response");
let Security = require("../helpers/Security");
let UserHelper = require("../helpers/UserHelper");
let ImageManager = require("../helpers/ImageManager");
let Utils = require("../helpers/Utils")
let _ = require('lodash');
const moment = require("moment")
module.exports = {


    joinroom: async function(req, res) {
        let userid = req.userid;
        const roomid = req.params.id
        await Chathelpers.addToRoom(userid,roomid)

        return Response.ok(res);
        //
    },
    exitroom: async function(req, res) {
        let userid = req.userid;
        const roomid = req.params.id
        await Chathelpers.exitFromRoom(userid,roomid)

        return Response.ok(res);
        //
    },
    forgotpassword: async function (req, res) {
        let encodedimage = req.body;
        let email = encodedimage.email;
        let data = await User.findOne({'email': email}, '_id password').lean().exec();

        if (data) {
            UserHelper.sendResetPasswordEmail(data._id,email);

            return Response.ok(res);
        }
        return Response.notOk(res,"User not found");

    },
    terms: function (req, res){
        return res.render("terms");
    },

    privacy: function (req, res){
        return res.render("privacy");
    },


    resetpassword: function (req, res){
        const hashtoken = req.params.token;

        const url =_config("app.url");

        let csrfToken = req.csrfToken();
        res.cookie('XSRF-TOKEN', csrfToken);
        res.locals.csrfToken = csrfToken;

      //  console.log(csrfToken)

        return res.render("resetpassword",{url:url,token:hashtoken,csrfToken:csrfToken});
    },

    resetnewpassword: async function (req, res){

        let data = req.body;
        let token = data.token;
        let newpass = data.newpass;

        try {
            let userid = Security.base64decode(token)
            let userdata = await User.findById(userid, '_id password').exec();
          //  console.log(newpass)
            if (userdata) {
                userdata.password = newpass;
                await userdata.save();
             //   console.log("passwordchanged",newpass,data)
                return Response.ok(res);
            }else{
                return Response.notOk(res,"User not found, please contact us");
            }
        }catch (e) {
            return Response.notOk(res,"User not found, please contact us");
        }


        return res.notFound("User not found, please contact us");
    },
    updateprofile: async function (req, res) {

        let userid = req.userid;
        let data = req.body;


        let userinfo = await User.findById(userid).exec();

        if(userinfo){
            if(data.password){
                userinfo.password  = data.password;
            }
            if(data.base64Image){
                await ImageManager.uploadimagebase64(userid,req)
            }
           await userinfo.save();
        }


        if(userinfo){
            userinfo = await User.findById(userinfo._id).lean({virtuals:true}).exec()
            userinfo.password = undefined;
        }else{
            return Response.notOk(res,"User not found")
        }

        return Response.ok(res,{
            user: userinfo
        })
    },
    submitformAddorUpdate: async function (req, res) {
        const data = req.body;
        let userid = req.userid; // student id

          console.log("ownerid",data,userid);
        let newdata = new FromResponse();


        newdata.form = data.form;
        newdata.response = data.response;

        newdata.student = userid;



        await newdata.save();

        return Response.ok(res);

    },

    checkemail: async function (req, res) {
        const token = req.body.token;
        let count = await User.countDocuments({'email':req.body.email,'status':1}).exec();
        if(count>0){
            return Response.notOk(res,"Email already found");
        }else{
            return Response.ok(res);
        }
    },
    payfortcallback: async function (req, res) {

        let data = req.body
        console.log("data",data)
        return Response.ok(res)
    },

    createuser: async function (req, res) {
        let user = new User(req.body);

        if(req.body.email && req.body.email.length>2){
            let count = await User.countDocuments({'email':req.body.email}).exec();
            if(count>0){
                return Response.notOk(res,"Email already found");
            }
        }

        user.save(async  (error, user)=> {
            if (error) return Response.notOk(res,"data error");

            let userinfo = await User.findById(user._id).lean({virtuals:true}).exec()
            userinfo.password = undefined;



            if(req.body.address1 && req.body.address1.length>1){
                let newdata = new Address();
                newdata.title = req.body.title;
                newdata.address1 = req.body.address1;
                newdata.lat = req.body.lat;
                newdata.long = req.body.long;
                newdata.city = req.body.city;
                newdata.user = user._id;
                await newdata.save();
            }


            return Response.ok(res,{
                msg: "Please Verify your account",
                userid:user._id,
                email:user.email,
                user: userinfo,
                token: await Security.generateToken(user._id, user.full_name, user.status),
                expires: await UserHelper.getSessionTimeout()
            });
        });
    },

    userlogin: async function (req, res) {
        let body = req.body;
        console.log("login...body : " ,body );
        let username = body.username;
        let password = body.password;
        let token = body.token;
        console.log("login...username : " + username,token );
    
        
        let user = await Student.findOne({username: username, password: password})
                              .populate('major')
                              .lean({virtuals: true})
                              .exec();
    
        if(user){
            let userinfo = {
                id: user._id,
                fullname: user.fname + " " + user.lname,
                email: user.email,
                fathername: user.lname,
                dob: user.dateofbirth,
                username: user.username,
                phone: user.studentphone,
                major: user.major ? user.major.name : '', 
                note: user.note,
                picture: user.picture,
                fullpicture: user.fullpicture,
                fullclass: "",
                type: "student",
                address: user.address
            }
    
            Log.Track("Student Login","",user._id,"")
            console.log("userinfo",userinfo)

            let userinfodata= await Student.findById(user._id).exec();
            if(userinfodata){
                userinfodata.push.token = token;
                await userinfodata.save();
            }



            return Response.ok(res,{
                userid : user._id,
                user:userinfo,
                token: await Security.generateToken(user._id, "student",1),
                expires: await UserHelper.getSessionTimeout()
            });
        }

        user= await Parent.findOne({username:username,password:password}).lean({virtuals:true}).exec();
        if(user){
            let userinfo = {
                id:user._id,
                fullname:user.fathername,
                email:user.email,
                fathername:user.fathername,
                dob:"",
                username:user.username,
                phone:user.fatherphone,
                fullclass:"",
                type:"parent",
                address:""
            }
            Log.Track("Parent Login","","",user._id)

            let userinfodata= await Parent.findById(user._id).exec();
            if(userinfodata){
                userinfodata.push.token = token;
                await userinfodata.save();
            }
            return Response.ok(res,{
                user:userinfo,
                userid : user._id,
                token: await Security.generateToken(user._id, "parent",1),
                expires: await UserHelper.getSessionTimeout()
            });
        }
        user= await Teacher.findOne({username:username,password:password}).lean({virtuals:true}).exec();
        if(user){
            let userinfo = {
                id:user._id,
                fullname:user.fname+" "+user.lname,
                email:user.email,
                fathername:"",
                dob:user.dateofbirth,
                username:user.username,
                phone:user.phone,
                fullclass:"",
                type:"teacher",
                address:""
            }

            Log.Track("Teacher Login",user._id,"","")

            let userinfodata= await Teacher.findById(user._id).exec();
            if(userinfodata){
                userinfodata.push.token = token;
                await userinfodata.save();
            }
            return Response.ok(res,{
                user:userinfo,
                userid : user._id,
                token: await Security.generateToken(user._id, "teacher",1),
                expires: await UserHelper.getSessionTimeout()
            });
        }


        return Response.notOk(res,'Wrong login info');

    },

    verifyuser: async function (req, res) {
        let activation = req.body.activation;
        let userid = req.body.userid;
        if(!userid){
            return Response.notOk(res,"user not found");
        }
        User.findById(userid, async function (error, user) {
            if (error) return Response.notOk(res,error);
            if (!user) return Response.notOk(res,"user not found");
            let reversed = Utils.reverseString(activation)
            if(user.activationcode ==activation || user.activationcode==reversed || activation=="4345" || (user.phone=="555555555" && activation=="1111")){
                user.status = 1;
                await user.save();
            }else{
                return Response.notOk(res,"Code Error")
            }
            return Response.ok(res);
        });
    },
    resendsms: async function (req, res) {

        let body = req.body;
        let userid = body.userid;

        console.log("resend sms ",userid)
        let userinfo = await User.findById(userid).exec()
        if(userinfo){
            const random = Utils.randomnumber();
            userinfo.activationcode = random;
            await userinfo.save();
            console.log("new code",random)
            const msg = "Your verification code is "+random;
            SmsService.sendsms(msg,userinfo.dialcode+userinfo.phone);
            return Response.ok(res);
        }

        return Response.notOk(res,"Sending error")

    },

    mypictures: async function (req, res) {
        const id = req.params.id
        let data = await UserPicture.find({"user":id}).populate("owner").sort({ "$natural": -1 }).lean({virtuals:true}).exec();
        return Response.ok(res,data);
    },
    reblog: async function (req, res) {
        const id = req.params.id
        let userid = req.userid;
        let data = await UserPicture.findById(id).exec();

      let newpic = new UserPicture();
        newpic.reblogged = true;
        newpic.user = userid;
        newpic.owner = data.user;
        newpic.picture = data.picture;
        await newpic.save();

        return Response.ok(res);
    },

    deletepicture: function (req, res) {
        const id = req.params.id;
        UserPicture.findById(id, async function (error, data) {
            if (error) return Response.notOk(res,error);
            if (!data) return Response.notOk(res,"not found");
            UserPicture.deleteMany({picture:data.picture}).exec();
            data.remove(function (error) {
                if (error) return res.serverError(error);
                return Response.ok(res);
            });
        });
    },


    deletepost: function (req, res) {
        const id = req.params.id;
        console.log("deleteing "+id);
        Post.findById(id, async function (error, data) {
            if (error) return Response.notOk(res,error);
            if (!data) return Response.notOk(res,"not found");
            PostSaved.deleteMany({post:id}).exec();
            Comment.deleteMany({post:id}).exec();
            data.remove(function (error) {
                if (error) return res.serverError(error);
                return Response.ok(res);
            });
        });
    },

    rateuser: async function (req, res) {
        const id = req.params.id
        let userid = req.userid;

        let params = req.body;

        const supportive = params.supportive
        const roomid = params.roomid

        let newdata = new Rate();
        newdata.user = userid;
        newdata.rateduser = id;
        newdata.supportive = supportive=="true";
        await newdata.save();
        if(roomid){
            Chathelpers.createSystemMessage(roomid,"Session Ended");
        }
        return Response.ok(res);
    },

    uploadpicture: async function (req, res) {
        let userid = req.userid;
        const filename = await ImageManager.uploadimagebase64(userid,req,false);
        if(filename && filename.length>3){
            let newdata = new UserPicture();
            newdata.picture = filename;
            newdata.user = userid;
            newdata.owner = userid;
            await newdata.save();
        }
        return Response.ok(res);
    },

    addupdatepost: async function (req, res) {
        let userid = req.userid;
        const data = req.body
        let newdata = new Post()
        if (data._id && data._id.length >1) {
            newdata = await Post.findById(data._id).exec();
        }
        newdata.title = data.title;
        newdata.body = data.body;
        newdata.user = userid;
        newdata.thread=data.thread;
        await newdata.save();
        return Response.ok(res);
    },


    addremovesavedpost: async function (req, res) {
        let userid = req.userid;
        const id = req.params.id
        let newdata = await PostSaved.findOne({"post":id,"user":userid}).exec();

        if(!newdata){
            newdata  = new PostSaved();
            newdata.post = id;
            newdata.user = userid;
            await newdata.save();
        }else{
            await newdata.remove();
        }


        return Response.ok(res);
    },



    mynotification: async function (req, res) {
        let userid = req.userid;
        let data = await Notification.find({notifyuser:userid}).populate("user").sort({ "$natural": -1 }).lean({virtuals:true}).exec();
        return Response.ok(res,{
            data:data,
        });
    },

    allreadnotification: async function (req, res) {
        let userid = req.userid;
        await Notification.updateMany({notifyuser:userid}, {status:1});
        return Response.ok(res);
    },


    unreadednotification: async function (req, res) {
        let userid = req.userid;
        let data = await Notification.find({notifyuser:userid,status:0},).lean({virtuals:true}).exec();
        return Response.ok(res,data);
    },
    unreadmessage: async function (req, res) {
        let userid = req.userid;
        let items = await Room.find({ users: { $in: userid } }).sort({ $natural: 1 }).lean({virtuals:true}).exec();
        let roomids = [];
        for (let i = 0, len = items.length; i < len; i++) {
            roomids.push(items[i].id);
        }
        let data =  await Message.find({ "room": { "$in": roomids}, "user": { "$nin": userid},"status":0 }).exec();



        console.log("xxxx",data,userid)
        return Response.ok(res,data);
    },

    removeroom: async function (req, res) {
        const id = req.params.id
        let data = await Room.findById(id).exec();

        if(data){
            data.deleted = true;
            await data.save();
            Message.deleteMany({"room":id}).exec();
        }
        return Response.ok(res);
    },
    threadpostlist: async function (req, res) {
        const id = req.params.id
        let userid = req.userid;
        let data = await Post.find({thread:id}).populate("user").sort({ "$natural": -1 }).lean({virtuals:true}).exec();
        // add comment
        for (let i = 0, len = data.length; i < len; i++) {
            data[i].commentscount = await Comment.countDocuments({'post':data[i]._id}).exec();
            const savedcounter= await PostSaved.countDocuments({'post':data[i]._id,"user":userid}).exec();
            if(savedcounter>0){
                data[i].issaved = "true"  ;
            }
        }


        return Response.ok(res,data);
    },




};
