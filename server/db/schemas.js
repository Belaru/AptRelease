/* eslint-disable camelcase */
// Requiring module 
const mongoose = require('mongoose'); 

// Release Schema
const leaseSchema = new mongoose.Schema({
    postedDate: String, 
    bhk: Number,
    rentPrice: Number,
    size: Number,
    floor: String,
    address: String,
    city: String,
    furnishing: String,
    preferredTentant: String,
    bathroom: Number,
    pointOfContact: String,
    description: String,
    images: Array,
    reports: Number
}); 

const lease = mongoose.model('lease', leaseSchema); 

const userSchema = new mongoose.Schema({
    name: String,
    email: String,
    picture: String,
    leases: Array
});

const user = mongoose.model('user', userSchema);

// Exporting our model objects 
module.exports = { 
    leases : lease,
    users : user
};