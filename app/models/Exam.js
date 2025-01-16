let mongoose = require("mongoose");
const mongooseLeanVirtual = require('mongoose-lean-virtuals');

let schema = mongoose.Schema({
    datex: {
        type: String,
        default: "",
        trim: true
    },
    university:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'university',
    },
        matier:{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'matier',
        },
    classx:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'classx',
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


schema.statics.Translate =  function (data,lang ) {
    if(lang=="kr" && data.matier){
        data.matier.name = data.matier.namekr
    }
    return data;
};
const collectionname = "exam"
module.exports = mongoose.model(collectionname, schema, collectionname);
