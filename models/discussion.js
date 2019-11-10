var mongoose = require('mongoose');

var discussionSchema = new mongoose.Schema({
    title: String,
    description: String,
    tag: String,
    communityName: String,
    communityId: String,
    createdDate: String,
    ownerId: String,
    createdBy: String,
})

var discussion = mongoose.model('discussiones', discussionSchema);
module.exports = discussion;