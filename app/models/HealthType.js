let mongoose = require("mongoose");
const mongooseLeanVirtual = require('mongoose-lean-virtuals');
let schema = mongoose.Schema({
        title: {
            type: String,
            default: "",
        },
    titlekr: {
        type: String,
        default: "",
    },

        status: {
            type: Number,
            default: 1 // unpaid
        }
    }, {
        versionKey: false,
        timestamps: true
    }
);

const tblname = "healthtype";






schema.set('toObject', { getters: true,virtuals:true });
schema.set('toJSON', { getters: true,virtuals:true });
// Plugin must be *after* virtuals
schema.plugin(mongooseLeanVirtual);


module.exports = mongoose.model(tblname, schema, tblname);
