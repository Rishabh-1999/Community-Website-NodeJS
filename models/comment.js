var mongoose = require('mongoose')

var commentSchema = new mongoose.Schema({
    "comment": {
        type: String,
        required: true,
        trim: true
    },
    "postId": {
        type: String,
    },
    "communityId": {
        type: String,
    },
    "commentedBy": {
        type: String,
    },
    "discussionId": {
        type: String,
    },
    "ownerId": {
        type: String,
    },
    "reply": {
        type: String,
    }
})

var comment = mongoose.model('comment', commentSchema);
module.exports = comment;