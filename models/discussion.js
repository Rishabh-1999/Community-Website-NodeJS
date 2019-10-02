var mongoose = require('mongoose');

var discussionSchema = new mongoose.Schema({
    title: String,
    description : String,
    communityid: String,
    createdBy: String,
    createdDate: String,
    ownerId: String,
})

var discussion = mongoose.model('discussiones', discussionSchema);
module.exports = discussion;