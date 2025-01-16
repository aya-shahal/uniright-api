let mongoose = require("mongoose");
const mongooseLeanVirtual = require('mongoose-lean-virtuals');
let schema = mongoose.Schema({
    student: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "student",
        },
    feestype: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "feestype",
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
            default: 0 // unpaid
        }
    }, {
        versionKey: false,
        timestamps: true
    }
);

const tblname = "fees";





schema.statics.AddInvoice = async function (userid,slug="transferfalcon",AthleteId="",newfalconname="",operation="",toowner="") {
    console.log("AddInvoice",slug,AthleteId,newfalconname)
    let feestypeinfo = await FeesType.findOne({slug:slug}).exec()
    let newdata = new Fees();
    newdata.user = userid;
    newdata.invoicedate = "2-12-2022";
    newdata.qty = 1;
    if(feestypeinfo){
        newdata.feestype = feestypeinfo.id;
        newdata.AthleteId = AthleteId;
        newdata.newfalconname = newfalconname;
        newdata.operation = operation;
        newdata.toowner = toowner;
        newdata.invoicenumber =  await Settings.grabinvoicenumber();
        await newdata.save();
    }else{
        console.log("fees type not found")
    }

    return newdata;

};




schema.virtual('fullpicture').get(function() {
    let fullpicture = "";
    if (this.picture && this.picture.length > 2){
        fullpicture = _config("app.imageurl")+"/"+this.picture;
    }
    return fullpicture;
});


schema.set('toObject', { getters: true,virtuals:true });
schema.set('toJSON', { getters: true,virtuals:true });
// Plugin must be *after* virtuals
schema.plugin(mongooseLeanVirtual);


module.exports = mongoose.model(tblname, schema, tblname);
