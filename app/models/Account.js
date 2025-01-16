let mongoose = require("mongoose");
const mongooseLeanVirtual = require('mongoose-lean-virtuals');

let schema = mongoose.Schema({
        name: {
            type: String,
            default: "",
            trim: true
        },
    accountype: {
        type: String,
        default: "",
        trim: true
    },

        namekr: {
            type: String,
            default: "",
            trim: true
        },
    type: {
        type: String,
        default: "",
        trim: true
    },
        university:{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'university',
        },
    paymentamounttype: {
        type: String,
        default: "full",
    },
    operation: {
        type: String,
        default: "",
    },
    invoicenumber: {
        type: Number,
        default: 0,
    },
    invoicedate: {
        type: String,
        default: "",
    },
    note: {
        type: String,
        default: "",
    },
    qty: {
        type: Number,
        default: 1,
    },
    amount: {
        type: Number,
        default: 1,
    },
    paymenttype: {
        type: String,
        default: "card",
        trim: true
    },

    picture: {
        type: String,
        default: "",
        trim: true
    },

    paid: {
        type: Boolean,
        default: false,
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


const collectionname = "account"
module.exports = mongoose.model(collectionname, schema, collectionname);
