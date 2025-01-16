/**
 * UsersController
 * @description :: Server-side logic for managing users
 */

let Response = require("../helpers/Response")
let Utils = require("../helpers/Utils");
let StaticData = require("../helpers/StaticData");
let Chathelpers = require("../socket/Chathelpers")
let _ = require('lodash');
let util = require('util')
const ImageManager = require("../helpers/ImageManager");
module.exports = {


    listusernotifications:async function (req, res) {
        let userid = req.userid;
        let data = await Notification.find({touser:userid}).populate("fromuser").sort({ "$natural": -1 }).lean({virtuals:true}).exec();
        return Response.ok(res,data);
    },

    listbanner:async function (req, res) {
        let data = await Banner.find().sort({ "$natural": -1 }).lean({virtuals:true}).exec();
        return Response.ok(res,data);
    },

    forminfo:async function (req, res) {
        const lang = req.lang;
        let ownerid = req.ownerid;
        let id = req.params.id
        let data = await Form.findById(id).lean({virtuals:true}).exec();

        // for mobile
        return Response.ok(res,data);
    },

    listbook:async function (req, res) {
        let data = await Book.find().sort({ "$natural": -1 }).lean({virtuals:true}).exec();
        return Response.ok(res,data);
    },

    listquiz:async function (req, res) {
        let lang =req.lang;
        let data = await Form.find().populate("matier").sort({ "$natural": -1 }).lean({virtuals:true}).exec();
       //console.log("data",data)

        for(let j = 0; j < data.length; j++) {
            data[j] =  Form.Translate(data[j],lang)
        }
        return Response.ok(res,data);
    },



    listschedule:async function (req, res) {
        let lang =req.lang;

        let data = await Schedule.find().populate({
            path:     'teachermatier classx section',
            populate: { path:  'matier',
                model: 'matier' }
        }).sort({ "$natural": -1 }).lean({virtuals:true}).exec();
        //console.log("data",data)


        for(let j = 0; j < data.length; j++) {
            data[j] =  Schedule.Translate(data[j],lang)
        }
        return Response.ok(res,data);
    },

    listhome:async function (req, res) {
        let data = await Banner.find().sort({ "$natural": -1 }).lean({virtuals:true}).exec();
        let general = await News.find({type:"public"}).sort({ "$natural": -1 }).lean({virtuals:true}).exec();
        let classnews = await News.find({type:"private"}).sort({ "$natural": -1 }).lean({virtuals:true}).exec();
        return Response.ok(res, {banner:data,general:general,classnews:classnews});
    },


    listcalendar:async function (req, res) {
        let data = await Calendar.find().sort({ "$natural": -1 }).lean({virtuals:true}).exec();
       // console.log("data",data)
        return Response.ok(res,data);
    },

    listnews:async function (req, res) {
        const  data = await News.find().sort({ "$natural": -1 }).lean({virtuals:true}).exec();

        return Response.ok(res,data);

    },


    listagenda:async function (req, res) {

        let userid =req.userid;
        let type =req.type;
        const studentid = req.params.studentid;
        console.log("userid",userid,type)


        Log.Track("Student list agenda","",userid,"")
        let data = []
        if(studentid){
            let studentinfo = await Student.findById(studentid).exec()
            data = await Agenda.find({ classx: studentinfo.classx }).populate("teacher matier classx").sort({ "$natural": -1 }).lean({virtuals:true}).exec();
        }else
        if(type=="student"){
            let studentinfo = await Student.findById(userid).exec()
            data = await Agenda.find({ classx: studentinfo.classx }).populate("teacher matier classx").sort({ "$natural": -1 }).lean({virtuals:true}).exec();
        }else if(type=="parent"){
            let classids = await Parent.GrabStudentClassIDs(userid)
             data = await Agenda.find({ classx: { $in: classids } }).populate("teacher matier classx").sort({ "$natural": -1 }).lean({virtuals:true}).exec();
        }else if(type=="teacher"){
            let classids = await Teacher.GrabClassIDs(userid)
            data = await Agenda.find({ classx: { $in: classids } }).populate("teacher matier classx").sort({ "$natural": -1 }).lean({virtuals:true}).exec();
        }else{
             data = await Agenda.find().populate("teacher matier classx").sort({ "$natural": -1 }).lean({virtuals:true}).exec();

        }
        // classx

        return Response.ok(res,data);
    },

    mylessons:async function (req, res) {

        let userid =req.userid;
        let type =req.type;
        console.log("userid",userid,type)


        let data = []
        if(type=="teacher"){
            let classids = await Teacher.GrabClassIDs(userid)
            data = await Lesson.find({ teacher:userid }).populate("teacher matier classx").sort({ "$natural": -1 }).lean({virtuals:true}).exec();
        }else{
            data = await Lesson.find().populate("teacher matier classx").sort({ "$natural": -1 }).lean({virtuals:true}).exec();

        }
        // classx

        return Response.ok(res,data);
    },
    listattendance:async function (req, res) {
        let userid = req.userid;
        let type =req.type;
        let lang =req.lang;
        const studentid = req.params.studentid;
        Log.Track("Student list attendance","",studentid,"")
        console.log("userid",userid,type,lang)
        let data = []
        if(studentid){
            data= await Attendance.find({student:studentid}).populate("student classx").sort({ "$natural": -1 }).lean({virtuals:true}).exec();
        }else
        if(type=="parent"){
            let studentids = await Parent.GrabStudentIDs(userid)
            data= await Attendance.find({ student: { $in: studentids } }).populate("student classx").sort({ "$natural": -1 }).lean({virtuals:true}).exec();
        }else if(type=="student"){
            data= await Attendance.find({student:userid}).populate("student classx").sort({ "$natural": -1 }).lean({virtuals:true}).exec();
        }else if(type=="teacher"){
            let studentids = await Teacher.GrabStudentIDs(userid)
            data= await Attendance.find({ student: { $in: studentids } }).populate("student classx").sort({ "$natural": -1 }).lean({virtuals:true}).exec();
        }else{
            data= await Attendance.find().populate("student classx").sort({ "$natural": -1 }).lean({virtuals:true}).exec();
        }

        if(lang=="ar"){
            for(let i = 0 ;i<data.length;i++){
                if(data[i].attendancetype=="Present" || data[i].attendancetype=="present"){
                    data[i].attendancetype = "موجود";
                }
                if(data[i].attendancetype=="absent" || data[i].attendancetype=="Absent"){
                    data[i].attendancetype = "غائب";
                }
            }
        }

      //  console.log("data",data)
        return Response.ok(res,data);
    },

    listgrades:async function (req, res) {
        let userid = req.userid;
        let type =req.type;
        console.log("userid",userid,type)
        const studentid = req.params.studentid;

        Log.Track("Student see grades","",studentid,"")
        let data = []
        if(studentid){
            data=  await Grade.find({student:studentid}).populate("matier student classx").sort({ "$natural": -1 }).lean({virtuals:true}).exec();
        }else
        if(type=="parent"){
            let studentids = await Parent.GrabStudentIDs(userid)
            data=  await Grade.find({ student: { $in: studentids } }).populate("matier student classx").sort({ "$natural": -1 }).lean({virtuals:true}).exec();
        }else
        if(type=="teacher"){
            let studentids = await Teacher.GrabStudentIDs(userid)
            data=  await Grade.find({ student: { $in: studentids } }).populate("matier student classx").sort({ "$natural": -1 }).lean({virtuals:true}).exec();
        }else
        if(type=="student"){
            data=  await Grade.find({student:userid}).populate("matier student classx").sort({ "$natural": -1 }).lean({virtuals:true}).exec();
        }else{
            data=  await Grade.find().populate("matier student classx").sort({ "$natural": -1 }).lean({virtuals:true}).exec();
        }


        return Response.ok(res,data);
    },
    listexam:async function (req, res) {
        let userid = req.userid;
        let type =req.type;
        let lang =req.lang;
        const studentid = req.params.studentid;
        console.log("userid",userid,type)
        let data = []
        if(studentid){
            let userinfo = await Student.findById(studentid).exec();
            data = await Exam.find({classx:userinfo.classx}).populate("matier classx").sort({ "$natural": -1 }).lean({virtuals:true}).exec();

        }else
        if(type=="student"){
            let userinfo = await Student.findById(userid).exec();
            console.log("typetypetypetype",type,userinfo.classx)
            data = await Exam.find({classx:userinfo.classx}).populate("matier classx").sort({ "$natural": -1 }).lean({virtuals:true}).exec();
        }else{
            data = await Exam.find().populate("matier classx").sort({ "$natural": -1 }).lean({virtuals:true}).exec();

        }

        const sortedArray = _.orderBy(data, [(obj) => new Date(obj.time)], ['asc'])
        //console.log("data",sortedArray)


            for(let j = 0; j < data.length; j++) {
                data[j] =  Exam.Translate(data[j],lang)
            }

        return Response.ok(res,data);
    },

    teachersaveagenda: async function (req, res) {
        console.log("teachersaveagenda ....");
        let userid = req.userid;
        const data = req.body;
        let newdata = new Agenda();
        newdata.name = data.name;

        let matierinfo = await Matier.findById(data.matier).exec();
        if(matierinfo){
            newdata.classx = matierinfo.classx;
        }
        newdata.matier = data.matier;

        newdata.datex = data.datex;
        newdata.time = data.time;
        newdata.teacher = userid;
        newdata.text = data.text;
        await newdata.save();
        return Response.ok(res);
    },

    teachersavelesson: async function (req, res) {
        console.log("teachersavelesson ....");
        let userid = req.userid;
        const data = req.body;
        let newdata = new Lesson();
        newdata.name = data.name;

        let matierinfo = await Matier.findById(data.matier).exec();
        if(matierinfo){
            newdata.classx = matierinfo.classx;
        }
        newdata.matier = data.matier;

        newdata.datex = data.datex;
        newdata.time = data.time;
        newdata.teacher = userid;
        newdata.text = data.text;
        await newdata.save();
        return Response.ok(res);
    },


    teachersaveexam: async function (req, res) {
        console.log("teachersaveexam ....");
        let userid = req.userid;
        const data = req.body;
        let newdata = new Exam();
        newdata.name = data.name;

        let matierinfo = await Matier.findById(data.matier).exec();
        if(matierinfo){
            newdata.classx = matierinfo.classx;
        }
        newdata.matier = data.matier;

        newdata.datex = data.datex;
        newdata.time = data.time;
        newdata.teacher = userid;
        newdata.text = data.text;
        await newdata.save();
        return Response.ok(res);
    },


    teachersavegrades: async function (req, res) {
        console.log("teachersavegrades ....");
        let userid = req.userid;
        const data = req.body;
        let newdata = new Grade();
        newdata.student = data.student;
        newdata.matier = data.matier;
        newdata.score = data.score;
        let matierinfo = await Matier.findById(data.matier).exec();
        if(matierinfo){
            newdata.classx = matierinfo.classx;
        }
        newdata.teacher = userid;
        newdata.note = data.note;
        newdata.datex = data.datex;
        newdata.time = data.time;
        await newdata.save();
        return Response.ok(res);
    },


    teacherratestudent: async function (req, res) {
        console.log("teachersavegrades ....");
        let userid = req.userid;
        const data = req.body;
        let newdata = new Rate();
        newdata.student = data.student;
        newdata.score = data.score;
        newdata.teacher = userid;
        newdata.note = data.note;
        await newdata.save();
        return Response.ok(res);
    },

    teachersaveattendacne: async function (req, res) {
        console.log("teachersaveattendacne ....");
        let userid = req.userid;
        const data = req.body;
        let matierinfo = await Attendance.findOne({student:data.student,time:data.time,datex:data.datex,attendancetype:data.attendancetype}).exec();
        if(matierinfo){
            return Response.notOk(res,"البيانات محفوظة مسبقاً");
        }
        let newdata = new Attendance();
        newdata.student = data.student;
        newdata.teacher = userid;
        newdata.note = data.note;
        newdata.time = data.time;
        newdata.datex = data.datex;
        newdata.attendancetype = data.attendancetype;
        await newdata.save();
        return Response.ok(res);
    },

    listteachermymatier:async function (req, res) {
        let userid = req.userid;
        console.log("userid",userid)
        let data = await TeacherMatier.find({teacher:userid}).populate("matier classx").sort({ "$natural": -1 }).lean({virtuals:true}).exec();
        return Response.ok(res,data);
    },

    listmystudentbyclass:async function (req, res) {
        let userid = req.userid;
        console.log("userid",userid)

        let classid = await Parent.GrabStudentIDs(userid);
        let data = await Student.find({ _id: { $in: classid } }).populate("parent classx").sort({ "fname": 1 }).lean({virtuals:true}).exec();
        return Response.ok(res,data);
    },


    liststudentbyclass:async function (req, res) {
        let userid = req.userid;
        const id = req.params.classid;
        console.log("userid",userid,id)
        Log.Track("Student see classes","",userid,"")
        let classid = []
        let classinfo = await Classx.findById(id).lean({virtuals:true}).exec();
        if(classinfo){
            classinfo = await Classx.find({name:classinfo.name,section:classinfo.section}).lean({virtuals:true}).exec();
            classinfo.map(x=>{
                classid.push(x.id)
            })
        }
        let data = await Student.find({ classx: { $in: classid } }).populate("parent classx").sort({ "fname": 1 }).lean({virtuals:true}).exec();
        return Response.ok(res,data);
    },


    listmatierbyclass:async function (req, res) {
        let userid = req.userid;
        const id = req.params.classid;


        let type =req.type;
        console.log("userid",userid,type)

        let dataall = await TeacherMatier.find({classx:id,teacher:userid}).sort({ "$natural": -1 }).lean({virtuals:true}).exec();

        let dataid = []
        dataall.map(x=>{
            dataid.push(x.matier)
        })

        console.log("data",dataid)
        let data = await Matier.find({ _id: { $in: dataid } }).populate("classx").sort({ "$natural": -1 }).lean({virtuals:true}).exec();
        return Response.ok(res,data);
    },

    listteacherbymatier:async function (req, res) {
        let userid = req.userid;
        const id = req.params.matier;
        console.log("userid",userid)
        let data = await TeacherMatier.find({matier:id}).populate("teacher").sort({ "fname": 1 }).lean({virtuals:true}).exec();


        return Response.ok(res,data);
    },






    liststudentrating:async function (req, res) {
        let userid = req.userid;


        const studentid = req.params.studentid;
       // let studentids = await Parent.GrabStudentIDs(userid)
       // console.log("studentids",studentids)
        let data = await Rate.find({ student: studentid }).populate("student teacher").sort({ "$natural": -1 }).lean({virtuals:true}).exec();
        return Response.ok(res,data);
    },


    listnotification:async function (req, res) {
        let userid = req.userid;
        let type =req.type;
        console.log("userid",userid,type)
        let data = [];
        if(type=="teacher"){
            data = await Notification.find({ teacher:userid }).sort({ "$natural": -1 }).lean({virtuals:true}).exec();
        }else if(type=="parent"){
            data = await Notification.find({ parent:userid }).sort({ "$natural": -1 }).lean({virtuals:true}).exec();
        }else if(type=="student"){
             data = await Notification.find({ student:userid }).sort({ "$natural": -1 }).lean({virtuals:true}).exec();
        }else{
            data = await Notification.find({ student:userid }).sort({ "$natural": -1 }).lean({virtuals:true}).exec();

        }
        return Response.ok(res,data);
    },
    listclassx:async function (req, res) {
        let userid = req.userid;
        let type =req.type;
        console.log("userid",userid,type)

        let classid = []
        let teacherclass = await TeacherMatier.find({teacher:userid}).sort({ "$natural": -1 }).lean({virtuals:true}).exec();
        teacherclass.map(x=>{
            classid.push(x.classx)
        })

        console.log("classid",classid)

        let data = await Classx.find({ _id: { $in: classid } }).sort({ "$natural": -1 }).lean({virtuals:true}).exec();
        //console.log("data",data)
        return Response.ok(res,data);
    },

    listpayment:async function (req, res) {
        let userid = req.userid;
        let type =req.type;
        const studentid = req.params.studentid;
        console.log("userid",userid,type,studentid)


        let   data = [];
    if(studentid){
    data = await Fees.find({ student: studentid }).populate("student feestype").sort({ "$natural": -1 }).lean({virtuals:true}).exec();
}else{
        let studentids = await Parent.GrabStudentIDs(userid)
         data = await Fees.find({ student: { $in: studentids } }).populate("student feestype").sort({ "$natural": -1 }).lean({virtuals:true}).exec();
    }

    if(type=="student"){
        data = await Fees.find({ student: userid }).populate("student feestype").sort({ "$natural": -1 }).lean({virtuals:true}).exec();
    }



        return Response.ok(res,data);
    },

    listhealth:async function (req, res) {
        let userid = req.userid;
        let type =req.type;
        const studentid = req.params.studentid;
        console.log("userid",userid,type)
        Log.Track("Student see health","",studentid,"")
        let data = [];
        if(studentid){
             data = await Health.find({ student: studentid }).populate("student healthtype").sort({ "$natural": -1 }).lean({virtuals:true}).exec();
        }else{
            let studentids = await Parent.GrabStudentIDs(userid)
             data = await Health.find({ student: { $in: studentids } }).populate("student healthtype").sort({ "$natural": -1 }).lean({virtuals:true}).exec();
        }

        if(type=="student"){
            data = await Health.find({ student: userid }).populate("student healthtype").sort({ "$natural": -1 }).lean({virtuals:true}).exec();
        }

        return Response.ok(res,data);
    },




    showabout:async function (req, res) {

        let settingsinfo = await Settings.findOne().exec();
        let text = await Content.findById(settingsinfo.aboutid).exec();
        return Response.ok(res,{
            text:text.text,
        });
    },





    myprofile: async function (req, res) {
        let userid = req.userid;
        let lang = req.lang;
        // userid = "611212cbf930fc0dedcc1385";
        console.log("userid",userid)
        const id = req.params.id;
        let userinfo = await User.findById(id).sort({ "$natural": -1 }).lean({virtuals:true}).exec();

        let continuereading = await StoryReading.getContinueReading(userid)

        for(let j = 0; j < continuereading.length; j++) {
            continuereading[j] =  Story.Translate(continuereading[j],lang)
        }
        userinfo.following = await UserFollower.countDocuments({user:id}).exec();
        userinfo.stories = continuereading.length;
        userinfo.followers =  await UserFollower.countDocuments({follow:id}).exec();

        const followerfound = await UserFollower.findOne({follow:id,user:userid}).exec();
        userinfo.isfollowing = false;
        if(followerfound){
            userinfo.isfollowing = true;
        }

        return Response.ok(res,{
            continuereading:continuereading,
            savedstories:continuereading,
            userinfo:userinfo
        });
    },

    readstory: async function (req, res) {
        let userid = req.userid;
        const id = req.params.id;
        let currentreading = await StoryReading.findOne({user:userid,story:id}).sort({ "$natural": -1 }).limit(1).lean({virtuals:true}).exec();
        let allstory = await StoryMessage.find({story:id}).populate("storyuser").sort({ "$natural": 1 }).lean({virtuals:true}).exec();

       // console.log(currentreading.length)
        console.log(currentreading)


        return Response.ok(res,{
            allstory:allstory,
            currentreading:[currentreading]
        });
    },

    listcomment:async function (req, res) {
        const id = req.params.id;
        let userid = req.userid;
        const items = await StoryComment.find({story:id}).populate("user").sort({ "$natural": -1 }).exec();
        return Response.ok(res,
            items
        );
    },

    listfollowing: async function (req, res) {
        //  let userid = req.userid;
        const userid = req.params.userid
        let followerlist = await UserFollower.find({user:userid}).populate("follow").sort({ "$natural": -1 }).lean({virtuals:true}).exec();

        console.log("followerlist",followerlist)

        let data = []
        // remove blocked user
        let ihaveblocked = await UserBlock.find({'user': userid}).lean({virtuals:true}).exec();
        let whoblockedme = await UserBlock.find({'block': userid}).lean({virtuals:true}).exec();
        for (let i = 0; i < followerlist.length; i++) {
            if(!followerlist[i].follow){
                console.log("removed");
                continue;
            }
            let ihaveblockedthisuser = ihaveblocked.find(j=>j.block==followerlist[i].follow.id);
            if(ihaveblockedthisuser){
                continue;
            }

            let someoneblockme = whoblockedme.find(j=>j.user==followerlist[i].follow.id);
            if(someoneblockme){
                continue;
            }
            data.push(followerlist[i].follow);
        }

        // show only user i follow
        return Response.ok(res,data);
    },



    userfollowmanage: async function (req, res) {
        const follow = req.params.id
        let userid = req.userid;
        await UserFollower.userfollowunfollow(follow,userid);
        return Response.ok(res);
    },

    usertogglebookmark: async function (req, res) {
        const story = req.params.id
        let userid = req.userid;
        await StoryBookMark.togglebook(story,userid);
        return Response.ok(res);
    },
    listfollower: async function (req, res) {
        // let userid = req.userid;
        const userid = req.params.userid
        let followerlist = await UserFollower.find({follow:userid}).populate("user").sort({ "$natural": -1 }).lean({virtuals:true}).exec();
        let data = []
       // console.log("followerlist",followerlist)
        // remove blocked user
        let ihaveblocked = await UserBlock.find({'user': userid}).lean({virtuals:true}).exec();
        let whoblockedme = await UserBlock.find({'block': userid}).lean({virtuals:true}).exec();
        for (let i = 0; i < followerlist.length; i++) {
            if(!followerlist[i].user){
                console.log("removed");
                continue;
            }
            let ihaveblockedthisuser = ihaveblocked.find(j=>j.block==followerlist[i].user.id);
            if(ihaveblockedthisuser){
                continue;
            }

            let someoneblockme = whoblockedme.find(j=>j.user==followerlist[i].user.id);
            if(someoneblockme){
                continue;
            }
            data.push(followerlist[i].user);
        }


        console.log(data)
        // show only user i follow
        return Response.ok(res,data);
    },

    chatwith:async function (req, res) {
        const id = req.params.id; // chat with
        let userid = req.userid;

        // test if room
        let roominfo = await Room.findById(id).populate("users admins").lean({virtuals:true}).exec();

        if(!roominfo){
            roominfo = await Chathelpers.saveRoom(userid,id)
        }
        await Chathelpers.prepareRoomMessage(roominfo,userid)
        return Response.ok(res,
            [roominfo]
        );
    },

    listrooms:async function (req, res) {
        console.log("listrooms...")
        let userid = req.userid;
        let items = await Room.find({ users: { $in: userid } }).populate("users").sort({ $natural: 1 }).lean({virtuals:true}).exec();

        for (let i = 0, len = items.length; i < len; i++) {
            // if is blocked do not chor plz
            // add block logic here plz
            await Chathelpers.prepareRoomMessage(items[i],userid)
        }
        //console.log(items)

        return Response.ok(res,items);
    },
    marklastread: async function (req, res) {
        let userid = req.userid;
        const story = req.params.story;
        const id = req.params.id;

        let data = await StoryReading.findOne({user:userid,story:story,storymessage:id}).exec();
        if(!data){
            data = new StoryReading();
            data.user = userid;
            data.story=story;
        }
        let msginfo = await StoryMessage.findById(id).exec();
        if(msginfo){
            data.storymessage = id;
            await data.save();
        }
        return Response.ok(res);
    },

    searchstory:async function (req, res) {
        const lang = req.lang;
        const key = req.params.key
        let data = await Story.findData(key);
        for(let j = 0; j < data.length; j++) {
            data[j] =  Story.Translate(data[j],lang)
        }
        let datacat = await StoryCategory.findData(key);
        for(let j = 0; j < datacat.length; j++) {
            datacat[j] =  StoryCategory.Translate(datacat[j],lang)
        }
        let datauser = await User.findData(key);
        return Response.ok(res, {newstories:data,categories:datacat,userlist:datauser});
    },
    myviewedstories: async function (req, res) {
        let userid = req.userid;
        let lang = req.lang;
        // userid = "611212cbf930fc0dedcc1385";

        console.log("userid",userid)

        let data = await StoryReading.getContinueReading(userid)
        for(let j = 0; j < data.length; j++) {
            data[j] =  Story.Translate(data[j],lang)
        }
        return Response.ok(res,data);
    },

    showterms:async function (req, res) {

        let settingsinfo = await Settings.findOne().exec();
        let text = await Content.findById(settingsinfo.termsid).exec();
        return Response.ok(res,{
            text:text.text,
        });
    },

    savecontact: async function (req, res) {
        const data = req.body;
        //console.log("savecontact ....");
        let newdata = new Contact();

        newdata.name = data.name;
        newdata.email = data.email;
        newdata.message = data.message;
        await newdata.save();






        return Response.ok(res);
    },


    saveaddress: async function (req, res) {
        let userid = req.userid;
        const data = req.body;
        const savex = data.savex;
        let cityfound = await City.findOneCity(data.city);


        if(!cityfound){
            return Response.notOk(res,"City not allowed");
        }

        let addresscondition = {title:data.title,address1:data.address1}
        if(userid){
            addresscondition = {title:data.title,address1:data.address1,user:userid}
        }

        let addressfound = await Address.findOne(addresscondition).exec();
        if(addressfound){
            return Response.ok(res);
        }

        let newdata = new Address();
        newdata.title = data.title;
        newdata.address1 = data.address1;
        if(savex=="false" && newdata.title<2){
            newdata.title = data.address1;
        }
        newdata.lat = data.lat;
        newdata.long = data.long;
        newdata.city = data.city;
        newdata.savex = (savex=="true");
        if(userid){
            newdata.user = userid;
            await newdata.save();
        }
        return Response.ok(res);
    },

    saverating: async function (req, res) {
        let userid = req.userid;
        const data = req.body;

        let rateinfo = await Rate.findOne({user:userid}).exec();

        if(rateinfo){
            return Response.notOk(res,"Already Rated!");
        }

        rateinfo = new Rate();
        rateinfo.countofstars = data.countofstars;
        rateinfo.comments = data.comments;
        rateinfo.user = userid;

        await rateinfo.save();
        return Response.ok(res);
    },


    userlangchange: async function (req, res) {
        let userid = req.userid;
        const data = req.body;
        let userinfo = await User.findById(userid).exec();
        if(userinfo){
            userinfo.lang = data.lang;
            await userinfo.save();
        }
        return Response.ok(res);
    },









};

