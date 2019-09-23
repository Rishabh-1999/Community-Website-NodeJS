const express = require('express');
const path = require('path');
var bodyParser = require ('body-parser')
const app = express.Router();
const multer = require('multer');
var passport=require('passport');
var GitHubStrategy = require('passport-github').Strategy;
var nodemailer = require('nodemailer');
var mongojs = require('mongojs')

app.use(passport.initialize());
app.use(passport.session());

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }))

// parse application/json
app.use(bodyParser.json())


var mongoose = require('mongoose');
var mongoDB = 'mongodb://localhost/myDB';

var checkSession = function (req, res, next) {
    if(req.session.isLogin)
      next();
    else
      res.redirect('/');
}
var checkSuperAdmin = function (req, res, next) {
    if(req.session.data.role=="SuperAdmin")
      next();
    else
      res.redirect('/');
}

var checkSuperAdminOrCommunityManagers = function (req, res, next) {
    if(req.session.data.role=="SuperAdmin" || req.session.data.role=="CommunityManagers")
      next();
    else
      res.redirect('/');
}

var communitys = mongoose.model('communitys');
var UsersNames = mongoose.model('usernames');

app.post('/getUsers',checkSession,function(req,res) {
communitys.findOne({ "_id" : req.body._id }).populate('users').exec(function (err, result) {
    if (err) 
      return err;
    else
    {
      console.log("Got Users for community table /getUsers");
      res.send(JSON.stringify(result.users))
    }
  })
})

// get managers in communityes
app.post('/getManagers',checkSession,function(req,res) {
communitys.findOne({ "_id" : req.body._id }).populate('managers').
  exec(function (err, result) {
    if (err) 
      return err;
    else
    {
      console.log("Got Users for community table /getManagers")
      res.send(JSON.stringify(result.managers))
    }
  })
})

// get invited users in communityes
app.post('/getinveted',checkSession,function(req,res) {
communitys.findOne({ "_id" : req.body._id }).populate('invited'). 
  exec(function (err, result) {
    if (err) 
      return err;
    else
    {
      console.log("Got Users for community table /getinveted")
      res.send(JSON.stringify(result.invited))
    }
  })
})

// get request users in communityes
app.post('/getrequest',checkSession,function(req,res) {
communitys.findOne({ "_id" : req.body._id }).populate('request').
  exec(function (err, result) {
    if (err) 
      return err;
    else
    {
      console.log("Got Users for community table /getrequest")
      res.send(JSON.stringify(result.request))
    }
  })
})

// Get Community Lists for table 
app.post('/getCommunityLists',checkSession,function(req, res) {
  let query = {};
    let params = {};

    if(req.body.status === 'Direct')
        query = {rule: req.body.status};
    else if(req.body.status === 'Permission')
        query = {rule: req.body.status};

    if(req.body.search.value)
    {
        query.name = {"$regex" : req.body.customsearch , "$options" : "i"};
    }

    let sortingType;
    if(req.body.order[0].dir === 'asc')
        sortingType = 1;
    else
        sortingType = -1;

    if(req.body.order[0].column === '0')
        params = {skip : parseInt(req.body.start), limit : parseInt(req.body.length), sort : {name : sortingType}};
    else if(req.body.order[0].column === '2')
        params = {skip : parseInt(req.body.start), limit : parseInt(req.body.length), sort : {communityloc : sortingType}};
    else if(req.body.order[0].column === '3')
        params = {skip : parseInt(req.body.start), limit : parseInt(req.body.length), sort : {owner : sortingType}};
    else if(req.body.order[0].column === '4')
        params = {skip : parseInt(req.body.start), limit : parseInt(req.body.length), sort : {createDate : sortingType}};

        communitys.find(query, {}, params, function (err, data)
    {
        if(err)
            console.log(err);
        else
        {
          communitys.countDocuments(query, function(err , filteredCount)
            {
                if(err)
                    console.log(err);
                else
                {
                  communitys.countDocuments(function (err, totalCount)
                    {
                        if(err)
                            console.log(err);
                        else
                            res.send({"recordsTotal": totalCount,
                                "recordsFiltered": filteredCount, data});
                    })
                }
              });
        }
    });

  });

