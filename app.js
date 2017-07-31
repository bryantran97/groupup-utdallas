/* =============================== */
/*          REQUIRING STUFF        */
/* =============================== */
// Retrieve the Express Package and Require It
var express = require("express");
var app = express();

// Require Body-Parser -- This is so we can abstract submitted items from forms in "events/new"
var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended:true})); // Always have this in

// Use EJS package so we don't have to write ".ejs" when we render
app.set("view engine", "ejs");

/* =============================== */
/*           LANDING PAGE          */
/* =============================== */

// Make a GET request to our LANDING page
/* Note: We are rendering a file called landing.ejs in the "views" folder in our project
         We do NOT have to specifically say landing.ejs because we added an EJS packet to deal with that */
app.get("/", function(req, res){
   res.render("landing");
});

/* =============================== */
/*            EVENTS PAGE          */
/* =============================== */

var events = [
    {name: "Gaming Center LAN Party", image: "https://www.geforce.com/sites/default/files-world/attachments/lan-1.png"},
    {name: "Picnic, Downtown Dallas Park", image: "http://hngideas.com/wp-content/uploads/2016/06/DIY-picnic-table-1.jpg"},
    {name: "Beach Party, Houston(TX)", image: "http://ww3.hdnux.com/photos/57/16/74/12381958/5/920x920.jpg"}
]

app.get("/events", function(req, res){
    res.render("events", {listOfEvents: events});
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
    // Request the information from the forms (using body-parser)
    var eventName = req.body.titleOfEvent;
    var eventImageURL = req.body.imgURL;
    var eventDescription = req.body.descriptionOfEvent;
    
    // It'll redirect to the /events page (Automatically GET);
    res.redirect("/events");
});

/* =============================== */
/*          CHECKING SERVER        */
/* =============================== */

app.listen(process.env.PORT, process.env.IP, function(){
    console.log("groupievent server is fully functional, Bryan.");
});