var express         = require("express");
var router          = express.Router();

var Event           = require("../models/event");
var Comment         = require("../models/comment");

// Adding a new comment
router.get("/events/:id/comments/new", isLoggedIn, function(req, res){
    Event.findById(req.params.id, function(err, event){
       if(err){
           console.log(err);
       } else {
           res.render("comments/new", {eventData: event});
       }
    });
});


// Post request of new comment
router.post("/events/:id/comments", isLoggedIn, function(req, res){
    // Look up events by their ID, retrieve info and put into "event"
    Event.findById(req.params.id, function(err, event){
        if(err){
            console.log(err);
            res.redirect("/events");
        } else {
            // Access the comments DB and create a comment with the object "comment" from the new comment form page
            // Push the object into "comment"
            Comment.create(req.body.comment, function(err, comment){
                if(err){
                    console.log(err);
                } else {
                    
                    // Access comment schema and manually place in Author's ID and Username
                    // req.user.id is valid because USER is created and put into the session as soon as you login (login route on index.js)
                    comment.author.id = req.user.id;
                    comment.author.username = req.user.username;
                    comment.save();
                    
                    // Interfere with Event's data : "event", by pushing a new comment into into Event's database's item object: "comments"
                    event.comments.push(comment);
                    event.save();
                    // Redirect towards the original page to see new comment
                    res.redirect("/events/" + event._id)
                }
            });
        }
    });
})

// Middleware
function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}

module.exports = router;