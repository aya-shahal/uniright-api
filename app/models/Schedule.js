let mongoose = require("mongoose");
const mongooseLeanVirtual = require('mongoose-lean-virtuals');

let schema = mongoose.Schema({
    teachermatier:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'teachermatier',
    },
    classx:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'classx',
    },
        section:{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'section',
        },

    day: {
        type: String,
        default: ""
    },

    fromtime: {
        type: String,
        default: ""
    },
    totime: {
        type: String,
        default: ""
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
    if(lang=="kr"  && data.teachermatier &&  data.teachermatier.matier ){
        data.teachermatier.matier.name = data.teachermatier.matier.namekr
    }
    return data;
};

const collectionname = "schedule"
module.exports = mongoose.model(collectionname, schema, collectionname);
