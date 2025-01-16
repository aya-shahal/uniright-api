let mongoose = require("mongoose");
const mongooseLeanVirtual = require('mongoose-lean-virtuals');

let schema = mongoose.Schema({
    university:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'university',
    },
        teacher:{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'teacher',
        },
        matier:{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'matier',
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


const collectionname = "teachermatier"
module.exports = mongoose.model(collectionname, schema, collectionname);
