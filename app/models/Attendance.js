let mongoose = require("mongoose");
const mongooseLeanVirtual = require('mongoose-lean-virtuals');

let schema = mongoose.Schema({
        student:{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'student',
        },
    teacher:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'teacher',
    },
    classx:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'classx',
    },
    university:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'university',
    },
    note: {
        type: String,
        default: "",
        trim: true
    },
    attendancetype: {
        type: String,
        default: "present",
        trim: true
    },
    datex: {
        type: String,
        default: "",
        trim: true
    },
    time: {
        type: String,
        default: "",
        trim: true
    },
        status: {
            type: Number,
            default: 1 // 0 not verified , 1 verified
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


const collectionname = "attendance"
module.exports = mongoose.model(collectionname, schema, collectionname);
