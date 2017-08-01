/* =============================== */
/*          REQUIRING STUFF        */
/* =============================== */
// Retrieve the Express Package and Require It
var express = require("express");
var app = express();

var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended:true})); // Always have this in

// Retrieve Mongoose
var mongoose = require("mongoose");
mongoose.connect("mongodb://localhost/groupievents", {useMongoClient: true});
mongoose.Promise = global.Promise;

// Use EJS package so we don't have to write ".ejs" when we render
app.set("view engine", "ejs");

/* =============================== */
/*         DATABASE SCHEMA         */
/* =============================== */

// Creating scheme and model for the events
var eventSchema = new mongoose.Schema({
    title: String,
    image: String,
    description: String
});
var Event = mongoose.model("Event", eventSchema);


/* =============================== */
/*           LANDING PAGE          */
/* =============================== */

// Make a GET request to our LANDING page
/* Note: We are rendering a file called landing.ejs in the "views" folder in our project
         We do NOT have to specifically say landing.ejs because we added an EJS packet to deal with that */
app.get("/", function(req, res){
   res.redirect("/events");
});

/* =============================== */
/*            EVENTS PAGE          */
/* =============================== */

// var events = [
//     {name: "Gaming Center LAN Party", image: "https://www.geforce.com/sites/default/files-world/attachments/lan-1.png"},
//     {name: "Picnic, Downtown Dallas Park", image: "http://hngideas.com/wp-content/uploads/2016/06/DIY-picnic-table-1.jpg"},
//     {name: "Beach Party, Houston(TX)", image: "http://ww3.hdnux.com/photos/57/16/74/12381958/5/920x920.jpg"}
// ]

app.get("/events", function(req, res){
    // Every time yo make a GET request to  this page retrieve ALL items from the database
    Event.find({}, function(err, allEvents){
       if(err){
           console.log(err);
       } else {
           res.render("events", {listOfEvents: allEvents});
       }
    });
});

/* =============================== */
/*          NEW EVENT PAGE         */
/* =============================== */

// Request the NEW page
app.get("/events/new", function(req, res){
    res.render("new");
});

// After Clicking the SUBMIT button on the New page, RUN THIS.
// It'll make a POST request to the /events page
app.post("/events", function(req, res){
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

app.get("/events/:id", function(req, res){
    // Find event with specific ID provided
    Event.findById(req.params.id, function(err, foundEvent){
        if(err){
            console.log(err);
        } else {
            res.render("show", {eventData: foundEvent})
        }
    });
});

/* =============================== */
/*          CHECKING SERVER        */
/* =============================== */

app.listen(process.env.PORT, process.env.IP, function(){
    console.log("groupievent server is fully functional, Bryan.");
});