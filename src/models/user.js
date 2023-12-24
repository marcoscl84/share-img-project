let mongoose = require("mongoose");

let user = new mongoose.Schema({
    name: String,
    email: String,
    password: String
});

module.exports = user;