var mongoose = require("mongoose");
var Event = require("./models/event");
var Comment = require("./models/comment");

// Sample Data
var eventData = [
    {
        name: "Gaming Center LAN Party",
        image: "https://www.geforce.com/sites/default/files-world/attachments/lan-1.png",
        description: "Gaming Center in Plano, TX. We are playing video games at this game stop and hosting mini tournaments for Smash Bros. We are all playing destiny, board games (DnD) and more. Come join us!"
    },
    {
        name: "Picnic, Downtown Dallas Park",
        image: "http://hngideas.com/wp-content/uploads/2016/06/DIY-picnic-table-1.jpg",
        description: "We are having a Picnic in Dallas Park, the most amazing place in Dallas! It is super friendly, birds chirping and flying freely, and most importantly, nice people! Picnic is open for ALL, come on in, free burgers and drinks."
    },
    {
        name: "Pool Party",
        image: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/92/Backyardpool.jpg/1200px-Backyardpool.jpg",
        description: "I'm having a pool party in Murph, Texas. We are a group of mid-20's young professionals looking to have fun and party! We'll be rocking to (decently) loud 90's grunge and dancing around the pool. There will be free food, drinks, and alchohol if you're above 21. Come join the fun! Comment me for more details and I'll message you!"
    },
]

// Export this FUNCTION whenever the app.js is ran
function seedDB(){
    console.log("I am fed into the system");
    // Remove every item
    Event.remove({}, function(err){
        if(err){
            console.log(err);
        } else {
            // If remove is success, then for EACH item in the sample list (note: seed contains all the object info of EACH sample eventData)
            eventData.forEach(function(seed){
                // Access the Events Database and Create some Sample Data (seed)
                Event.create(seed, function(err, data){
                    console.log("I've added a sample event");
                    if(err){
                        console.log(err);
                    } else {
                        console.log("I've created a sample comment.");
                        // Access the Comment Database and create a comment
                        Comment.create({
                            text: "Hey man, this place is awesome sauce!",
                            author: "Homer"
                        }, function(err, comment){
                            if(err){
                                console.log(err);
                            } else {
                                data.comments.push(comment);
                                data.save();
                            }
                        });
                    }
                });
            })
        }
    });
};

module.exports = seedDB;