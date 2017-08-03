var express         = require("express");
var router          = express.Router();

var Event           = require("../models/event");
var User            = require("../models/user");

/* =============================== */
/*           LANDING PAGE          */
/* =============================== */

// Make a GET request to our LANDING page
/* Note: We are rendering a file called landing.ejs in the "views" folder in our project
         We do NOT have to specifically say landing.ejs because we added an EJS packet to deal with that */
         
router.get("/", function(req, res){
   res.redirect("/events");
});

/* =============================== */
/*            EVENTS PAGE          */
/* =============================== */

router.get("/events", function(req, res){
    // Every time yo make a GET request to  this page retrieve ALL items from the database
    Event.find({}, function(err, allEvents){
       if(err){
           console.log(err);
       } else {
           // Render the index.ejs page AND import listOfEvents data (contains all event objects in the database)
           res.render("events/index", {listOfEvents: allEvents});
       }
    });
});

/* =============================== */
/*          NEW EVENT PAGE         */
/* =============================== */

// Request the NEW page
router.get("/events/new", isLoggedIn, function(req, res){
    res.render("events/new");
});

// After Clicking the SUBMIT button on the New page, RUN THIS.
// It'll make a POST request to the /events page
router.post("/events", isLoggedIn, function(req, res){
    console.log("I made a post request");
    // Request the information from the forms (using body-parser)
    var eventTitle = req.body.titleOfEvent;
    var eventImageURL = req.body.imgURL;
    var eventDescription = req.body.description;
    
    var authorOfPost = {
        id: req.user._id,
        username: req.user.username
    }
    
    // If there was a post request made, post it to the DATABASE
    var newEventPost = {title: eventTitle, image: eventImageURL, description: eventDescription, author: authorOfPost};
    
    // Then access the Database for EVENT and place in items if no error occurs
    Event.create(newEventPost, function(err, newlyCreated){
        if(err){
            console.log(err);
        } else {
            // It'll redirect to the /events page (Automatically GET);
            res.redirect("/events");
        }
    })
});

/* =============================== */
/*        SHOW SPECIFIC EVENT      */
/* =============================== */

router.get("/events/:id", function(req, res){
    // Find event with specific ID provided
    Event.findById(req.params.id).populate("comments").exec(function(err, foundEvent){
        if(err){
            console.log(err);
        } else {
            res.render("events/show", {eventData: foundEvent})
        }
    });
});

/* =============================== */
/*        EDIT SPECIFIC EVENT      */
/* =============================== */

// make a request to go to edit page
router.get("/events/:id/edit", checkEventOwnership, function(req, res){
    
    Event.findById(req.params.id, function(err, foundEvent){
        if(err){
            console.log(err);
        } else {
            console.log(foundEvent);
            // go to editing page
            res.render("events/edit", {eventData: foundEvent});
        }
    });
});

router.put("/events/:id", checkEventOwnership, function(req, res){
    // Access the Database and Find event with specific ID provided and Update
    // req.params.event refers to the NAME="event[title]" and "event[image]" on edit.ejs
    Event.findByIdAndUpdate(req.params.id, req.body.event, function(err, updatedEvent){
        if(err){
            res.redirect("/events");
        } else {
            // redirect to the original show page
            res.redirect("/events/" + req.params.id);
        }
    });
});

/* =============================== */
/*        DELE SPECIFIC EVENT      */
/* =============================== */

// Access the delete page
router.delete("/events/:id", checkEventOwnership, function(req, res){
    // If event exists, delete it
    Event.findByIdAndRemove(req.params.id, function(err){
        if(err){
            res.redirect("/events");
        } else {
            res.redirect("/events");   
        }
    })
});


/* =============================== */
/*             MIDDLEWARE          */
/* =============================== */

// Checks if User is logged in
function isLoggedIn(req, res, next){
    // If user is authenticated
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}

// Check is User is Owner
function checkEventOwnership(req, res, next){
    if(req.isAuthenticated()){
        Event.findById(req.params.id, function(err, foundEvent){
            if(err){
                res.redirect("/events");
            } else {
                // Check if the Database's Event Model has a AUTHOR that equals (Mongoose method) to the current USER ID
                if(foundEvent.author.id.equals(req.user._id) || req.user.username == 'bryantran97') {
                    next();
                } else {
                    res.redirect("/events");
                }
            }
        })
    } else {
        res.redirect("/events");
    }
}

module.exports = router;