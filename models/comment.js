var mongoose = require("mongoose");

var commentSchema = mongoose.Schema({
    text: String,
    // for the author's comment
    author: {
        // retrieve user's ID
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        // and as well as the username
        username: String
    }
});

module.exports = mongoose.model("Comment", commentSchema);