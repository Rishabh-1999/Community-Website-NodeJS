var mongoose = require('mongoose');
var user = new mongoose.Schema({
    email: {type:String,required:true,unique:true,trim:true},
    password: {type:String,default:""},
    gender: {type:String},
    phoneno: {type:String},
    city: {type:String},
    name:{type:String,required:true,unique:false,trim:true},
    DOB: {type:Date},
    role:{type:String},
    status:{type:String},
    restrict:{type:String},
    isActive:{type:String},
    interests:{type:String},
    aboutyou:{type:String},
    expectations:{type:String},
    photoloc:{type:String,default:"/images/logo.png"},
    githubid:{type:String}
  })

var UsersNames =  mongoose.model('usernames', user);
module.exports = UsersNames;