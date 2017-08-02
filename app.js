/* =============================== */
/*           REQUIREMENTS          */
/* =============================== */
var express             = require("express");           // our Node.js framework
var mongoose            = require("mongoose");          // our non-relational database
var passport            = require("passport");          // out authentication system
var bodyParser          = require("body-parser");       // our form submission retriever
var LocalStrategy       = require("passport-local");    // specific authentication system

var app = express();                                    // place express into app

/* =============================== */
/*       ADDING MODELS & SEED      */
/* =============================== */
var User                = require("./models/user");     // user model scheme for the database  (dabatase should contain username & password)
var Event               = require("./models/event");    // event model scheme for the database (database should contain title, img, description)
var seedDB              = require("./seeds");           // sample post/image/comments for when page starts up
var Comment             = require("./models/comment");  // comment model scheme for database   (database should have author and comment info)

seedDB();               // call the seed
        
/* =============================== */
/*          CONFIGURATIONS         */
/* =============================== */
app.set("view engine", "ejs");                          // this is so express knows all view files are defaulted .ejs

// database connection
mongoose.connect("mongodb://localhost/groupievents", {useMongoClient: true});
mongoose.Promise = global.Promise;

app.use(express.static(__dirname + "/public"));         // let express know the public directory (for CSS file linking)
app.use(bodyParser.urlencoded({extended:true}));        // let express use bodyParser
app.use(passport.initialize());                         // allow express to use passport authenticator
app.use(passport.session());                            // allow express to use passport session
app.use(require("express-session")({                    // this deals with the session (Not sure what this does actually)
    secret: "I hate going out to events",
    resave: false,
    saveUnitialized: false
}))

// more passport stuff
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


/* ------------------------------------------------------------------- */


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

app.get("/events", function(req, res){
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
app.get("/events/new", function(req, res){
    res.render("events/new");
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
    Event.findById(req.params.id).populate("comments").exec(function(err, foundEvent){
        if(err){
            console.log(err);
        } else {
            res.render("events/show", {eventData: foundEvent})
        }
    });
});

/* =============================== */
/*          COMMENTS ROUTING       */
/* =============================== */

app.get("/events/:id/comments/new", function(req, res){
    Event.findById(req.params.id, function(err, event){
       if(err){
           console.log(err);
       } else {
           res.render("comments/new", {eventData: event});
       }
    });
});

app.post("/events/:id/comments", function(req, res){
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
                    // Interfere with Event's data : "event", by pushing a new comment into into Event's database's item object: "comments"
                    event.comments.push(comment);
                    // Save it
                    event.save();
                    // Redirect towards the original page to see new comment
                    res.redirect("/events/" + event._id)
                }
            });
        }
    });
})

/* =============================== */
/*            AUTH ROUTES          */
/* =============================== */

// Request to render the register.ejs file
app.get("/register", function(req, res){
    res.render("register");
})

app.post("/register", function(req, res){
    // Create a new User with specific username
    var newUser = new User({username: req.body.username});
    // Register that user with a password (it'll be hashed)
    User.register(newUser, req.body.password, function(err, user){
        if(err){
            // If there's an error, return to the register page again
            console.log(err);
            return res.render("register");
        }
        // If there's no issue, it'll authenticate it and if authenticated, it'll return you to the events page
        passport.authenticate("local")(req, res, function(){
            res.redirect("/events"); 
        });
    })
});

/* =============================== */
/*          CHECKING SERVER        */
/* =============================== */

app.listen(process.env.PORT, process.env.IP, function(){
    console.log("groupievent server is fully functional, Bryan.");
});