var mongoose = require('mongoose');

var discussionSchema = new mongoose.Schema({
    title: String,
    details: String,
    tag: String,
    communityName: String,
    createdBy: String,
    createdDate: String,
    ownerId: String,
})

var discussion = mongoose.model('discussiones', discussionSchema);
module.exports = discussion;