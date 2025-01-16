let mongoose = require("mongoose");
const mongooseLeanVirtual = require('mongoose-lean-virtuals');

let schema = mongoose.Schema({
    university:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'university',
    },
    classx:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'classx',
    },
        name: {
            type: String,
            default: "",
            trim: true
        },
    type: {
        type: String,
        default: "public",
        trim: true
    },
        text: {
            type: String,
            default: "",
            trim: true
        },
    namekr: {
        type: String,
        default: "",
        trim: true
    },
    textkr: {
        type: String,
        default: "",
        trim: true
    },
        picture: {
            type: String,
            default: "threaddefault.png"
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


schema.virtual('fullpicture').get(function() {
    let fullpicture = "";
    if (this.picture && this.picture.length > 1){
        fullpicture = _config("app.imageurl")+"/"+this.picture;
    }
    return fullpicture;
});
schema.set('toObject', { getters: true,virtuals:true });
schema.set('toJSON', { getters: true,virtuals:true });

schema.statics.findData = async function (name ) {
    let found = await StoryCategory.find({
        $or: [
            { 'name': { $regex : new RegExp(name, "i") } },
            { 'namear': { $regex : new RegExp(name, "i") } },
        ]
    }).exec();
    return found;
};


schema.statics.Translate =  function (data,lang ) {
    if(lang=="kr" ){
        data.name = data.namekr
        data.text = data.textkr
    }
    return data;
};

const collectionname = "news"
module.exports = mongoose.model(collectionname, schema, collectionname);
