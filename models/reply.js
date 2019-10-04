var mongoose = require('mongoose');

var repliesSchema = new mongoose.Schema({
    title: String,
    description : String,
    communityId: String,
    createdDate: String,
    ownerId: String,
    createdBy:String,
})

var relpies = mongoose.model('replies', repliesSchema);
module.exports = relpies;