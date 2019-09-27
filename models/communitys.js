var mongoose = require('mongoose')

var UsersNames = require('./usernames');

var communitys = new mongoose.Schema({
    "photoloc":String,
    "name":{type:String,required:true,unique:true,trim:true},
    "members":{type:String},
    "rule":{type:String},
    "communityloc":{type:String},
    "createdate":{type:Date},
    "description":{type:String},
    "owner":{type:String},
    "status":{type:String},
    "ownerid":{type:String},
    "request":[{'type': mongoose.Schema.Types.ObjectId , 'ref':UsersNames}],
    "managers":[{'type': mongoose.Schema.Types.ObjectId , 'ref':UsersNames}],
    "invited":[{'type': mongoose.Schema.Types.ObjectId , 'ref':UsersNames}],
    "users": [{'type': mongoose.Schema.Types.ObjectId , 'ref':UsersNames}]
  })
  
var communitys =  mongoose.model('communitys', communitys);
module.exports = communitys;