//Join Community
app.post('/joinandrequestcommunity',checkSession,function(req,res) {
  if(req.body.r==0)
  {
    communitys.updateOne({"_id":req.body._id},{$push:{"users":req.session._id}},function(error,result){       
    if(error)
      throw error;
    else {
      console.log(req.session._id+" joined community "+req.body._id )
    res.send("true");
  }
  })
}
else
{
  communitys.updateOne({"_id":req.body._id},{$push:{"request":req.session._id}},function(error,result){       
    if(error)
      throw error;
    else {
      console.log(req.session._id+" requested community "+req.body._id )
    }
    res.send("true");
  })
}
})

// Update Community Details
app.post('/communityupdate',checkSession,checkSuperAdminOrCommunityManagers,function(req,res) {
  communitys.updateOne({"_id":req.body.id},{$set:{"name":req.body.name,"status":req.body.status}},function(error,result){       
    if(error)
      throw error;
    else {
      console.log("Community "+req.body.id+" updated")
    res.send("true");
  }
  })
})

// Get Array which User is Owner
app.get('/getArrayOwnCommunity',checkSession,function(req,res) {
    communitys.find({'ownerid':req.session._id}, function(err, result){
     console.log("Got Array in which User is Owner");
      res.send(result);
});
})

// Get Array in which User is Member or managers and Not Owner
app.get('/getArrayOtherCommunity',checkSession,function(req,res) {
    communitys.find({ $and:[{"users": { "$in" : [req.session._id]}},{ "ownerid" : { "$not":{ "$eq":req.session._id}}}]}, function(err, result){
     console.log("Got Array in which User in Member in Community");
      res.send(result);
});
})

// Get Array in which User has Requested
app.get('/getArrayOtherCommunityInvited',checkSession,function(req,res) {
    communitys.find({ $and:[{"invited": { "$in" : [req.session._id]}},{"users": { "$nin" : [req.session._id]}},{"managers": {  "$nin" : [req.session._id]}},{ "ownerid" : { "$not":{ "$eq":req.session._id}}}]}, function(err, result){
     console.log("Got array in which User has Requested to join Community");
      res.send(result);
});
})

//Function to get Time in PM or AM
function formatAMPM(date) {
  var hours = date.getHours();
  var minutes = date.getMinutes();
  var ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12;
  hours = hours ? hours : 12;
  minutes = minutes < 10 ? '0'+minutes : minutes;
  var strTime = hours + ':' + minutes + ' ' + ampm;
  return strTime;
}

//Add Community
app.post('/addCommunity',checkSession,checkSuperAdminOrCommunityManagers,function (req, res) {
var rule;
  var photoname;
  if(tempcomm==null)
    photoname="/images/defaultCommunity.jpg";
  else
    photoname="/uploads/"+tempcomm;
  var dat= new Date();
  var datestr="";
  datestr=dat.getDate();
  datestr=datestr+"-"+dat.getMonth();
  datestr=datestr+"-"+dat.getFullYear();
  datestr=datestr+" ("+formatAMPM(dat)+")";
  //"photoloc":"/images/defaultCommunity.jpg",
    let newProduct = new communitys({
  "photoloc":photoname,
  "name":req.body.name,
  "members":null,
  "rule":req.body.rule,
  "communityloc":"Not Known",
  "createdate":datestr,
  "description":req.body.description,
  "owner":req.session.name,
  "status":"Active",
  "ownerid":req.session._id
    })
    newProduct.save()
     .then(data => {
       upload(req,res,(err)=>{
        if(err)
          throw err;
        else{
          res.send(true)
        }
      })
     })
     .catch(err => {
       res.send(err)
     })
})
var tempid;

