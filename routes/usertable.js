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

var UsersNames = mongoose.model('usernames');

passport.serializeUser(function(user,done) {
    done(null,user);
});

passport.deserializeUser(function(user,done) {
    done(null,user);
});

passport.use(new GitHubStrategy({
    clientID: '8ede64fb43d1cbae067d',
    clientSecret: '03f3b259e25e48efe13fdb8ca7701daa219f8e3e',
    callbackURL: "http://127.0.0.1:3000/userTable/auth/github/callback"
  },
  function(accessToken, refreshToken, profile, cb) {
      return cb(null, profile);
    })
);

app.get('/auth/github',passport.authenticate('github'));

app.get('/auth/github/callback',passport.authenticate('github', { failureRedirect: 'index.html' }), function (req, res) {
UsersNames.findOne({"githubid" :req.session.passport.user._json.id},function(err, result) {
console.log("githubsignin succesful");
if(result!=null)
{
  console.log("result not null");
        req.session.isLogin=1;
        req.session._id=result._id;
        req.session.name=result.name;
        req.session.password=req.body.password;
        var ob=new Object()
        ob.name=result.name;
        ob._id=result._id;
        ob.email=result.email;
        ob.photoloc=result.photoloc;
        ob.gender=result.gender;
        ob.city=result.city;
        ob.DOB=result.DOB;
        ob.phoneno=result.phoneno
        ob.role=result.role
        ob.status=result.status
        ob.restrict=result.restrict
        ob.isActive=result.isActive
        ob.githubid=result.githubid
        ob.temprole=result.role;
        req.session.name=result.name;
        req.session.data=ob;
        res.redirect('/home');
}
else
{
  var obj = {
  name : req.session.passport.user._json.name,
  email : req.session.passport.user._json.email,
  city : req.session.passport.user._json.location,
  status : "Pending",
  role : "User",
  githubid : req.session.passport.user._json.id,
  photoloc : "/images/logo.png",
  isActive:"true",
  email: req.body.email,
  gender: "",
  DOB: "",
  phoneno: req.body.phoneno,
  restrict: "false",
  interests:"",
  boutyou:"",
  expectations:"",
  email: req.body.email,
}
UsersNames.create(obj,function(error,result) {
if(error)
  throw error;
else {
  req.session.data = obj;
  UsersNames.find({githubid : req.session.passport.user._json.id})
  .then(data => {
    req.session.data._id = data[0]._id;
  })
  .catch(err => {
    throw err;
  })
  res.render('home',{data: req.session.data});
  }
  })
  }
  })
  .catch(err =>
  {
  res.send(err)
  })
})

app.post('/activatesuperadmin',checkSession,checkSuperAdmin,function(req,res){
  console.log('Activated issuperadmin /activatesuperadmin');
  req.session.data.issuperadmin="true";
})

app.post('/checkLogin',function(req,res) {
    console.log('login data recieved');
    UsersNames.findOne({"email": req.body.email,"password":req.body.password,restrict:"false"}, function(err, result) {
      if(result!=null) {
        req.session.isLogin=1;
        req.session._id=result._id;
        req.session.name=result.name;
        
        req.session.password=req.body.password;
        var ob=new Object()
        ob.name=result.name;
        ob._id=result._id;
        ob.email=result.email;
        ob.photoloc=result.photoloc;
        ob.gender=result.gender;
        ob.city=result.city;
        ob.DOB=result.DOB;
        ob.phoneno=result.phoneno
        ob.role=result.role
        ob.status=result.status
        ob.restrict=result.restrict
        ob.isActive=result.isActive
        ob.githubid=result.githubid
        ob.temprole=result.role;
        req.session.name=result.name;
        req.session.data=ob;
        if(result.status=="Pending")
        {
          res.send("not");
        }
        else
        res.send("Logined");
      }
      else
        res.send("wrong details");  
      })
      .catch(err => {
        console.error(err)
        res.send(error)
      })
})

app.post('/addUserToDataBase',checkSession,checkSuperAdmin,function (req, res) {
    let newProduct = new UsersNames({
      email: req.body.email,
      password: req.body.password,
      gender: "",
      DOB: "",
      phoneno: req.body.phoneno,
      city: req.body.city,
      name: req.body.name,
      role: req.body.role,
      restrict: "false",
      status:  "Pending",
      isActive:"true",
      interests:"",
      aboutyou:"",
      expectations:"",
      photoloc:"/images/logo.png",
    })
    newProduct.save()
     .then(data => {
       console.log("New User created");
       res.send(data)
     })
     .catch(err => {
      res.send(err)
     })
})

app.post('/updatetodatabase',checkSession,function(req,res) {
  UsersNames.updateOne({"email":req.body.email},{$set:{"isActive":"true","email":req.body.email,"phoneno":req.body.phoneno,"city":req.body.city,"status":req.body.status,"role":req.body.role}},function(error,result){       
    if(error)
      throw error;
    else {
    if(req.session.emailid!=req.body.email)
      req.session.emailid=req.body.email;
    }
    res.send("1");
  })
})

