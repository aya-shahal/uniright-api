let mongoose = require("mongoose");
const mongooseLeanVirtual = require('mongoose-lean-virtuals');
let schema = mongoose.Schema({
    namekr: {
        type: String,
        default: "",
        trim: true
    },
    matier:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'matier',
    },
    name: {
            type: String,
            default: "",
            trim: true
        },
        inputlist: {
            type: [Object],
            default: []
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

const tblname = "form";






schema.set('toObject', { getters: true,virtuals:true });
schema.set('toJSON', { getters: true,virtuals:true });
// Plugin must be *after* virtuals
schema.plugin(mongooseLeanVirtual);


schema.statics.Translate =  function (data,lang ) {
    if(lang=="kr"  ){
        data.name = data.namekr
        if(data.matier){
            data.matier.name = data.matier.namekr
        }

    }
    return data;
};

module.exports = mongoose.model(tblname, schema, tblname);
