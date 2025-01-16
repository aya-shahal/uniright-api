let mongoose = require("mongoose");
const mongooseLeanVirtual = require('mongoose-lean-virtuals');

let schema = mongoose.Schema({
        name: {
            type: String,
            default: "",
            trim: true
        },
    graduatetype: {
            type: String,
            default: "",
            trim: true
        },
    description: {
        type: String,
        default: "",
        trim: true
    },
        university:{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'university',
        },

    picture: {
        type: String,
        default: ""
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

schema.virtual('full_picture').get(function() {
    let fullpicture = "";
    if (this.picture && this.picture.length > 1){
        fullpicture = _config("app.imageurl")+"/"+this.picture;
    }
    return fullpicture;
});

const collectionname = "department"
module.exports = mongoose.model(collectionname, schema, collectionname);
