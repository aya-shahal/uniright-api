let mongoose = require("mongoose");
const mongooseLeanVirtual = require('mongoose-lean-virtuals');

let schema = mongoose.Schema({

        teacher:{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'teacher',
        },
    student:{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'student',
        },

    score: {
        type: Number,
        default: 0,
    },
    note: {
        type: String,
        default: "",
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


const collectionname = "rate"
module.exports = mongoose.model(collectionname, schema, collectionname);
