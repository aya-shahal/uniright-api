let mongoose = require("mongoose");
const mongooseLeanVirtual = require('mongoose-lean-virtuals');

let schema = mongoose.Schema({
    university:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'university',
    },
        msg: {
            type: String,
            default: "",
            trim: true
        },
    msgkr: {
        type: String,
        default: "",
        trim: true
    },
    notificationtype: {
        type: String,
        default: "",
        trim: true
    },

    teacher:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'teacher',
    },
        student:{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'student',
        },
    parent:{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'parent',
        },
        status: {
            type: Number,
            default: 1
        },
    }, {
        versionKey: false,
        timestamps: true
    }
);


// Plugin must be *after* virtuals
schema.plugin(mongooseLeanVirtual);

schema.set('toObject', { getters: true,virtuals:true });
schema.set('toJSON', { getters: true,virtuals:true });

const collectionname = "notification"


schema.statics.addNotificationStudent = async function (student,text,notificationtype="") {
    let notification = new Notification();
    notification.student = student;
    notification.msg = text;
    notification.notificationtype = notificationtype;
    await notification.save();
    if(student){
      //  PushNotification.globalsend(userinfo.push.token,fromuserinfo.full_name,text,notificationtype,targetid)
    }
};


schema.statics.addNotificationTeacher = async function (teacher,text,notificationtype="") {
    let notification = new Notification();
    notification.teacher = teacher;
    notification.msg = text;
    notification.notificationtype = notificationtype;
    await notification.save();
    if(student){
        //  PushNotification.globalsend(userinfo.push.token,fromuserinfo.full_name,text,notificationtype,targetid)
    }
};

schema.statics.addNotificationParent = async function (parent,text,notificationtype="") {
    let notification = new Notification();
    notification.parent = parent;
    notification.msg = text;
    notification.notificationtype = notificationtype;
    await notification.save();
    if(student){
        //  PushNotification.globalsend(userinfo.push.token,fromuserinfo.full_name,text,notificationtype,targetid)
    }
};

module.exports = mongoose.model(collectionname, schema, collectionname);