app.post('/activateUser',checkSession,checkSuperAdmin,function(req,res) {
  UsersNames.updateOne({"_id":req.body._id},{$set:{"restrict":"true"}},function(error,result){
  if(error)
    throw error;
  else
  {
    if(req.session.emailid==req.body.old)
      req.session.emailid=req.body.emailid;
    console.log("Activated Requested User /activateUser");
    res.send("true");
  }
  })
})
// deactivate User
app.post('/deactivateUser',checkSession,checkSuperAdmin,function(req,res) {
  UsersNames.updateOne({"_id":req.body._id},{$set:{"restrict":"false"}},function(error,result){
  if(error)
    throw error;
  else
  {
    if(req.session.emailid==req.body.old)
      req.session.emailid=req.body.emailid;
    console.log("Deactivated Requested User /deactivateUser");
     res.send("true");
  }
  })
})

// Change Temp role
app.post('/changetemprole',checkSession,checkSuperAdmin,function(req,res) {
  if(req.session.data.temprole=="SuperAdmin")
  {
    req.session.data.temprole="User"
    res.send("changed")
  }
  else
  {
    req.session.data.temprole="SuperAdmin"
    res.send("changed")
  }
})

//Update Profile of Users
app.post('/updateprofile',checkSession,function(req,res){
  UsersNames.updateOne({"_id":req.session._id},{$set:{"status":"Confirmed","isActive":"true","name":req.body.name,"DOB":req.body.DOB,"city":req.body.city,"gender":req.body.gender,"phoneno":req.body.phoneno,"interests":req.body.interests,
  "aboutyou":req.body.aboutyou,"expectations":req.body.expectations}},function(error,result){
  if(error)
    throw error;
  else
  req.session.data.isActive="true";
  console.log("Updated from /updateprofile");
  res.send("true");
  })
})

app.post('/changePassword',checkSession, (req,res)=>{
  UsersNames.updateOne({"_id":req.session._id,"password":req.body.oldpass},{$set:{"password":req.body.newpass}},function(error,result){
  if(error)
    throw error;
  else
  {
    if(result.n==0)
      res.send("false");
    else
      res.send("true");
  }
    console.log("Password Changed Successfully /changePassword");
  })
})

//check duplicate for creating user emailid
app.post('/checkDuplicate',checkSession, (req,res)=>{
  var data=UsersNames.find({}).exec(function(error,result)    {
  if(error)
    throw error;
  else
  {
    var da=[];
    var rew="false";
    da=result;
    for(i in result)
    {
      if(req.body.email==da[i].email)
      {
        rew="true";
      }
    }
      res.send(rew);
  }
})
})

app.post('/usersTable' ,checkSession,checkSuperAdmin, function(req, res) {
  let query = {};
let params = {};
if(req.body.role === 'All' && req.body.status !== 'All')
    query = {status: req.body.status};
else if(req.body.role !== 'All' && req.body.status === 'All')
    query = {role: req.body.role};
else if(req.body.role !== 'All' && req.body.status !== 'All')
    query = {role: req.body.role , status: req.body.status};

    if(req.body.customsearch)
    {
        query.name = {"$regex" : req.body.customsearch , "$options" : "i"};
    }

let sortingType;
if(req.body.order[0].dir === 'asc')
    sortingType = 1;
else
    sortingType = -1;

if(req.body.order[0].column === '0')
    params = {skip : parseInt(req.body.start) , limit : parseInt(req.body.length), sort : {email : sortingType}};
else if(req.body.order[0].column === '2')
    params = {skip : parseInt(req.body.start) , limit : parseInt(req.body.length), sort : {city : sortingType}};
else if(req.body.order[0].column === '3')
    params = {skip : parseInt(req.body.start) , limit : parseInt(req.body.length), sort : {status : sortingType}};
else if(req.body.order[0].column === '4')
    params = {skip : parseInt(req.body.start) , limit : parseInt(req.body.length), sort : {role : sortingType}};


    UsersNames.find(query , {} , params , function (err , data)
    {
        if(err)
            console.log(err);
        else
        {
            UsersNames.countDocuments(query, function(err , filteredCount)
            {
                if(err)
                    console.log(err);
                else
                {
                
                    UsersNames.countDocuments(function (err, totalCount)
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
    })
});

  var storage = multer.diskStorage({
  destination : './public/uploads/',
      filename : function(req, file, callback)
      {
        photoname=req.session._id +path.extname(file.originalname);
        req.session.data.photoloc ='/uploads/'+ photoname;
        callback(null,photoname);
      }
    })
     var upload = multer({
      storage : storage,
    }).single('file');

app.post('/uploadphoto',checkSession,(req,res)=>{
  upload(req,res,(err)=>{
        if(err)
        {
          throw err;
        }
        else{
          UsersNames.updateOne({"_id":req.session._id},{$set:{"photoloc":'/uploads/'+photoname}},function(error,result){
              console.log("photo updated to database"+result)
              req.session.data.photoloc = 'uploads/'+photoname;
              res.redirect('/homewithedit');
           })
        }
      })
})

app.get('/editprofile' ,checkSession, (req,res)=>{
  UsersNames.findOne({"_id":req.session._id}, function(err, result) {
    var userdata=new Object();
    userdata.interests=result.interests
    userdata.aboutyou=result.aboutyou
    userdata.expectations=result.expectations
    res.render('editprofile',{data: req.session.data,userdata:userdata});
 })
})

module.exports=app
