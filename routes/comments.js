/* =============================== */
/*           REQUIREMENTS          */
/* =============================== */

var express         = require("express");
var router          = express.Router();

var Event           = require("../models/event");
var Comment         = require("../models/comment");

/* =============================== */
/*            ADDING ROUTE         */
/* =============================== */

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
                    req.flash("success", "Succesfully added comment");
                    res.redirect("/events/" + event._id)
                }
            });
        }
    });
})

/* =============================== */
/*             EDIT ROUTE          */
/* =============================== */

router.get("/events/:id/comments/:comment_id/edit", checkCommentAdmin, function(req, res){
    Comment.findById(req.params.id, function(err, foundComment){
        if(err){
            res.redirect("back");
        } else {
            res.render("comments/edit", {eventData_id: req.params.id, comment: req.params.comment_id})
        }
    })
});

router.put("/events/:id/comments/:comment_id", checkCommentAdmin, function(req, res){
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment){
        if(err){
            res.redirect("back");
        } else {
            res.redirect("/events/" + req.params.id);
        }
    })
})

/* =============================== */
/*           DELETE ROUTE          */
/* =============================== */

router.delete("/events/:id/comments/:comment_id", checkCommentAdmin, function(req, res){
    Comment.findByIdAndRemove(req.params.comment_id, function(err){
        if(err){
            res.redirect("back");
        } else {
            res.redirect("/events/" + req.params.id)
        }
    })
});

/* =============================== */
/*            MIDDLEWARE           */
/* =============================== */

function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("error", "Unfortunately you need to be logged in to do that - Bryan");
    res.redirect("/login");
}

function checkCommentAdmin(req, res, next){
    if(req.isAuthenticated()){
        Event.findById(req.params.comment_id, function(err, foundComment){
            if(err){
                res.redirect("back");
            } else {
                // Check if the Database's Event Model has a AUTHOR that equals (Mongoose method) to the current USER ID
                if(req.user.username == 'bryantran97') {
                    next();
                } else {
                    res.redirect("back");
                }
            }
        })
    } else {
        res.redirect("back");
    }
}

module.exports = router;