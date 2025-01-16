let mongoose = require("mongoose");
const mongooseLeanVirtual = require('mongoose-lean-virtuals');
let bcrypt = require("bcrypt");
let schema = mongoose.Schema({
    university:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'university',
    },
        fathername: {
            type: String,
            default: "",
            trim: true
        },
        fatherfamily: {
            type: String,
            default: "",
            trim: true
        },
        mothername: {
            type: String,
            default: "",
            trim: true
        },
        motherfamily: {
            type: String,
            default: "",
            trim: true
        },




    fathernamekr: {
        type: String,
        default: "",
        trim: true
    },
    fatherfamilykr: {
        type: String,
        default: "",
        trim: true
    },
    mothernamekr: {
        type: String,
        default: "",
        trim: true
    },
    motherfamilykr: {
        type: String,
        default: "",
        trim: true
    },


        fatherphone: {
            type: String,
            default: "",
            trim: true
        },
        motherphone: {
            type: String,
            default: "",
            trim: true
        },
        email: {
            type: String,
            lowercase: true,
            trim: true
        },
    dateofbirth: {
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



schema.virtual('fullpicture').get(function() {
    let fullpicture = "";
    if (this.picture && this.picture.length > 2){
        fullpicture = _config("app.imageurl")+"/"+this.picture;
    }
    return fullpicture;
});



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

schema.statics.findData = async function (name ) {
    let found = await Parent.find({
        $or: [
            { 'full_name': { $regex : new RegExp(name, "i") } },
            { 'email': { $regex : new RegExp(name, "i") }},
        ]
    }).exec();
    return found;
};


schema.statics.GrabStudentIDs = async function (parentid) {
    console.log("GrabStudentIDs from parentid",parentid)
    let studentlist = await Student.find({parent:parentid}).exec()
    let studentlistid =[];
    studentlist.map(x=>{
        studentlistid.push(x.id)
    })
    return studentlistid;
};

schema.statics.GrabStudentClassIDs = async function (parentid) {
    console.log("GrabStudentIDs from parentid",parentid)
    let studentlist = await Student.find({parent:parentid}).exec()
    let studentlistid =[];
    studentlist.map(x=>{
        studentlistid.push(x.classx)
    })
    return studentlistid;
};
const collectionname = "parent"
module.exports = mongoose.model(collectionname, schema, collectionname);
