/* =============================== */
/*           REQUIREMENTS          */
/* =============================== */
var express             = require("express");           // our Node.js framework
var mongoose            = require("mongoose");          // our non-relational database
var passport            = require("passport");          // out authentication system
var bodyParser          = require("body-parser");       // our form submission retriever
var LocalStrategy       = require("passport-local");    // specific authentication system
var methodOverride      = require("method-override");   // so we can make update/delete requests
var flash               = require("connect-flash");     // allows flash pop up messages

var app = express();                                    // place express into app

/* =============================== */
/*       ADDING MODELS & SEED      */
/* =============================== */
var User                = require("./models/user");     // user model scheme for the database  (dabatase should contain username & password)
var Event               = require("./models/event");    // event model scheme for the database (database should contain title, img, description)
var seedDB              = require("./seeds");           // sample post/image/comments for when page starts up
var Comment             = require("./models/comment");  // comment model scheme for database   (database should have author and comment info)

// seedDB();            // call the seed (Using it to reset)

/* =============================== */
/*         ADDING IN ROUTES        */
/* =============================== */

// Refactored code by putting routes into separate files
var eventRoutes         = require("./routes/events");   // retrieve routes from these three files
var commentRoutes       = require("./routes/comments");
var authRoutes          = require("./routes/auth");

/* =============================== */
/*          CONFIGURATIONS         */
/* =============================== */
app.set("view engine", "ejs");                          // this is so express knows all view files are defaulted .ejs
app.use(methodOverride("_method"));                     // adding method indicator
app.use(flash());

// database connection
mongoose.connect("mongodb://localhost/groupievents", {useMongoClient: true});
mongoose.Promise = global.Promise;

app.use(express.static(__dirname + "/public"));         // let express know the public directory (for CSS file linking)
app.use(bodyParser.urlencoded({extended:true}));        // let express use bodyParser
app.use(require("express-session")({                    // this deals with the session (Not sure what this does actually)
    secret: "I'm a panda bear",
    resave: false,
    saveUnitialized: false
}));
app.use(passport.initialize());                         // allow express to use passport authenticator
app.use(passport.session());                            // allow express to use passport session

// more passport stuff
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// for all pages at all times, give the currentUser variable the req.user info
app.use(function(req, res, next){                       // this is so user's info can be spread throughout all pages
   res.locals.currentUser       = req.user;             // *** REALLY USEFUL FOR WHEN USERS ARE IN A SESSION ***
   res.locals.success           = req.flash("success");    // success flash message
   res.locals.error             = req.flash("error");      // error flash message
   next();
});

app.use(authRoutes);                                    // adding in routes so we can use them
app.use(commentRoutes);
app.use(eventRoutes);


/* =============================== */
/*          CHECKING SERVER        */
/* =============================== */

// this will listen into the server and tell me if the server is fuctioning properly
app.listen(process.env.PORT, process.env.IP, function(){
    console.log("groupievent server is fully functional, Bryan.");
});