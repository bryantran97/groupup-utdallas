var mongoose = require("mongoose");

var eventSchema = new mongoose.Schema({
    title: String,
    image: String,
    description: String,
    author: {
        // retrieve user's ID
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        // and as well as the username
        username: String
    },
    comments: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Comment"
        }
    ]
});

module.exports = mongoose.model("Event", eventSchema);