// imports
const express = require("express"),
      app = express(),
      bodyParser = require("body-parser"),
      mongoose = require("mongoose"),
      passport = require("passport"),
      LocalStrategy = require("passport-local"),
      session = require("express-session");


// app configuration
const port = 3000;

app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(bodyParser.urlencoded({extended: true}));

// app variables
let campingSites = [
    {name: "Rila Lakes Area Camping Site", image: "/pictures/rilaLakes.png"},
    {name: "Smolyan Lakes Area", image: "/pictures/smolyanLakes.jpg"},
    {name: "Botev Peak", image: "/pictures/botevPeak.jpg"},
    {name: "Central Denube area", image: "/pictures/centralDanube.jpg"},
    {name: "Sofia outskirts", image: "/pictures/sofiaOutskirts.jpg"}
];

// DB
mongoose.connect("mongodb://localhost:27017/campgrounds", {useNewUrlParser: true, useUnifiedTopology: true});
let Campground = require("./models/campground"),
    User = require("./models/user");

// Authentication config
app.use(session({
    secret: "We are the champions, my friend!",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next) {
    res.locals.currentUser = req.user;
    next();
});

// routes
app.get("/", function(req, res) {
    res.render("landing");
});

app.get("/register", function(req, res) {
    res.render("register");
});

app.post("/register", function(req, res) {
    let newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, function(err, user) {
        if (err) {
            res.redirect("/register");
        }
        passport.authenticate("local")(req, res, function(){
            res.redirect("/campgrounds");
        });
    });
});

app.get("/login", function(req, res) {
    res.render("login");
});

app.post("/login", passport.authenticate("local", {
    successRedirect: "/campgrounds",
    failureRedirect: "/login"
}), function(req, res){});

app.get("/logout", function(req, res) {
    req.logout();
    res.redirect("/campgrounds");
});

app.get("/campgrounds", function(req, res) {
    Campground.find({}, function(err, campground) {
        if (err) {
            console.log("Some sort of error, man! :(")
            console.log(err);
        } else {
            console.log(campground);
            res.render("index", {camps: campground});
        }
    });
});

app.post("/campgrounds", isLoggedIn, function(req, res) {
    let name = req.body.name;
    let image = req.body.image;
    let description = req.body.description;
    let newCampground = {name: name, image: image, description: description};
    
    Campground.create(newCampground, function(err, campground) {
        if (err) {
            console.log("There is an error: something happened.");
            console.log(err);
        } else {
            console.log(campground);
            res.redirect("/campgrounds");
        }
    });
});

app.get("/campgrounds/new", isLoggedIn, function(req, res) {
    res.render("new");
});

app.get("/campgrounds/:id", function(req, res) {
    Campground.findById(req.params.id, function(err, campground) {
        if (err) {
            console.log(err);
        } else {
            res.render("show", {campground: campground});
        }
    });
});

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    } 
    res.redirect("/login");
};

// server
app.listen(port, () => console.log("AppServer started."));