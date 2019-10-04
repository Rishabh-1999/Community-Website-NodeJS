var mongoose = require('mongoose');

var repliesSchema = new mongoose.Schema({
    reply: String,
    commentId : String,
    repliedBy: String,
    ownerId: String,
    discussionId: String
})

var relpies = mongoose.model('replies', repliesSchema);
module.exports = relpies;