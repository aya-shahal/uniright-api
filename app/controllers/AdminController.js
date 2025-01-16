let _ = require('lodash');
const findNearestLocation = require('map-nearest-location');
let Security = require("../helpers/Security");

const moment = require("moment")
let { Parser } = require('json2csv')
let ImageManager = require("../helpers/ImageManager");
let FileParser = require("../helpers/FileParser");

let UserHelper = require("../helpers/UserHelper");
let Utils = require("../helpers/Utils")
let Response = require("../helpers/Response")


module.exports = {

    /**
     * Show homepage
     * @param req
     * @param res
     */

    managerlogin: async function (req, res) {
        let data =  req.body;

        let username =  data.username;
        let password =  data.password;

        const response = await Manager.findOne({username: username,password:password}).populate('managertype').exec()

        if(response && response.username){
            response.lastlogin = Date.now();
            await response.save();
            const managertype = response.managertype ?response.managertype.name:"admin"
            return res.ok({
                managertype: managertype,
                id:response._id,
                token: await Security.generateToken(response._id, response.full_name, 1,managertype,true),
            });

        }else{
            return res.forbidden("user not found");
        }

    },

    listmanagertype:async function (req, res) {
        const items = await ManagerType.find().sort({ "$natural": -1 }).exec();
        return res.ok(
            items
        );
    },

    listmanager:async function (req, res) {
        const items = await Manager.find().populate('managertype').sort({ "$natural": -1 }).exec();
        return Response.ok(res,
            items
        );
    },

    adminliststory:async function (req, res) {
        const items = await Story.find().populate("storycategory").sort({ "$natural": -1 }).exec();
        return Response.ok(res,
            items
        );
    },



    adminliststorymessage:async function (req, res) {
        const id = req.params.id;
        const items = await StoryMessage.find({story:id}).populate("story").sort({ "$natural": -1 }).exec();
        return Response.ok(res,
            items
        );
    },
    adminlistsotrycomment:async function (req, res) {
        const items = await StoryComment.find().sort({ "$natural": -1 }).exec();
        return Response.ok(res,
            items
        );
    },

    adminlistsotryreading:async function (req, res) {
        const items = await StoryComment.find().populate("user").sort({ "$natural": -1 }).exec();
        return Response.ok(res,
            items
        );
    },

    adminlistpaymenttype:async function (req, res) {
        const items = await PaymentType.find().sort({ "$natural": -1 }).exec();
        return Response.ok(res,
            items
        );
    },

    adminlistnews:async function (req, res) {
        const items = await News.find().populate("classx").lean({virtuals:true}).sort({ "$natural": -1 }).exec();
        return Response.ok(res,
            items
        );
    },

    adminlistclassx:async function (req, res) {
        const items = await Classx.find().sort({ "$natural": -1 }).exec();
        return Response.ok(res,
            items
        );
    },

    adminlistmatier:async function (req, res) {
        const items = await Matier.find().populate("classx").sort({ "$natural": -1 }).exec();
        return Response.ok(res,
            items
        );
    },

    adminlistmanagertpye:async function (req, res) {
        const items = await ManagerType.find().sort({ "$natural": -1 }).exec();
        return Response.ok(res,
            items
        );
    },
    adminlistnotiication:async function (req, res) {
        const items = await Notification.find().populate("student teacher parent").sort({ "$natural": -1 }).exec();
        return Response.ok(res,
            items
        );
    },

    adminlistteachermatier:async function (req, res) {
        const items = await TeacherMatier.find().populate("teacher matier classx").sort({ "$natural": -1 }).exec();
       //console.log(items)
        return Response.ok(res,
            items
        );
    },

    adminlistattendance:async function (req, res) {
        const items = await Attendance.find().populate("student classx").sort({ "$natural": -1 }).exec();
        return Response.ok(res,
            items
        );
    },

    adminlistnurse:async function (req, res) {
        const items = await Nurse.find().populate("student").sort({ "$natural": -1 }).exec();
        return Response.ok(res,
            items
        );
    },

    adminlistpayment:async function (req, res) {
        const items = await Payment.find().populate("student").sort({ "$natural": -1 }).exec();
        return Response.ok(res,
            items
        );
    },

    adminlistexam:async function (req, res) {
        const items = await Exam.find().populate("matier").sort({ "$natural": -1 }).exec();
        return Response.ok(res,
            items
        );
    },


    adminlistgrade:async function (req, res) {
        const items = await Grade.find().populate("student matier").sort({ "$natural": -1 }).exec();
        return Response.ok(res,
            items
        );
    },
    adminlistcalendar:async function (req, res) {
        const items = await Calendar.find().sort({ "$natural": -1 }).exec();
        return Response.ok(res,
            items
        );
    },
    adminlistagenda:async function (req, res) {
        const items = await Agenda.find().populate("classx teacher matier").sort({ "$natural": -1 }).exec();
        return Response.ok(res,
            items
        );
    },

    adminlistparent:async function (req, res) {
        const items = await Parent.find().sort({ "$natural": -1 }).exec();
        return Response.ok(res,
            items
        );
    },

    adminliststudent: async function (req, res) {
        try {
            const items = await Student.find().populate({
                path: "major",
                select: "name" 
            }).sort({ "$natural": -1 }).exec();
            return Response.ok(res, items);
        } catch (error) {
            return Response.error(res, error.message);
        }
    },
    

    adminlistteacher:async function (req, res) {
        const items = await Teacher.find().sort({ "$natural": -1 }).exec();
        return Response.ok(res,
            items
        );
    },

  ratingexport:async function (req, res) {


        let items = await Rate.find().populate("user").sort({ "$natural": -1 }).exec();

        let neededdata = [];
        for(let i = 0 ;i<items.length;i++){


            neededdata.push({
                countofstars:items[i].countofstars,
                comment:items[i].comments,
                phone:items[i].user && items[i].user.phone,
                created_at:Utils.renderDate(items[i].createdAt),
            })
        }

        const json2csv = new Parser({
            withBOM: true,
        })
        try {
            const csv = json2csv.parse(neededdata)
            res.attachment('cartrequestexport.csv')
            return   res.status(200).send(csv)
        } catch (error) {
            console.log('error:', error.message)
            return res.status(500).send(error.message)
        }
    },

    nearbylocation:async function (req, res) {


        const longitude = parseFloat(req.params.latitude);
        const latitude = parseFloat(req.params.longitude);

        //Log.AddLog("nearbylocation",longitude+" "+latitude,null)
       /* for(let i = 0 ;i<alllocations.length;i++){
            let xx= new Location()
            xx.name = alllocations[i].branchname
            let xa = alllocations[i].locatiions.split(",")
            if(xa.length<1){
                continue;
            }
            xx.location= {
                type: "Point",
                coordinates: [parseFloat(xa[0]),parseFloat(xa[1])]
            };
          // await xx.save();
        }*/

      /*

*/




        let data2 = await Location.find({
            location: {
                $near: {
                    $maxDistance: 500000000000,
                    $geometry: {
                        type: "Point",
                        coordinates: [latitude, longitude]
                    }
                },
            }
        }).lean({virtuals:true}).exec();

        for(let i = 0 ;i<data2.length;i++){

            const myLocation = {
                lat: data2[i].location.coordinates[0],
                lng: data2[i].location.coordinates[1]
            };

            const locations = [
                {
                    lat: latitude,
                    lng: longitude,
                },
            ];

            const data = findNearestLocation(myLocation, locations);

            const km =  data.distance/ 1000;
            data2[i].distance  =km.toFixed(1) + " km"
            data2[i].locations  =data2[i].location.coordinates[0]+","+data2[i].location.coordinates[1]

        }
        return Response.ok(res,data2);
    },

    adminlistcontent:async function (req, res) {
        const items = await Content.find().sort({ "$natural": -1 }).exec();
        return Response.ok(res,
            items
        );
    },

    adminlistreview:async function (req, res) {
        const items = await Reviews.find().sort({ "$natural": -1 }).lean({virtuals:true}).exec();
        return Response.ok(res,
            items
        );
    },


    adminlistguide:async function (req, res) {
        const items = await Guided.find().sort({ "$natural": -1 }).exec();
        return Response.ok(res,
            items
        );
    },
    adminlistthread:async function (req, res) {
        const items = await Thread.find().sort({ "$natural": -1 }).exec();
        return Response.ok(res,
            items
        );
    },


    storymessageAddorUpdate: async function (req, res) {
        const data = req.body;
        let newdata = new StoryMessage();
        if (data._id && data._id.length >1) {
            newdata = await StoryMessage.findById(data._id).exec()
        }
        newdata.msgtype = data.msgtype;
        newdata.story = data.story;
        newdata.text = data.text;
        newdata.textar = data.textar;
        newdata.fromto = data.fromto;
        if(data.storyuser){
            newdata.storyuser = data.storyuser;
        }


        if(data.sidepicture && data.sidepicture.includes("base")){
            newdata.file = await ImageManager.uploadimagebase64row(data.sidepicture);
        }
        await newdata.save();

        return Response.ok(res);
    },
    storyAddorUpdate: async function (req, res) {
        const data = req.body;
        let newdata = new Story();
        if (data._id && data._id.length >1) {
            newdata = await Story.findById(data._id).exec()
        }
        newdata.name = data.name;
        newdata.namear = data.namear;
        newdata.featured = data.featured;
        newdata.time = data.time;
        newdata.storycategory = data.storycategory;
        newdata.description = data.description;
        newdata.descriptionar = data.descriptionar;
        newdata.viewcount = data.viewcount;
        if(data.sidepicture && data.sidepicture.includes("image")){
            newdata.picture = await ImageManager.uploadimagebase64row(data.sidepicture);
        }
        await newdata.save();

        return Response.ok(res);
    },

    countryAddorUpdate: async function (req, res) {
        const data = req.body;
        let newdata = new Country();
        if (data._id && data._id.length >1) {
            newdata = await Country.findById(data._id).exec()
        }
        newdata.name = data.name;
        newdata.dialcode = data.dialcode;
        await newdata.save();

        return Response.ok(res);
    },

    paymenttypeAddorUpdate: async function (req, res) {
        const data = req.body;
        let newdata = new PaymentType();
        if (data._id && data._id.length >1) {
            newdata = await PaymentType.findById(data._id).exec()
        }
        newdata.name = data.name;
        await newdata.save();

        return Response.ok(res);
    },

    outletsAddorUpdate: async function (req, res) {
        const data = req.body;
        let newdata = new Location();
        if (data._id && data._id.length >1) {
            newdata = await Location.findById(data._id).exec()
        }


        newdata.name = data.name;
        newdata.location = {
            type:"Point",
            coordinates:[parseFloat(data.lat),parseFloat(data.lot)]
        }
        await newdata.save();

        return Response.ok(res);
    },

    timeslotsAddorUpdate: async function (req, res) {
        const data = req.body;
        let newdata = new TimeSlots();
        if (data._id && data._id.length >1) {
            newdata = await TimeSlots.findById(data._id).exec()
        }
        newdata.name = data.name;
        await newdata.save();

        return Response.ok(res);
    },



    dayAddorUpdate: async function (req, res) {
        const data = req.body;
        let newdata = new Day();
        if (data._id && data._id.length >1) {
            newdata = await Day.findById(data._id).exec()
        }
        newdata.name = data.name;
        newdata.timeslots = data.timeslots;
        newdata.city = data.city;
        await newdata.save();

        return Response.ok(res);
    },

    newsAddorUpdate: async function (req, res) {
        const data = req.body;
        let newdata = new News();
        if (data._id && data._id.length >1) {
            newdata = await News.findById(data._id).exec()
        }
        if(data.sidepicture && data.sidepicture.includes("image")){
            newdata.picture = await ImageManager.uploadimagebase64row(data.sidepicture);
        }
        newdata.name = data.name;
        newdata.text = data.text;
        newdata.namekr = data.namekr;
        newdata.textkr = data.textkr;
        newdata.type = data.type;
        if(data.classx){
            newdata.classx = data.classx;
        }


        await newdata.save();

        return Response.ok(res);
    },

    classxAddorUpdate: async function (req, res) {
        const data = req.body;
        let newdata = new Classx();
        if (data._id && data._id.length >1) {
            newdata = await Classx.findById(data._id).exec()
        }

        newdata.name = data.name;
        newdata.namekr = data.namekr;

        newdata.section = data.section;
        newdata.section = data.section;
        newdata.lang = data.lang;

        await newdata.save();

        return Response.ok(res);
    },

   managertypeAddorUpdate: async function (req, res) {
        const data = req.body;
        let newdata = new ManagerType();
        if (data._id && data._id.length >1) {
            newdata = await ManagerType.findById(data._id).exec()
        }

        newdata.name = data.name;

        await newdata.save();

        return Response.ok(res);
    },

    notificationAddorUpdate: async function (req, res) {
        const data = req.body;
        console.log("data",data)
        let newdata = new Notification();
        if (data._id && data._id.length >1) {
            newdata = await Notification.findById(data._id).exec()
        }

        newdata.msg = data.msg;
        newdata.msgkr = data.msgkr;

        if(data.teacher!=""){
            newdata.teacher = data.teacher;
            let teacherinfo = await Teacher.findById(data.teacher).exec()
            if(teacherinfo){
                PushNotification.globalsend(teacherinfo.push.token,"Right Track School Solution",data.msg)
            }

        }

        if(data.student!=""){
            newdata.student = data.student;
            let teacherinfo = await Student.findById(data.student).exec()
            if(teacherinfo){
                PushNotification.globalsend(teacherinfo.push.token,"Right Track School Solution",data.msg)

            }
        }
        if(data.parent!=""){
            newdata.parent = data.parent;
            let teacherinfo = await Parent.findById(data.parent).exec()
            if(teacherinfo){
                PushNotification.globalsend(teacherinfo.push.token,"Right Track School Solution",data.msg)

            }
        }


        await newdata.save();

        return Response.ok(res);
    },

    matierAddorUpdate: async function (req, res) {
        const data = req.body;
        let newdata = new Matier();
        if (data._id && data._id.length >1) {
            newdata = await Matier.findById(data._id).exec()
        }

        newdata.name = data.name;
        newdata.namekr = data.namekr;

        newdata.classx = data.classx;

        await newdata.save();

        return Response.ok(res);
    },

    teachermatierAddorUpdate: async function (req, res) {
        const data = req.body;
        let newdata = new TeacherMatier();
        if (data._id && data._id.length >1) {
            newdata = await TeacherMatier.findById(data._id).exec()
        }

        newdata.matier = data.matier;
        newdata.teacher = data.teacher;
        let matierinfo = await Matier.findById(data.matier).exec()
        if(matierinfo){
            newdata.classx    = matierinfo.classx;
        }


        await newdata.save();

        return Response.ok(res);
    },

    attendanceAddorUpdate: async function (req, res) {
        const data = req.body;
        let newdata = new Attendance();
        if (data._id && data._id.length >1) {
            newdata = await Attendance.findById(data._id).exec()
        }


        newdata.student = data.student;
        newdata.datex = data.datex;
        newdata.time = data.time;
        newdata.note = data.note;
        newdata.attendancetype = data.attendancetype;


        await newdata.save();

        return Response.ok(res);
    },

    nurseAddorUpdate: async function (req, res) {
        const data = req.body;
        let newdata = new Nurse();
        if (data._id && data._id.length >1) {
            newdata = await Nurse.findById(data._id).exec()
        }

        newdata.medcine = data.medcine;
        newdata.info = data.info;
        newdata.student = data.student;

        await newdata.save();

        return Response.ok(res);
    },

    paymentAddorUpdate: async function (req, res) {
        const data = req.body;
        let newdata = new Payment();
        if (data._id && data._id.length >1) {
            newdata = await Payment.findById(data._id).exec()
        }

        newdata.amount = data.amount;
        newdata.paymentttpe = data.paymentttpe;
        newdata.student = data.student;

        await newdata.save();

        return Response.ok(res);
    },

    examAddorUpdate: async function (req, res) {
        const data = req.body;
        let newdata = new Exam();
        if (data._id && data._id.length >1) {
            newdata = await Exam.findById(data._id).exec()
        }

        newdata.matier = data.matier;
        let matierinfo = await Matier.findById(data.matier).exec();
        if(matierinfo){
            newdata.classx = matierinfo.classx;
        }
        newdata.datex = data.datex;
        newdata.time = data.time;

        await newdata.save();

        return Response.ok(res);
    },

    gradeAddorUpdate: async function (req, res) {
        const data = req.body;
        let newdata = new Grade();
        if (data._id && data._id.length >1) {
            newdata = await Grade.findById(data._id).exec()
        }

        newdata.year = data.year;

        newdata.student = data.student;


        if(data.picture.includes("application") || data.picture.includes("pdf")){
            const picture = await ImageManager.uploadimagebase64row(data.picture);
            newdata.picture = picture;
        }
        newdata.datex = data.datex;
        newdata.time = data.time;

        await newdata.save();

        return Response.ok(res);
    },

    calendarAddorUpdate: async function (req, res) {
        const data = req.body;
        let newdata = new Calendar();
        if (data._id && data._id.length >1) {
            newdata = await Calendar.findById(data._id).exec()
        }

        newdata.event = data.event;
        newdata.eventkr = data.eventkr;
        newdata.datex = data.datex;


        await newdata.save();

        return Response.ok(res);
    },

    agendaAddorUpdate: async function (req, res) {
        const data = req.body;
        let newdata = new Agenda();
        if (data._id && data._id.length >1) {
            newdata = await Agenda.findById(data._id).exec()
        }


        newdata.datex = data.datex;
        newdata.time = data.time;

        let matierinfo = await Matier.findById(data.matier).exec();
        if(matierinfo){
            newdata.classx = matierinfo.classx;
        }
        newdata.matier = data.matier;


        newdata.textkr = data.textkr;
        newdata.text = data.text;
        newdata.teacher = data.teacher;


        await newdata.save();

        return Response.ok(res);
    },

    parentAddorUpdate: async function (req, res) {
        const data = req.body;
        let newdata = new Parent();
        if (data._id && data._id.length >1) {
            newdata = await Parent.findById(data._id).exec()
        }

        newdata.fathername = data.fathername;
        newdata.fatherfamily = data.fatherfamily;
        newdata.mothername = data.mothername;
        newdata.motherfamily = data.motherfamily;


        newdata.fathernamekr = data.fathernamekr;
        newdata.fatherfamilykr = data.fatherfamilykr;
        newdata.mothernamekr = data.mothernamekr;
        newdata.motherfamilykr = data.motherfamilykr;


        newdata.fatherphone = data.fatherphone;
        newdata.motherphone = data.motherphone;
        newdata.email = data.email;
        newdata.username = data.username;
        newdata.password = data.password;


        await newdata.save();

        return Response.ok(res);
    },

    studentAddorUpdate: async function (req, res) {
        const data = req.body;
        let newdata = new Student();
        if (data._id && data._id.length >1) {
            newdata = await Student.findById(data._id).exec()
        }

        newdata.fname = data.fname;
        newdata.lname = data.lname;
        newdata.sex = data.sex;
        newdata.lang = data.lang;
        newdata.address = data.address;
        newdata.nationality = data.nationality;
        newdata.registrationrecord = data.registrationrecord;
        newdata.birthlocation = data.birthlocation;
        newdata.dateofbirth = data.dateofbirth;
        newdata.studentphone = data.studentphone;
        newdata.blood = data.blood;
        newdata.registredat = data.registredat;
        newdata.email = data.email;
        newdata.major = data.certificate;
        newdata.note = data.note;
       // newdata.parent = data.parent;
        newdata.fnamekr = data.fnamekr;
        newdata.lnamekr = data.lnamekr;
        newdata.username = data.username;
        newdata.password = data.password;
        newdata.studentid = data.studentid;


        if(data.sidepicture && data.sidepicture.includes("image")){
            newdata.picture = await ImageManager.uploadimagebase64row(data.sidepicture);
        }

        await newdata.save();

        return Response.ok(res);
    },

    teacherAddorUpdate: async function (req, res) {
        const data = req.body;
        let newdata = new Teacher();
        if (data._id && data._id.length >1) {
            newdata = await Teacher.findById(data._id).exec()
        }

        newdata.fname = data.fname;
        newdata.lname = data.lname;


        newdata.fnamekr = data.fnamekr;
        newdata.lnamekr = data.lnamekr;

        newdata.sex = data.sex;
        newdata.lang = data.lang;
        newdata.nationality = data.nationality;
        newdata.dateofbirth = data.dateofbirth;
        newdata.phone = data.phone;
        newdata.email = data.email;
        newdata.username = data.username;
        newdata.password = data.password;

        if(data.sidepicture && data.sidepicture.includes("image")){
            newdata.picture = await ImageManager.uploadimagebase64row(data.sidepicture);
        }

        await newdata.save();

        return Response.ok(res);
    },


    adminstorydelete: function (req, res) {
        const id = req.params.id;
        Story.findById(id, async function (error, data) {
            if (error) return res.serverError(error);
            if (!data) return res.notFound();
            data.remove(function (error) {
                if (error) return res.serverError(error);
                return res.ok();
            });

        });
    },

    adminstorymessagedelete: function (req, res) {
        const id = req.params.id;
        StoryMessage.findById(id, async function (error, data) {
            if (error) return res.serverError(error);
            if (!data) return res.notFound();
            data.remove(function (error) {
                if (error) return res.serverError(error);
                return res.ok();
            });

        });
    },

    adminstorycommentdelete: function (req, res) {
        const id = req.params.id;
        StoryComment.findById(id, async function (error, data) {
            if (error) return res.serverError(error);
            if (!data) return res.notFound();
            data.remove(function (error) {
                if (error) return res.serverError(error);
                return res.ok();
            });

        });
    },

    adminstoryreadingcommentdelete: function (req, res) {
        const id = req.params.id;
        StoryReading.findById(id, async function (error, data) {
            if (error) return res.serverError(error);
            if (!data) return res.notFound();
            data.remove(function (error) {
                if (error) return res.serverError(error);
                return res.ok();
            });

        });
    },

    adminclassxdelete: function (req, res) {
        const id = req.params.id;
        Classx.findById(id, async function (error, data) {
            if (error) return res.serverError(error);
            if (!data) return res.notFound();
            data.remove(function (error) {
                if (error) return res.serverError(error);
                return res.ok();
            });

        });
    },

    adminmatierdelete: function (req, res) {
        const id = req.params.id;
        Matier.findById(id, async function (error, data) {
            if (error) return res.serverError(error);
            if (!data) return res.notFound();
            data.remove(function (error) {
                if (error) return res.serverError(error);
                return res.ok();
            });

        });
    },

    adminmanagertypedelete: function (req, res) {
        const id = req.params.id;
        ManagerType.findById(id, async function (error, data) {
            if (error) return res.serverError(error);
            if (!data) return res.notFound();
            data.remove(function (error) {
                if (error) return res.serverError(error);
                return res.ok();
            });

        });
    },

    adminnotificationdelete: function (req, res) {
        const id = req.params.id;
        Notification.findById(id, async function (error, data) {
            if (error) return res.serverError(error);
            if (!data) return res.notFound();
            data.remove(function (error) {
                if (error) return res.serverError(error);
                return res.ok();
            });

        });
    },

    adminteachermatierdelete: function (req, res) {
        const id = req.params.id;
        TeacherMatier.findById(id, async function (error, data) {
            if (error) return res.serverError(error);
            if (!data) return res.notFound();
            data.remove(function (error) {
                if (error) return res.serverError(error);
                return res.ok();
            });

        });
    },

    adminattendancedelete: function (req, res) {
        const id = req.params.id;
        Attendance.findById(id, async function (error, data) {
            if (error) return res.serverError(error);
            if (!data) return res.notFound();
            data.remove(function (error) {
                if (error) return res.serverError(error);
                return res.ok();
            });

        });
    },


    adminlistfees:async function (req, res) {
        let items = await Fees.find().populate("student feestype").sort({ "$natural": -1 }).exec();
        return Response.ok(res,
            items
        );
    },

    adminlistlogs:async function (req, res) {
        let items = await Log.find().populate("student teacher parent ").sort({ "$natural": -1 }).exec();
        return Response.ok(res,
            items
        );
    },

    adminlistaccount:async function (req, res) {
        let items = await Account.find().sort({ "$natural": -1 }).exec();

        console.log("items",items)
        return Response.ok(res,
            items
        );
    },

    adminlisthealth:async function (req, res) {
        let items = await Health.find().populate("student healthtype").sort({ "$natural": -1 }).exec();
        return Response.ok(res,
            items
        );
    },

    feestransferAddorUpdate: async function (req, res) {

        const data = await ImageManager.uploadimagebody(req,res)
        let newdata = new Fees();
        let isnew=true;
        if (data._id && data._id.length >1) {
            newdata = await Fees.findById(data._id).exec()
            isnew = false;
        }
        newdata.student = data.student;
        newdata.paymentamounttype = data.paymentamounttype;

        newdata.invoicedate = data.invoicedate;
        newdata.qty = data.qty;
        newdata.feestype = data.feestype;
        newdata.paid = data.paid
        newdata.note = data.note;
        newdata.amount = data.amount;
        newdata.paymenttype = data.paymenttype;
        if(data.picture){
            newdata.picture = data.picture;
        }

        if(isnew){
            let feestypeinfo = await FeesType.findById(data.feestype).exec()
            newdata.invoicenumber =  await Settings.grabinvoicenumber();

        }

        await newdata.save();

        return Response.ok(res);
    },


    formAddorUpdate: async function (req, res) {
        const data = req.body;
        let newdata = new Form();
        if (data._id && data._id.length >1) {
            newdata = await Form.findById(data._id).exec()
        }
        newdata.name = data.name;
        newdata.namekr = data.namekr;
        newdata.inputlist = data.inputlist;
        newdata.matier = data.matier;


        await newdata.save();
        return Response.ok(res);
    },

    adminformdelete: function (req, res) {

        const id = req.params.id;

        Form.findById(id, function (error, data) {
            if (error) return res.serverError(error);
            if (!data) return res.notFound();

            data.remove(function (error) {
                if (error) return res.serverError(error);
                return res.ok();
            });

        });
    },


    adminformresponsedelete: function (req, res) {

        const id = req.params.id;

        FromResponse.findById(id, function (error, data) {
            if (error) return res.serverError(error);
            if (!data) return res.notFound();

            data.remove(function (error) {
                if (error) return res.serverError(error);
                return res.ok();
            });

        });
    },

    adminlistformuestion:async function (req, res) {
        const items = await Form.find().populate("matier").sort({ "$natural": -1 }).exec();
        return Response.ok(res,
            items
        );
    },

    adminlistformuestionresponse:async function (req, res) {
        const items = await FromResponse.find().populate("student form").sort({ "$natural": -1 }).exec();
      // console.log("items",items)
        return Response.ok(res,
            items
        );
    },

    accountAddorUpdate: async function (req, res) {

        const data = await ImageManager.uploadimagebody(req,res)
        let newdata = new Account();
        let isnew=true;
        if (data._id && data._id.length >1) {
            newdata = await Account.findById(data._id).exec()
            isnew = false;
        }
        newdata.accountype = data.accountype;
        newdata.paymentamounttype = data.paymentamounttype;

        newdata.invoicedate = data.invoicedate;
        newdata.qty = data.qty;
        newdata.paid = data.paid
        newdata.note = data.note;
        newdata.amount = data.amount;
        newdata.paymenttype = data.paymenttype;
        if(data.picture){
            newdata.picture = data.picture;
        }

        if(isnew){

            newdata.invoicenumber =  await Settings.grabinvoicenumber();

        }

        await newdata.save();

        return Response.ok(res);
    },


    healthAddorUpdate: async function (req, res) {

        const data = await ImageManager.uploadimagebody(req,res)
        let newdata = new Health();
        let isnew=true;
        if (data._id && data._id.length >1) {
            newdata = await Health.findById(data._id).exec()

        }
        newdata.student = data.student;
        newdata.note = data.note;
        newdata.healthtype = data.healthtype;


        await newdata.save();

        return Response.ok(res);
    },

    feestypeAddorUpdate: async function (req, res) {
        const data = req.body;
        let newdata = new FeesType();
        if (data._id && data._id.length >1) {
            newdata = await FeesType.findById(data._id).exec()
        }
        newdata.title = data.title;
        newdata.titlekr = data.titlekr;
        newdata.amount = data.amount;
        newdata.classx = data.classx;
        await newdata.save();

        return Response.ok(res);
    },

    healthtyprAddorUpdate: async function (req, res) {
        const data = req.body;
        let newdata = new HealthType();
        if (data._id && data._id.length >1) {
            newdata = await HealthType.findById(data._id).exec()
        }
        newdata.title = data.title;
        newdata.titlekr = data.titlekr;

        await newdata.save();

        return Response.ok(res);
    },



    adminlistfeestype:async function (req, res) {
        const items = await FeesType.find().populate("classx").sort({ "$natural": -1 }).exec();
        return Response.ok(res,
            items
        );
    },

    adminlisthealthtype:async function (req, res) {
        const items = await HealthType.find().sort({ "$natural": -1 }).exec();
        return Response.ok(res,
            items
        );
    },

    adminnursedelete: function (req, res) {
        const id = req.params.id;
        Nurse.findById(id, async function (error, data) {
            if (error) return res.serverError(error);
            if (!data) return res.notFound();
            data.remove(function (error) {
                if (error) return res.serverError(error);
                return res.ok();
            });

        });
    },

    adminfeesdelete: function (req, res) {
        const id = req.params.id;
        Fees.findById(id, async function (error, data) {
            if (error) return res.serverError(error);
            if (!data) return res.notFound();
            data.remove(function (error) {
                if (error) return res.serverError(error);
                return res.ok();
            });

        });
    },


    adminaccountdelete: function (req, res) {
        const id = req.params.id;
        Account.findById(id, async function (error, data) {
            if (error) return res.serverError(error);
            if (!data) return res.notFound();
            data.remove(function (error) {
                if (error) return res.serverError(error);
                return res.ok();
            });

        });
    },

    adminhealthdelete: function (req, res) {
        const id = req.params.id;
        Health.findById(id, async function (error, data) {
            if (error) return res.serverError(error);
            if (!data) return res.notFound();
            data.remove(function (error) {
                if (error) return res.serverError(error);
                return res.ok();
            });

        });
    },

    adminfeestypedelete: function (req, res) {
        const id = req.params.id;
        FeesType.findById(id, async function (error, data) {
            if (error) return res.serverError(error);
            if (!data) return res.notFound();
            data.remove(function (error) {
                if (error) return res.serverError(error);
                return res.ok();
            });

        });
    },


    adminhealthtypedelete: function (req, res) {
        const id = req.params.id;
        HealthType.findById(id, async function (error, data) {
            if (error) return res.serverError(error);
            if (!data) return res.notFound();
            data.remove(function (error) {
                if (error) return res.serverError(error);
                return res.ok();
            });

        });
    },


    adminpaymentdelete: function (req, res) {
        const id = req.params.id;
        Payment.findById(id, async function (error, data) {
            if (error) return res.serverError(error);
            if (!data) return res.notFound();
            data.remove(function (error) {
                if (error) return res.serverError(error);
                return res.ok();
            });

        });
    },


    itemupload: async function (req, res) {
        console.log("itemupload ....");

        const data = await ImageManager.uploadimagebody(req,res)

        const type = data.type;
        if(data.picture){
            if(type=="students"){
                await FileParser.parsestudents(data.picture)
            }else if(type=="teacher"){
                await FileParser.parseteacher(data.picture)
            }else if(type=="teacherclass"){
                await FileParser.parseteacherclass(data.picture)
            }else if(type=="quiz"){
                await FileParser.parsequiz(data,data.picture)
            }

        }

        return Response.ok(res);
    },

    uploaditemquiz: async function (req, res) {
        console.log("uploaditemquiz ....");

        const data = await ImageManager.uploadimagebody(req,res)

        if(data.picture){
                await FileParser.parsequiz(data,data.picture)
        }

        return Response.ok(res);
    },
    adminexamdelete: function (req, res) {
        const id = req.params.id;
        Exam.findById(id, async function (error, data) {
            if (error) return res.serverError(error);
            if (!data) return res.notFound();
            data.remove(function (error) {
                if (error) return res.serverError(error);
                return res.ok();
            });

        });
    },

    admingradedelete: function (req, res) {
        const id = req.params.id;
        Grade.findById(id, async function (error, data) {
            if (error) return res.serverError(error);
            if (!data) return res.notFound();
            data.remove(function (error) {
                if (error) return res.serverError(error);
                return res.ok();
            });

        });
    },

    admincalendardelete: function (req, res) {
        const id = req.params.id;
        Calendar.findById(id, async function (error, data) {
            if (error) return res.serverError(error);
            if (!data) return res.notFound();
            data.remove(function (error) {
                if (error) return res.serverError(error);
                return res.ok();
            });

        });
    },
    adminagendadelete: function (req, res) {
        const id = req.params.id;
        Agenda.findById(id, async function (error, data) {
            if (error) return res.serverError(error);
            if (!data) return res.notFound();
            data.remove(function (error) {
                if (error) return res.serverError(error);
                return res.ok();
            });

        });
    },

    adminparentxdelete: function (req, res) {
        const id = req.params.id;
        Parent.findById(id, async function (error, data) {
            if (error) return res.serverError(error);
            if (!data) return res.notFound();
            data.remove(function (error) {
                if (error) return res.serverError(error);
                return res.ok();
            });

        });
    },

    adminstudentxdelete: function (req, res) {
        const id = req.params.id;
        Student.findById(id, async function (error, data) {
            if (error) return res.serverError(error);
            if (!data) return res.notFound();
            data.remove(function (error) {
                if (error) return res.serverError(error);
                return res.ok();
            });

        });
    },


    bannerAddorUpdate: async function (req, res) {
        console.log("bannerAddorUpdate ....");
        const data = req.body;
        let newdata = new Banner();
        if (data._id.length >1) {
            newdata = await Banner.findById(data._id).exec()
        }
        newdata.name = data.name;
        newdata.link = data.link;
        newdata.subtitle = data.subtitle;
        newdata.orderx = data.orderx;
        newdata.status = data.status.toString()=="false"?0:1;


        newdata.namear = data.namear;
        newdata.subtitlear = data.subtitlear;

        newdata.formobile = data.formobile;

        if(data.picture.includes("image")){
            const picture = await ImageManager.uploadimagebase64row(data.picture);
            newdata.picture = picture;
        }
        if(data.picturear.includes("image")){
            const picturear = await ImageManager.uploadimagebase64row(data.picturear);
            newdata.picturear = picturear;
        }





        await newdata.save();
        return Response.ok(res);
    },


    bookAddorUpdate: async function (req, res) {
        console.log("bookAddorUpdate ....");
        const data = req.body;
        let newdata = new Book();
        if (data._id.length >1) {
            newdata = await Book.findById(data._id).exec()
        }
        newdata.name = data.name;
        newdata.description = data.description;




        if(data.picture.includes("image")){
            const picture = await ImageManager.uploadimagebase64row(data.picture);
            newdata.picture = picture;
        }

        if(data.book.includes("pdf")){
            const book = await ImageManager.uploadimagebase64row(data.book,"pdf");
            newdata.book = book;
        }



        await newdata.save();
        return Response.ok(res);
    },

    certificateAddorUpdate: async function (req, res) {

        const data = req.body;
        console.log("certificateAddorUpdate ....",data);
        let newdata = new Certificate();
        if (data._id.length >1) {
            newdata = await Certificate.findById(data._id).exec()
        }
        newdata.name = data.name;
        newdata.department = data.department;
        newdata.credits = data.credits;


        if(data.picture.includes("application") || data.picture.includes("pdf")){
            const picture = await ImageManager.uploadimagebase64row(data.picture);
            newdata.picture = picture;
        }

        if(data.picture2.includes("application") || data.picture2.includes("pdf")){
            const picture = await ImageManager.uploadimagebase64row(data.picture2);
            newdata.picture2 = picture;
        }
        await newdata.save();
        return Response.ok(res);
    },


    scheduleAddorUpdate: async function (req, res) {
        console.log("scheduleAddorUpdate ....");
        const data = req.body;
        let newdata = new Schedule();
        if (data._id.length >1) {
            newdata = await Schedule.findById(data._id).exec()
        }
        newdata.classx = data.classx;
        newdata.teachermatier = data.teachermatier;
        newdata.section = data.section;
        newdata.day = data.day;
        newdata.fromtime = data.fromtime;
        newdata.totime = data.totime;

        await newdata.save();
        return Response.ok(res);
    },


   studentclassProgressAddorUpdate: async function (req, res) {
        console.log("studentclassProgressAddorUpdate ....");
        const data = req.body;
        let newdata = new StudentClassProgress();
        if (data._id.length >1) {
            newdata = await StudentClassProgress.findById(data._id).exec()
        }
        newdata.student = data.student;
        newdata.classx = data.classx;
       newdata.year = data.year;
        await newdata.save();
        return Response.ok(res);
    },


    schoolAddorUpdate: async function (req, res) {
        console.log("schoolAddorUpdate ....");
        const data = req.body;
        let newdata = new University();
        if (data._id.length >1) {
            newdata = await University.findById(data._id).exec()
        }
        newdata.name = data.name;
        newdata.namekr = data.namekr;
        newdata.address = data.address;

        if(data.picture.includes("image")){
            const picture = await ImageManager.uploadimagebase64row(data.picture);
            newdata.picture = picture;
        }


        await newdata.save();
        return Response.ok(res);
    },

    departmentAddorUpdate: async function (req, res) {

        const data = req.body;
        let newdata = new Department();
        if (data._id.length >1) {
            newdata = await Department.findById(data._id).exec()
        }
        newdata.name = data.name;
        newdata.graduatetype = data.graduatetype;
        newdata.description = data.description;
        if(data.picture.includes("application") || data.picture.includes("pdf")){
            const picture = await ImageManager.uploadimagebase64row(data.picture);
            newdata.picture = picture;
        }


        await newdata.save();
        return Response.ok(res);
    },


    sectionAddorUpdate: async function (req, res) {
        console.log("sectionAddorUpdate ....");
        const data = req.body;
        let newdata = new Section();
        if (data._id.length >1) {
            newdata = await Section.findById(data._id).exec()
        }
        newdata.name = data.name;
        newdata.namekr = data.namekr;
        newdata.department = data.department;


        await newdata.save();
        return Response.ok(res);
    },

    admindeletebanner: function (req, res) {
        const id = req.params.id;
        Banner.findById(id, function (error, data) {
            if (error) return res.serverError(error);
            if (!data) return res.notFound();

            data.remove(function (error) {
                if (error) return res.serverError(error);
                return res.ok();
            });

        });
    },


    admindeletebook: function (req, res) {
        const id = req.params.id;
        Book.findById(id, function (error, data) {
            if (error) return res.serverError(error);
            if (!data) return res.notFound();

            data.remove(function (error) {
                if (error) return res.serverError(error);
                return res.ok();
            });

        });
    },


    schooldeletebanner: function (req, res) {
        const id = req.params.id;
        University.findById(id, function (error, data) {
            if (error) return res.serverError(error);
            if (!data) return res.notFound();

            data.remove(function (error) {
                if (error) return res.serverError(error);
                return res.ok();
            });

        });
    },


    schooldeletecertificate: function (req, res) {
        const id = req.params.id;
        Certificate.findById(id, function (error, data) {
            if (error) return res.serverError(error);
            if (!data) return res.notFound();

            data.remove(function (error) {
                if (error) return res.serverError(error);
                return res.ok();
            });

        });
    },


    scheduledeletecertificate: function (req, res) {
        const id = req.params.id;
        Schedule.findById(id, function (error, data) {
            if (error) return res.serverError(error);
            if (!data) return res.notFound();
            data.remove(function (error) {
                if (error) return res.serverError(error);
                return res.ok();
            });

        });
    },


    studentclassprogressdeletecertificate: function (req, res) {
        const id = req.params.id;
        StudentClassProgress.findById(id, function (error, data) {
            if (error) return res.serverError(error);
            if (!data) return res.notFound();

            data.remove(function (error) {
                if (error) return res.serverError(error);
                return res.ok();
            });

        });
    },


    departmentdeletebanner: function (req, res) {
        const id = req.params.id;
        Department.findById(id, function (error, data) {
            if (error) return res.serverError(error);
            if (!data) return res.notFound();

            data.remove(function (error) {
                if (error) return res.serverError(error);
                return res.ok();
            });

        });
    },

    sectiondeletebanner: function (req, res) {
        const id = req.params.id;
        Section.findById(id, function (error, data) {
            if (error) return res.serverError(error);
            if (!data) return res.notFound();

            data.remove(function (error) {
                if (error) return res.serverError(error);
                return res.ok();
            });

        });
    },
    adminteacherxdelete: function (req, res) {
        const id = req.params.id;
        Teacher.findById(id, async function (error, data) {
            if (error) return res.serverError(error);
            if (!data) return res.notFound();
            data.remove(function (error) {
                if (error) return res.serverError(error);
                return res.ok();
            });

        });
    },
    adminlistbanner:async function (req, res) {
        let data = await Banner.find().sort({ "$natural": -1 }).lean({virtuals:true}).exec();
        return Response.ok(res,data);
    },

    adminlistbbook:async function (req, res) {
        let data = await Book.find().sort({ "$natural": -1 }).lean({virtuals:true}).exec();
        return Response.ok(res,data);
    },

    adminlistschool:async function (req, res) {
        let data = await University.find().sort({ "$natural": -1 }).lean({virtuals:true}).exec();
        return Response.ok(res,data);
    },

    adminlistcertificate:async function (req, res) {
        let data = await Certificate.find().sort({ "$natural": -1 }).lean({virtuals:true}).exec();
        return Response.ok(res,data);
    },

    filteradminlistcertificate:async function (req, res) {
        const id = req.params.id;
        let data = await Certificate.find({department:id}).sort({ "$natural": -1 }).lean({virtuals:true}).exec();
        return Response.ok(res,data);
    },


    adminlistschedule:async function (req, res) {
        let data = await Schedule.find().populate({
            path:     'teachermatier classx section',
            populate: { path:  'matier',
                model: 'matier' }
        }).sort({ "$natural": -1 }).lean({virtuals:true}).exec();

        //console.log("data",data)
        return Response.ok(res,data);

    },


    adminliststudentclassprogress:async function (req, res) {
        let data = await StudentClassProgress.find().populate("student classx").sort({ "$natural": -1 }).lean({virtuals:true}).exec();
        return Response.ok(res,data);
    },
    adminlistdepartment:async function (req, res) {
        let data = await Department.find().sort({ "$natural": -1 }).lean({virtuals:true}).exec();
        return Response.ok(res,data);
    },


    adminlistsection:async function (req, res) {
        let data = await Section.find().populate("department").sort({ "$natural": -1 }).lean({virtuals:true}).exec();
        return Response.ok(res,data);
    },
    adminnewsdelete: function (req, res) {
        const id = req.params.id;
        News.findById(id, async function (error, data) {
            if (error) return res.serverError(error);
            if (!data) return res.notFound();
            data.remove(function (error) {
                if (error) return res.serverError(error);
                return res.ok();
            });

        });
    },
    adminoutletssdelete: function (req, res) {
        const id = req.params.id;
        Location.findById(id, async function (error, data) {
            if (error) return res.serverError(error);
            if (!data) return res.notFound();
            data.remove(function (error) {
                if (error) return res.serverError(error);
                return res.ok();
            });

        });
    },

    admintimeslotssdelete: function (req, res) {
        const id = req.params.id;
        TimeSlots.findById(id, async function (error, data) {
            if (error) return res.serverError(error);
            if (!data) return res.notFound();
            data.remove(function (error) {
                if (error) return res.serverError(error);
                return res.ok();
            });

        });
    },

    adminlogdelete: function (req, res) {
        const id = req.params.id;
        Log.findById(id, async function (error, data) {
            if (error) return res.serverError(error);
            if (!data) return res.notFound();
            data.remove(function (error) {
                if (error) return res.serverError(error);
                return res.ok();
            });

        });
    },

    admintdaysdelete: function (req, res) {
        const id = req.params.id;
        Day.findById(id, async function (error, data) {
            if (error) return res.serverError(error);
            if (!data) return res.notFound();
            data.remove(function (error) {
                if (error) return res.serverError(error);
                return res.ok();
            });

        });
    },

    admincitydelete: function (req, res) {
        const id = req.params.id;
        City.findById(id, async function (error, data) {
            if (error) return res.serverError(error);
            if (!data) return res.notFound();
            data.remove(function (error) {
                if (error) return res.serverError(error);
                return res.ok();
            });

        });
    },

    adminreviewdelete: function (req, res) {
        const id = req.params.id;
        Reviews.findById(id, async function (error, data) {
            if (error) return res.serverError(error);
            if (!data) return res.notFound();
            data.remove(function (error) {
                if (error) return res.serverError(error);
                return res.ok();
            });

        });
    },

    adminguidedelete: function (req, res) {
        const id = req.params.id;
        Guide.findById(id, async function (error, data) {
            if (error) return res.serverError(error);
            if (!data) return res.notFound();
            data.remove(function (error) {
                if (error) return res.serverError(error);
                return res.ok();
            });

        });
    },

    listuser:async function (req, res) {
        let items = await User.find().sort({ "$natural": -1 }).lean({virtuals:true}).exec();
        return res.ok(
            items
        );
    },
    listroomadmin:async function (req, res) {
        let items = await Room.find().populate("users").sort({ "$natural": -1 }).lean({virtuals:true}).exec();
        return res.ok(
            items
        );
    },
    createroomfromadmin: async function(req, res) {
        const data = req.body;
        let newdata = new Room();
        if (data._id.length >1) {
            newdata = await Room.findById(data._id).exec()
        }
        console.log(data)
        newdata.title = data.title;
        newdata.users = data.users;
        newdata.ispublic = data.ispublic;
        newdata.isgroup = true;
        await newdata.save();

        return Response.ok(res);
        //
    },

    listreporteduser:async function (req, res) {
        let items = await UserReport.find().populate("user reported").sort({ "$natural": -1 }).lean({virtuals:true}).exec();
        return res.ok(
            items
        );
    },
    listreportedmsguser:async function (req, res) {
        let items = await UserReportMessage.find().populate("user reported message").sort({ "$natural": -1 }).lean({virtuals:true}).exec();
        return res.ok(
            items
        );
    },

    admingetsettings: async function (req, res) {
        let data  = await Settings.findOne().lean({virtuals:true}).exec();
        return Response.ok(res,data);

    },



    listaddressx: async function (req, res) {
        let data  = await Address.find().sort({ "$natural": -1 }).lean({virtuals:true}).exec();
        return Response.ok(res,data);

    },

    adminsavesettings: async function (req, res) {


        let lessthan = req.body.lessthan;
        let morethan = req.body.morethan;
        let documentx = req.body.documentx;



        let data  = await Settings.findOne().exec();


        if(data){
            data.lessthan = lessthan;
            data.morethan = morethan;
            data.documentx = documentx;
            await data.save();
        }else{
            data  = new Settings();
            data.lessthan = lessthan;
            data.morethan = morethan;
            data.documentx = documentx;
            await data.save();
        }
        return Response.ok(res,data);
    },

    listcontactadmin:async function (req, res) {
        let items = await Contact.find().sort({ "$natural": -1 }).lean({virtuals:true}).exec();
        return res.ok(
            items
        );
    },
    adminuserdelete: function (req, res) {
        const id = req.params.id;

        User.findById(id, function (error, data) {
            if (error) return res.serverError(error);
            if (!data) return res.notFound();

            Address.deleteMany({user:id}).exec();
            Order.deleteMany({user:id}).exec();

            data.remove(function (error) {
                if (error) return res.serverError(error);
                return res.ok();
            });

        });
    },

    adminroomdelete: function (req, res) {
        const id = req.params.id;

        Room.findById(id, function (error, data) {
            if (error) return res.serverError(error);
            if (!data) return res.notFound();
            data.remove(function (error) {
                if (error) return res.serverError(error);
                return res.ok();
            });

        });
    },


    admindeletecontact: function (req, res) {
        const id = req.params.id;

        Contact.findById(id, function (error, data) {
            if (error) return res.serverError(error);
            if (!data) return res.notFound();


            data.remove(function (error) {
                if (error) return res.serverError(error);
                return res.ok();
            });

        });
    },


    userAddorUpdate: async function (req, res) {

        console.log("userAddorUpdate ....");

        const data = await ImageManager.uploadimagebody(req,res)
        //console.log("data",data)
        if (data._id.length >1) {
            User.findById(data._id, async function (error, item) {
                if (error) return res.serverError(error);
                if (!item) return res.notFound("item not found");

                item.username = data.username;
                item.full_name = data.full_name;
                item.phone = data.phone;
                item.dob = data.dob;
                item.country = data.country;



                item.email = data.email;
                if(data.newpassword && data.newpassword.length>1){
                    item.password = data.newpassword;
                    console.log("new password detect");
                    //
                    UserHelper.sendResetPasswordEmail(data._id,data.email);
                }




                item.picture =  data.picture;
                await item.save();
                return res.ok();
            });
        }else{

            let newdata = new User();
            newdata.first_name = data.first_name;
            newdata.last_name = data.last_name;
            newdata.email = data.email;
            newdata.password = data.password;
            newdata.comments = data.comments;
            newdata.birthday = data.birthday;
            newdata.phone = data.phone;
            newdata.picture =  data.picture;
            await newdata.save();
            return res.ok();

        }


    },

    adminthreaddelete: function (req, res) {
        const id = req.params.id;
        Thread.findById(id, async function (error, data) {
            if (error) return res.serverError(error);
            if (!data) return res.notFound();
            data.remove(function (error) {
                if (error) return res.serverError(error);
                return res.ok();
            });

        });
    },

    adminsponsordelete: function (req, res) {
        const id = req.params.id;
        Sponsor.findById(id, async function (error, data) {
            if (error) return res.serverError(error);
            if (!data) return res.notFound();
            data.remove(function (error) {
                if (error) return res.serverError(error);
                return res.ok();
            });

        });
    },

    managerAddorUpdate: function (req, res) {
        let data = req.body;
    
        // Ensure `data` exists and `_id` is valid before proceeding
        if (data && typeof data._id === 'string' && data._id.length > 1) {
            Manager.findById(data._id, function (error, item) {
                if (error) return res.status(500).send({ message: "Server Error", error });
                if (!item) return res.status(404).send({ message: "Item not found" });
    
                // Update the manager details
                item.full_name = data.full_name;
                item.username = data.username;
                if (data.newpassword && data.newpassword.length > 1) {
                    item.password = data.newpassword; // Save new password if provided
                } else if (data.password) {
                    item.password = data.password; // Save existing password
                }
                item.comments = data.comments;
                item.managertype = data.managertype;
                item.phone = data.phone;
    
                // Save the updated manager object
                item.save(function (error) {
                    if (error) return res.status(500).send({ message: "Error saving item", error });
                    return res.status(200).send({ message: "Manager updated successfully" });
                });
            });
        } else {
            // Creating a new manager if `_id` is invalid or not provided
            if (!data || !data.full_name || !data.username || !data.password) {
                return res.status(400).send({ message: "Missing required fields" });
            }
    
            let newdata = new Manager();
            newdata.full_name = data.full_name;
            newdata.username = data.username;
            newdata.password = data.password;
            newdata.comments = data.comments;
            newdata.managertype = data.managertype;
            newdata.phone = data.phone;
    
            newdata.save(function (error) {
                if (error) {
                    console.log(error);
                    return res.status(500).send({ message: "Error saving new manager", error });
                }
                return res.status(200).send({ message: "Manager created successfully" });
            });
        }
    },
    
    adminmanagerdelete: function (req, res) {
        const id = req.params.id;
        Manager.findById(id, function (error, data) {
            if (error) return res.serverError(error);
            if (!data) return res.notFound();

            data.remove(function (error) {
                if (error) return res.serverError(error);
                return res.ok();
            });

        });
    },

    admincontentdelete: function (req, res) {
        const id = req.params.id;
        Content.findById(id, function (error, data) {
            if (error) return res.serverError(error);
            if (!data) return res.notFound();

            data.remove(function (error) {
                if (error) return res.serverError(error);
                return res.ok();
            });

        });
    },

};
