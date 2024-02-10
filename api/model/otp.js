const mongoose = require('mongoose');

const OtpSchema = new mongoose.Schema({
    _id:mongoose.Schema.Types.ObjectId,
    gmail: String,
    appId: String,
    ip: String,
    status:Boolean,
    otp:String,
    attepts:Number,
    dateTime:Date
});

module.exports = mongoose.model('Otp',OtpSchema);