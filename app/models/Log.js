let mongoose = require("mongoose");
const mongooseLeanVirtual = require('mongoose-lean-virtuals');

let schema = mongoose.Schema({
        text: {
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



schema.statics.Track = async function (text ,teacher="",student="",parent="") {
    let data = new Log()
    data.text = text;

    if(teacher){
        data.teacher = teacher;
    }

    if(student){
        data.student = student;
    }

    if(parent){
        data.parent = parent;
    }

    await data.save();
    return data._id;
};
const collectionname = "log"
module.exports = mongoose.model(collectionname, schema, collectionname);
