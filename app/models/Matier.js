let mongoose = require("mongoose");
const mongooseLeanVirtual = require('mongoose-lean-virtuals');

let schema = mongoose.Schema({
    university:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'university',
    },
        name: {
            type: String,
            default: "",
            trim: true
        },

    namekr: {
        type: String,
        default: "",
        trim: true
    },
    credits: {
        type: Number,
        default: 0,
    },

        classx:{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'classx',
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
    if(lang=="kr" ){
        data.name = data.namekr
    }
    return data;
};

const collectionname = "matier"
module.exports = mongoose.model(collectionname, schema, collectionname);
