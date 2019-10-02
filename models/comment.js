var mongoose = require('mongoose')

var commentSchema = new mongoose.Schema({
    comment :String,    
    postId :String
})
  
var comment =  mongoose.model('comment', commentSchema);
module.exports = comment;