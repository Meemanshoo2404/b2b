const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    appId: {
        type: String,
        require: true
    },
    ip: {
        type: String,
        require: true
    },
    firstName: {
        type: String,
    },
    lastName: {
        type: String,
    },
    userName: {
        type: String,
    },
    gmail: {
        type: String,
        required: true,
    },
    phoneNo: {
        type: String,
    },
    password: {
        type: String,
        required: true,
    },
    gender: {
        type: String
    },
    status: {// -2 deleted , -1 blocked, 0 disable , 1 active
        type: Number,
        default: 1
    },
    address: {
        type: String,
    },
    city: {
        type: String,
    },
    state: {
        type: String,
    },
    country: {
        type: String,
    },
    pin: {
        type: String,
    },
    dob:{
        type: Date,
        default: new Date(0),
    },
    updatedData:{
        type: Date,
        default: new Date(0),
    },
    createdData:{
        type: Date,
        default: Date.now(),
    },
});

module.exports = mongoose.model('Users',userSchema);