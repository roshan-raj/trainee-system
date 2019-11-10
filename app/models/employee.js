// app/models/user.js
// load the things we need
var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');

// define the schema for our user model
var employeeSchema = mongoose.Schema({
    empid: String,
    name: String,
    email: String,
    password: String,
    designation: String,
    marks : {
        java:  String,
        sql: String,
        unix: String,
        web: String,
    },
    proofs : {
        pan: String,
        aadhaar: String,
    },
    social : {
        twitter: String,
        linkedin: String,
    },
    college : {
        name: String,
        percentage: Number,
    },
    university : {
        name: String,
        percentage: Number,
    },
    school : {
        name: String,
        percentage: Number,
    },
    phone : String,
});

// generating a hash
employeeSchema.methods.generateHash = function (password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(10), null);
};

// checking if password is valid
employeeSchema.methods.validPassword = function (password) {
    return bcrypt.compareSync(password, this.password);
};

// create the model for users and expose it to our app
module.exports = mongoose.model('Employee', employeeSchema);