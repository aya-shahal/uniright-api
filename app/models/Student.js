let mongoose = require("mongoose");
const mongooseLeanVirtual = require('mongoose-lean-virtuals');
let schema = mongoose.Schema({
    university:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'university',
    },
    studentid: {
        type: String,
        default: "",
        trim: true
    },
    address: {
        type: String,
        default: "",
        trim: true
    },
    note: {
        type: String,
        default: "",
    },
    major: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'certificate',
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


    sex: {
        type: String,
        default: "male",
        trim: true
    },
    nationality: {
        type: String,
        default: "iraq",
        trim: true
    },
    registrationrecord: {
        type: String,
        default: "",
        trim: true
    },
    birthlocation: {
        type: String,
        default: "",
        trim: true
    },
    dateofbirth: {
        type: String,
        default: "",
        trim: true
    },
    parent:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'parent',
    },
    classx:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'classx',
    },
    studentphone: {
        type: String,
        default: "",
        trim: true
    },

    blood: {
        type: String,
        default: "",
        trim: true
    },
    registredat: {
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
    let found = await User.find({
        $or: [
            { 'full_name': { $regex : new RegExp(name, "i") } },
            { 'email': { $regex : new RegExp(name, "i") }},
        ]
    }).exec();
    return found;
};
const collectionname = "student"
module.exports = mongoose.model(collectionname, schema, collectionname);
