var mongoose = require('mongoose');

var repliesSchema = new mongoose.Schema({
    reply: {
        type: String,
    },
    commentId: {
        type: String,
    },
    repliedBy: {
        type: String,
    },
    ownerId: {
        type: String,
    },
    discussionId: {
        type: String,
    }
})

var relpies = mongoose.model('replies', repliesSchema);
module.exports = relpies;