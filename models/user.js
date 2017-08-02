var mongoose = require("mongoose");
var passportLocalMongoose = require("passport-local-mongoose");

var UserSchema = new mongoose.Schema({
    username: String,
    password: String
});

// allows us to add methods to User in regards to passport
UserSchema.plugin(passportLocalMongoose);
// export it
module.exports = mongoose.model("User", UserSchema);