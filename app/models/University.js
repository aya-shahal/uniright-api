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

    picture: {
        type: String,
        default: "userprofile.png"
    },

    address: {
        type: String,
        default: "",
        trim: true
    },
    dob: {
        type: String,
        default: "",
        trim: true
    },

        status: {
            type: Number,
            default: 1
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

const collectionname = "university"

schema.virtual('fullpicture').get(function() {
    let fullpicture = "";
    if (this.picture && this.picture.length > 1){
        fullpicture = _config("app.imageurl")+"/"+this.picture;
    }
    return fullpicture;
});

module.exports = mongoose.model(collectionname, schema, collectionname);
