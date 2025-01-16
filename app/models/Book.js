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
    description: {
        type: String,
        default: "",
        trim: true
    },

        picture: {
            type: String,
            default: ""
        },

    book: {
        type: String,
        default: ""
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

const tblname = "book"
schema.virtual('full_picture').get(function() {
    let fullpicture = "";
    if (this.picture && this.picture.length > 1){
        fullpicture = _config("app.imageurl")+"/"+this.picture;
    }
    return fullpicture;
});


schema.virtual('full_book').get(function() {
    let fullpicture = "";
    if (this.book && this.book.length > 1){
        fullpicture = _config("app.imageurl")+"/"+this.book;
    }
    return fullpicture;
});



schema.set('toObject', { getters: true,virtuals:true });
schema.set('toJSON', { getters: true,virtuals:true });
// Plugin must be *after* virtuals
schema.plugin(mongooseLeanVirtual);
module.exports = mongoose.model(tblname, schema, tblname);
