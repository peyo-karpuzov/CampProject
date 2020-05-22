// initials
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const port = 3000;

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));

// app variables
let campingSites = [
    {name: "Rila Lakes Area Camping Site", image: "/pictures/rilaLakes.png"},
    {name: "Smolyan Lakes Area", image: "/pictures/smolyanLakes.jpg"},
    {name: "Botev Peak", image: "/pictures/botevPeak.jpg"},
    {name: "Central Denube area", image: "/pictures/centralDanube.jpg"},
    {name: "Sofia outskirts", image: "/pictures/sofiaOutskirts.jpg"}
];

// DB, Schema and Model
mongoose.connect("mongodb://localhost:27017/campgrounds", {useNewUrlParser: true, useUnifiedTopology: true});
let campgroundSchema = new mongoose.Schema({
    name: String,
    image: String,
    description: String
});
let Campground = mongoose.model("Campground", campgroundSchema);

// routes
app.get("/", function(req, res) {
    res.render("landing");
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

app.post("/campgrounds", function(req, res) {
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

app.get("/campgrounds/new", function(req, res) {
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

// server
app.listen(port, () => console.log("AppServer started."));