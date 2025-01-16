let mongoose = require("mongoose");
const mongooseLeanVirtual = require('mongoose-lean-virtuals');
let schema = mongoose.Schema({
    university:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'university',
    },
    invoicestartnumber:{
        type: Number,
        default: 2000010000
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




schema.set('toObject', { getters: true,virtuals:true });
schema.set('toJSON', { getters: true,virtuals:true });
schema.plugin(mongooseLeanVirtual);


schema.statics.grabinvoicenumber = async function () {
    let data = await Settings.findOne().exec();

    if(!data){
        data = new Settings()
        await data.save();
    }else{
        data.invoicestartnumber = parseInt(data.invoicestartnumber)+1
        await data.save();
    }

    return data.invoicestartnumber;
};
module.exports = mongoose.model("settings", schema, "settings");
