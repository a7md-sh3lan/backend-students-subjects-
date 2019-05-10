
const mongoose = require("mongoose"),
Schema = mongoose.Schema,
path = require("path");

let Subject = new Schema({
    _id: Number,
    name: String
});

module.exports = mongoose.model("subjects", Subject);
