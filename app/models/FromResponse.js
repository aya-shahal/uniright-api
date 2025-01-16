let mongoose = require("mongoose");
const mongooseLeanVirtual = require('mongoose-lean-virtuals');
let schema = mongoose.Schema({
    response: {
        type: [Object],
        default: []
    },
    student: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "student",
        },
        form: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "form",
        },
        status: {
            type: Number,
            default: 1
        }
    }, {
        versionKey: false,
        timestamps: true
    }
);

const tblname = "formresponse";



schema.set('toObject', { getters: true,virtuals:true });
schema.set('toJSON', { getters: true,virtuals:true });
// Plugin must be *after* virtuals
schema.plugin(mongooseLeanVirtual);


module.exports = mongoose.model(tblname, schema, tblname);
