var mongoose = require('mongoose');
var tag = new mongoose.Schema({
    tagname:{type:String},
    createdby:{type:String},
    createddate:{type:String},
    deleted:{type:String,default:"0"}
  })

var tagmodel =  mongoose.model('taglists', tag);
module.exports = tagmodel;