const mongoose = require("mongoose");

let commentSchema = new mongoose.Schema({
    text: String,
    author: String
});

let Comment = mongoose.model("Comment", commentSchema);

module.exports = Comment;