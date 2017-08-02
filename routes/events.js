var express         = require("express");
var router          = express.Router();

var Event           = require("../models/event");

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
router.get("/events/new", function(req, res){
    res.render("events/new");
});

// After Clicking the SUBMIT button on the New page, RUN THIS.
// It'll make a POST request to the /events page
router.post("/events", function(req, res){
    console.log("I made a post request");
    // Request the information from the forms (using body-parser)
    var eventTitle = req.body.titleOfEvent;
    var eventImageURL = req.body.imgURL;
    var eventDescription = req.body.description;
    
    // If there was a post request made, post it to the DATABASE
    var newEventPost = {title: eventTitle, image: eventImageURL, description: eventDescription};
    
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

module.exports = router;