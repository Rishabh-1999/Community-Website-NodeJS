const express = require('express');
const path = require('path');
var bodyParser = require('body-parser')
const app = express.Router();
const multer = require('multer');
var passport=require('passport');
var GitHubStrategy = require('passport-github').Strategy;
var nodemailer = require('nodemailer');

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

var mongoose = require('mongoose');
var mongoDB = 'mongodb://localhost/myDB';

var communitys = new mongoose.Schema({
	"photoloc":String,
	"name":String,
	"members":Array,
	"rule":String,
	"communityloc":String,
	"createdate":String,
	"description":String,
	"owner":String,
	"status":String,
  "ownerid":String    
})

var communitys =  mongoose.model('communitys', communitys);

app.post('/getArrayCommunity',function(req,res) {
  if(req.session.isLogin){
  	communitys.find({'ownerid':req.session._id}, function(err, result){
     console.log(result);
});

} else {
    res.redirect('/');
  }
})

module.exports = app;