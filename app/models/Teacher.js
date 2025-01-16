let mongoose = require("mongoose");
const mongooseLeanVirtual = require('mongoose-lean-virtuals');
let bcrypt = require("bcrypt");
let schema = mongoose.Schema({
    university:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'university',
    },

    certificate:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'certificate',
    },

    teacherid: {
            type: String,
            default: "",
            trim: true
        },
        fname: {
            type: String,
            default: "",
            trim: true
        },
        lname: {
            type: String,
            default: "",
            trim: true
        },

    fnamekr: {
        type: String,
        default: "",
        trim: true
    },
    lnamekr: {
        type: String,
        default: "",
        trim: true
    },

    phone: {
        type: String,
        default: "",
        trim: true
    },

        sex: {
            type: String,
            default: "male",
            trim: true
        },
        nationality: {
            type: String,
            default: "lebanese",
            trim: true
        },

        dateofbirth: {
            type: String,
            default: "",
            trim: true
        },


        email: {
            type: String,
            lowercase: true,
            trim: true
        },
    username: {
        type: String,
        required: true
    },
    password: {
            type: String,
            required: true
        },
        activationcode: {
            type: Number,
            default: 0 //
        },
        status: {
            type: Number,
            default: 1 // 0 not verified , 1 verified
        },
        lang: {
            type: String,
            default: 'en'
        },
        lastlogin: {
            type: Date,
        },
        picture: {
            type: String,
            default: "userprofile.png"
        },
        push: {
            token: {
                type: String,
                default: ""
            },
            silent: {
                type: Boolean,
                default: false
            },
        },

    }, {
        versionKey: false,
        timestamps: true
    }
);



// Plugin must be *after* virtuals
schema.plugin(mongooseLeanVirtual);

schema.virtual('fullpicture').get(function() {
    let fullpicture = "";
    if (this.picture && this.picture.length > 1){
        fullpicture = _config("app.imageurl")+"/"+this.picture;
    }
    return fullpicture;
});
schema.set('toObject', { getters: true,virtuals:true });
schema.set('toJSON', { getters: true,virtuals:true });


schema.statics.GrabClassIDs = async function (teacher) {
    console.log("GrabClassIDs from teacher",teacher)
    let classids = [];
    let teacherclass = await TeacherMatier.find({teacher:teacher}).sort({ "$natural": -1 }).lean({virtuals:true}).exec();
    teacherclass.map(x=>{
        classids.push(x.classx)
    })
    return classids;
};
schema.statics.GrabStudentIDs = async function (teacher) {
    console.log("GrabStudentIDs from teacher",teacher)
    let classids = [];
    let teacherclass = await TeacherMatier.find({teacher:teacher}).sort({ "$natural": -1 }).lean({virtuals:true}).exec();
    teacherclass.map(x=>{
        classids.push(x.classx)
    })
    let studentlist = await Student.find({ classx: { $in: classids } }).exec()
    let studentlistid =[];
    studentlist.map(x=>{
        studentlistid.push(x.id)
    })
    return studentlistid;
};
schema.statics.findData = async function (name ) {
    let found = await User.find({
        $or: [
            { 'full_name': { $regex : new RegExp(name, "i") } },
            { 'email': { $regex : new RegExp(name, "i") }},
        ]
    }).exec();
    return found;
};
const collectionname = "teacher"
module.exports = mongoose.model(collectionname, schema, collectionname);
