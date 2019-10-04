var mongoose = require('mongoose')

var commentSchema = new mongoose.Schema({
    comment :String,    
    postId :String,
    communityId:String,
    commentedBy:String,
    discussionId:String,
    ownerId:String,
    reply:String
})
  
var comment =  mongoose.model('comment', commentSchema);
module.exports = comment;