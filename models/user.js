var mongoose = require("mongoose");
var passportLocalMongoose = require("passport-local-mongoose");

var UserSchema = new mongoose.Schema({
    username: String,
    password: String,
});

UserSchema.plugin(passportLocalMongoose); // allows us to add methods to User in regards to passport
module.exports = mongoose.model("User", UserSchema);