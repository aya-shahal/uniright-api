let mongoose = require("mongoose");
const mongooseLeanVirtual = require('mongoose-lean-virtuals');

let schema = mongoose.Schema({
    university:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'university',
    },
        student:{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'student',
        },
        matier:{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'matier',
        },
    classx:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'classx',
    },
    teacher:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'teacher',
    },
    year: {
        type: String,
        default: "",
    },
    note: {
        type: String,
        default: "",
    },
    datex: {
        type: String,
        default: "",
        trim: true
    },
    picture: {
        type: String,
        default: ""
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


schema.virtual('full_picture').get(function() {
    let fullpicture = "";
    if (this.picture && this.picture.length > 1){
        fullpicture = _config("app.imageurl")+"/"+this.picture;
    }
    return fullpicture;
});

schema.statics.Translate =  function (data,lang ) {
    if(lang=="kr" && data.matier ){
        data.matier.name = data.matier.namekr
        if(data.classx){
            data.classx.name = data.classx.namekr
        }


    }
    return data;
};
const collectionname = "grade"
module.exports = mongoose.model(collectionname, schema, collectionname);
