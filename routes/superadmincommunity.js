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

app.post('/getCommunityLists' , function(req, res) {
  console.log(req.body);
      communitys.countDocuments(function(e,count){
      var start=parseInt(req.body.start);
      var len=parseInt(req.body.length);

      communitys.find({}).skip(start).limit(len)
    .then(data=> {
      
       if (req.body.customsearch!="")
                    {
                        data = data.filter((value) => {
                            return value.name.includes(req.body.customsearch)
                        })
                    }
    
      res.send({"recordsTotal": count, "recordsFiltered" : count, data})
     })
     .catch(err => {
      res.send(err)
     })
   });

  })

app.post('/communityupdate',function(req,res) {
  if(req.session.isLogin){
  communitys.updateOne({"_id":req.body.id},{$set:{"name":req.body.name,"status":req.body.status}},function(error,result){       
    if(error)
      throw error;
    else {
    }
    res.send("true");
  })
  } else {
    res.redirect('/');
  }
})

app.get('/getArrayOwnCommunity',function(req,res) {
  if(req.session.isLogin){
    console.log("okokok")
    communitys.find({'ownerid':req.session._id}, function(err, result){
     console.log(result);
      res.send(result);
});

} else {
    res.redirect('/');
  }
})

app.get('/getArrayOtherCommunity',function(req,res) {
  if(req.session.isLogin){
    console.log("okokok")
    communitys.find({'ownerid':{"$ne":req.session._id}}, function(err, result){
     console.log(result);
      res.send(result);
});

} else {
    res.redirect('/');
  }
})


app.post('/addUserToDataBase',function (req, res) {
  if(req.session.isLogin){
    let newProduct = new communitys({
  "photoloc":"images/defaultCommunity.jpg",
  "name":req.body.name,
  "members":[req.session.name],
  "rule":req.session.rule,
  "communityloc":"Not Known",
  "createdate":req.session.createdate,
  "description":req.session.description,
  "owner":req.session.name,
  "status":"false",
  "ownerid":req.session._id  
    })
    newProduct.save()
     .then(data => {
       console.log(data)
       res.send(data)
     })
     .catch(err => {
       console.error(err)
       res.send(error)
     })
   }else {
    res.redirect('/');
}
})



module.exports = app;