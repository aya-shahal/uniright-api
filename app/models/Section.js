let mongoose = require("mongoose");
const mongooseLeanVirtual = require('mongoose-lean-virtuals');

let schema = mongoose.Schema({
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
        university:{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'university',
        },
    department:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'department',
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


const collectionname = "section"
module.exports = mongoose.model(collectionname, schema, collectionname);
