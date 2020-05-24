const mongoose = require("mongoose"),
      Campground = require("./campground"),
      Comment = require("./comment");

// app variables
let campingSites = [
    {name: "Rila Lakes Area Camping Site", image: "/pictures/rilaLakes.png", description: "The place is high, closing on Heaven!"},
    {name: "Smolyan Lakes Area", image: "/pictures/smolyanLakes.jpg", description: "So peaceful: the best strawberries ever!"},
    {name: "Botev Peak", image: "/pictures/botevPeak.jpg", description: "Fly high, touch the sky :)"},
    {name: "Central Denube area", image: "/pictures/centralDanube.jpg", description: "Best place ever. Always come back here :) Always!"},
    {name: "Sofia outskirts", image: "/pictures/sofiaOutskirts.jpg", description: "Capital, city and nature, surrounded by snowy peaks."}
];

async function seed() {
    try {
        await Campground.remove({});
        for(const site of campingSites) {
            let newCamp = await Campground.create(site);
            let commentA = await Comment.create({
                text: "I've been here. I highly recommend the place. 6 stars out of 5 :)",
                author: "Pencho"
            });
            let commentB = await Comment.create({
                text: "Best place ever. Mind the mosquitos, though",
                author: "Kichka"
            });
            newCamp.comments.push(commentA);
            newCamp.comments.push(commentB);
            newCamp.save();
            console.log(newCamp);
        }
    } catch(err) {
        console.log(err);
    }
}

module.exports = seed;