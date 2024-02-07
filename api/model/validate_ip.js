const mongoose = require('mongoose');

const validateIpSchema = new mongoose.Schema({
    ip: {
        type: String,
        required: true,
    },
    appId:{
        type: String,
        required: true,
    },
    isActivated:{
        type: Boolean,
        default: false
    },
    message:{
        type: String,
        default: "You are Blocked. Please contact to support team for further details"
    },
    apiIsActivated: {
        type: [{ type: Object }],
    },
    uploadDate: {
        type: Date,
        default: Date.now()
    },
    updateDate: {
        type: Date,
        default: Date.now()
    },
});

module.exports = mongoose.model('ValidateIp',validateIpSchema);