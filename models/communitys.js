var mongoose = require('mongoose')

var UsersNames = require('./usernames');
var Schema = mongoose.Schema,
  ObjectId = Schema.ObjectId;

var communitys = new mongoose.Schema({
  "photoloc": String,
  "name": {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  "members": {
    type: String
  },
  "rule": {
    type: String,
    required: true
  },
  "communityloc": {
    type: String
  },
  "createdate": {
    type: String,
    required: true
  },
  "description": {
    type: String,
    defualt: ""
  },
  "owner": {
    type: String,
    required: true
  },
  "status": {
    type: String,
    required: true
  },
  "ownerid": {
    type: String,
    required: true
  },
  "request": [{
    'type': mongoose.Schema.Types.ObjectId,
    'ref': UsersNames
  }],
  "managers": [{
    'type': mongoose.Schema.Types.ObjectId,
    'ref': UsersNames
  }],
  "invited": [{
    'type': mongoose.Schema.Types.ObjectId,
    'ref': UsersNames
  }],
  "users": [{
    'type': mongoose.Schema.Types.ObjectId,
    'ref': UsersNames
  }]
})

var communitys = mongoose.model('communitys', communitys);
module.exports = communitys;