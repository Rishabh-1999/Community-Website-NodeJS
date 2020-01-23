var mongoose = require('mongoose');
var tag = new mongoose.Schema({
  tagname: {
    type: String,
    unique: true,
    required: true
  },
  createdby: {
    type: String,
    required: true
  },
  createddate: {
    type: String,
    required: true
  },
  deleted: {
    type: String,
    default: "0"
  }
})

var tagmodel = mongoose.model('taglists', tag);
module.exports = tagmodel;