var storagecomm = multer.diskStorage({
      destination : './public/uploads/',
      filename : function(req, file, callback)
      {
        tempcomm='community'+tempid+path.extname(file.originalname);
        callback(null,tempcomm);
      }
    })

     var uploadcomm = multer({
      storage : storagecomm,
    }).single('file');

app.post('/uploadphotoCommunity',checkSession,checkSuperAdminOrCommunityManagers,(req,res)=>{
  uploadcomm(req,res,(err)=>{
        if(err)
        {
          throw err;
        }
        else{
          communitys.updateOne({"_id":tempid},{$set:{"photoloc":'/uploads/'+tempcomm}},function(error,result){
              console.log("photo updated to database"+result)
              communitys.findOne({"_id":tempid},function(err,result) {
                if(err)
                  throw err;
                else {
                  res.render('manageCommunity',{data:req.session.data,data2:result});
                }
              })
           })
        }
})
})

app.post('/getAllActive',checkSession,function(req,res) {
    communitys.find({'ownerid':{"$ne":req.session._id}, "users": { "$nin" : [req.session._id]},"request": { "$nin" : [req.session._id]}}).skip(req.body.start).limit(req.body.end).exec(function(error,result) {
      res.send(result);
})
})

app.post('/updatecomm',checkSession,function(req,res) {
  tempid=req.body._id;
  communitys.findOneAndUpdate({"_id":req.body._id},{"name":req.body.name,"description":req.body.description,"rule":req.body.rule},function(err,result)
  {
    if(err)
      throw err
    else
    {
      communitys.findOne({"_id":req.body._id},function(err,result)
      {
      if(err)
        throw err;
      else
      {
        res.send("true")
      }
    })
    }
  });
})


app.get('/:pro',checkSession,(req,res)=>{
    var id=req.params.pro.toString();
    communitys.findOne({"_id":id},function(err,result) {
      if(err)
        throw err;
      else {
        console.log("Manage Community");
        res.render('manageCommunity',{data:req.session.data,data2:result});
      }
    })  
})

app.get('/edit/:pro',checkSession,(req,res)=>{
    var id=req.params.pro.toString();
    communitys.findOne({"_id":id},function(err,result)
    {
      if(err)
        throw err;
      else {
        console.log("Edit Profile of Community");
        res.render('editcommunity',{data:req.session.data,data2:result});
      }
    })
})

app.get('/userprofile/:pro',checkSession,(req,res)=>{
    var id=req.params.pro.toString();
    UsersNames.findOne({"_id":id},function(err,result)
    {
      if(err)
        throw err;
      else {
        console.log("User Profile For Community");
        res.render('userprofile',{data:req.session.data,data2:result});
      }
    }) 
})

app.post('/leaveCommunity',checkSession,(req,res)=>{
  communitys.updateOne({"_id" :req.body.commid},{ $pull : {"users" : req.body._id}},function(error,result)
  {
      if(error)
      throw error;
      else {
          res.send("true");
      }
  })
})

app.get('/communitymembers/:pro',checkSession,(req,res)=>{
    var id=req.params.pro.toString();
    communitys.findOne({"_id":id},function(err,result)
    {
      if(err)
        throw err;
      else {
        console.log("Community Members");
        res.render('communitymembers',{data:req.session.data,data2:result});
      }
    }) 
})

app.get('/profile/:pro',checkSession,(req,res)=>{
    var id=req.params.pro.toString();
    communitys.findOne({"_id":id},function(err,result)
    {
      if(err)
        throw err;
      else {
        console.log("Community Profile");
        res.render('communityprofile',{data:req.session.data,data2:result});
      }
    }) 
})

app.get('/communityDicussion/:pro',checkSession,(req,res)=>{
  var id=req.params.pro.toString();
  communitys.findOne({"_id":id},function(err,result)
  {
    if(err)
      throw err;
    else {
      res.render('chatroom',{data:req.session.data,data2:result});
    }
  }) 
})

module.exports=app
