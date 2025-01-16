let mongoose = require("mongoose");
const mongooseLeanVirtual = require('mongoose-lean-virtuals');
let schema = mongoose.Schema({
        student: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "student",
        },
        healthtype: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "healthtype",
        },

        note: {
            type: String,
            default: "",
        },


        status: {
            type: Number,
            default: 0 // unpaid
        }
    }, {
        versionKey: false,
        timestamps: true
    }
);

const tblname = "health";


schema.set('toObject', { getters: true,virtuals:true });
schema.set('toJSON', { getters: true,virtuals:true });
// Plugin must be *after* virtuals
schema.plugin(mongooseLeanVirtual);


module.exports = mongoose.model(tblname, schema, tblname);
