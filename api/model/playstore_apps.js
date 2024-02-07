const mongoose = require('mongoose');

const playStoreAppSchema = new mongoose.Schema({
    packageName: {
        type: String,
        required: true,
    },
    categoryType: {
        type: String,
        default: "Lorem"
    },
    status: { // -1 : Delete status , 0 : Draft(under maintainence) status, 1 : Publish status, -2 permanent delete
        type: Number,
        default: 0
    },
    deviceType: {
        type: String,
        default: "Lorem"
    },
    frontImage: {
        type: String,
        default: "https://placehold.co/480x360"
    },
    iconImage:{
        type: String,
        default: "https://placehold.co/64x64"
    },
    title:{
        type: String,
        default: "Lorem Ipsum is simply"
    },
    category:{
        type: String,
        default: "Lorem Ipsum"
    },
    rating:{
        type: Number,
        default: 1
    },
    isIpAllowed:{
        type: Boolean,
        default: false
    },
    ipCap:{
        type: Number,
        default: 5
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

module.exports = mongoose.model('PlayStoreApps',playStoreAppSchema);