/* =============================== */
/*           REQUIREMENTS          */
/* =============================== */
var passport        = require("passport");
var express         = require("express");
var router          = express.Router();

var User            = require("../models/user");

/* =============================== */
/*            REGISTERING          */
/* =============================== */
// making get request to register page
router.get("/register", function(req, res){
    res.render("register");
})

// posting to the register
router.post("/register", function(req, res){
    // create a new User with specific username
    var newUser = new User({username: req.body.username});
    // register that user with a password (it'll be hashed)
    User.register(newUser, req.body.password, function(err, user){
        if(err){
            // if there's an error, return to the register page again
            console.log(err);
            return res.render("register", {error: err.message});
        }
        // if there's no issue, it'll authenticate it and if authenticated, it'll return you to the events page
        passport.authenticate("local")(req, res, function(){
            req.flash("success", "Welcome to GroupUp " + user.username + ". Read the RULES first before posting! - Bryan");
            res.redirect("/events"); 
        });
    })
});

/* =============================== */
/*             LOGGING IN          */
/* =============================== */

// request log in page
router.get("/login", function(req, res){
    res.render("login");
})

// authenticate user
router.post("/login", passport.authenticate("local", 
    {   successRedirect: "/events", 
        failureRedirect: "/login"
    }), function(req, res){
});

/* =============================== */
/*            LOGGING OUT          */
/* =============================== */

// log out request
router.get("/logout", function(req, res){
    req.flash("success", "Succesfully logged you out, have a great day! - Bryan")
    req.logout();
    res.redirect("/events");
});

// export module
module.exports = router;