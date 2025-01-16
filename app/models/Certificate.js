let mongoose = require("mongoose");
const mongooseLeanVirtual = require('mongoose-lean-virtuals');

let schema = mongoose.Schema({
        name: {
            type: String,
            default: "",
            trim: true
        },
    picture: {
            type: String,
            default: "",
            trim: true
        },

    picture2: {
        type: String,
        default: "",
        trim: true
    },
    credits: {
        type: Number,
        default: 0,
    },
    department:{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'department',
        },

    university:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'university',
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


schema.virtual('full_picture2').get(function() {
    let fullpicture = "";
    if (this.picture2 && this.picture2.length > 1){
        fullpicture = _config("app.imageurl")+"/"+this.picture2;
    }
    return fullpicture;
});

const collectionname = "certificate"
module.exports = mongoose.model(collectionname, schema, collectionname);
