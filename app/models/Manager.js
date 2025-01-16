let mongoose = require("mongoose");
let bcrypt = require("bcrypt");

let schema = mongoose.Schema({
    university:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'university',
    },
        full_name: {
            type: String,
            required: true
        },
    phone: {
        type: String,
        defalut: ""
    },

        username: {
            type: String,
            required: true,
            unique: true
        },
        password: {
            type: String,
            required: true
        },
        status: {
            type: Number,
            default: 1 // 0 not verified , 1 verified
        },
        comments:{
            type: String,
            default: ""
        },
        managertype:{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'managertype',
        },

    settings:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'settings',
    },

        lang: {
            type: String,
            default: 'en'
        },
        lastlogin: {
            type: Date
        }

    }, {
        versionKey: false,
        timestamps: true
    }
);


/**
 * Compare raw and encrypted password
 * @param password
 * @param callback
 */



schema.set('toObject', { getters: true,virtuals:true });
schema.set('toJSON', { getters: true,virtuals:true });

const collectionname = "manager"
module.exports = mongoose.model(collectionname, schema, collectionname);
