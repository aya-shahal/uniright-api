let mongoose = require("mongoose");
const mongooseLeanVirtual = require('mongoose-lean-virtuals');
let schema = mongoose.Schema({
        name: {
            type: String,
            default: "",
            trim: true
        },
    university:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'university',
    },
    subtitle: {
        type: String,
        default: ""
    },
    namear: {
        type: String,
        default: "",
        trim: true
    },
    subtitlear: {
        type: String,
        default: ""
    },
    formobile: {
        type: String,
        default: "web" // no , mobileweb , mobileapp
    },
        picture: {
            type: String,
            default: ""
        },
    picturear: {
        type: String,
        default: ""
    },
        link: {
            type: String,
            default: ""
        },
    orderx: {
        type: Number,
        default: 0
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

const tblname = "banner"
schema.virtual('full_picture').get(function() {
    let fullpicture = "";
    if (this.picture && this.picture.length > 1){
        fullpicture = _config("app.imageurl")+"/"+this.picture;
    }
    return fullpicture;
});



schema.set('toObject', { getters: true,virtuals:true });
schema.set('toJSON', { getters: true,virtuals:true });
// Plugin must be *after* virtuals
schema.plugin(mongooseLeanVirtual);
module.exports = mongoose.model(tblname, schema, tblname);
