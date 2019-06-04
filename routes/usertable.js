const express = require('express');
const path = require('path');
var bodyParser = require('body-parser')
const app = express.Router();
const multer = require('multer');
var passport=require('passport');
var GitHubStrategy = require('passport-github').Strategy;
var nodemailer = require('nodemailer');

app.use(passport.initialize());
app.use(passport.session());

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

var mongoose = require('mongoose');
var mongoDB = 'mongodb://localhost/myDB';

var user = new mongoose.Schema({
    email: String,
    password: String,
    gender: String,
    phoneno: String,
    city: String,
    name:String,
    DOB: String,
    role:String,
    status:String,
    restrict:String,
    isActive:String,
    interests:String,
    aboutyou:String,
    expectations:String,
    photoloc:String,
    githubid:String
  })

var UsersNames =  mongoose.model('usernames', user);

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
console.log(req.session.passport.user._json.id);
UsersNames.find({"githubid" :req.session.passport.user._json.id},function(err, result) {
console.log("githubsignin succesful");
if(result!=null)
{
  req.session.isLogin=1;
  req.session._id=result._id;
  req.session.name=result.name;
  req.session.data=result[0];
  req.session.data.temprole=req.session.data.role
  req.session.data.issuperadmin="false";
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
  photoloc : "images/logo.png",
  isActive:"true"
  email: req.body.email,
  gender: "",
  DOB: "",
  phoneno: req.body.phoneno,
  restrict: "false",
  interests:"",
  boutyou:"",
  expectations:""
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

app.post('/activatesuperadmin',function(req,res){
  req.session.data.issuperadmin="true";
})

app.post('/checkLogin',function(req,res) {
    console.log('login data recieved');
    UsersNames.findOne({"email": req.body.email,password:req.body.password}, function(err, result) {
    console.log(result);
      if(result!=null) {
        req.session.isLogin=1;
        req.session._id=result._id;
        req.session.name=result.name;
        req.session.data=result;
        req.session.password=req.body.password;
        if(result.isActive=="false")
        {
          redirect('/home')
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

app.post('/activateEditProfile',function() {
  req.session.data.activateEditProfile="true";
  res.redirect('/home')
})

app.post('/addUserToDataBase',function (req, res) {
  if(req.session.isLogin){
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
      isActive:"false",
      interests:"",
      aboutyou:"",
      expectations:"",
      photoloc:"images/logo.png"
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

app.post('/updatetodatabase',function(req,res) {
  if(req.session.isLogin){
  UsersNames.updateOne({"email":req.body.email},{$set:{"email":req.body.email,"phoneno":req.body.phoneno,"city":req.body.city,"status":req.body.status,"role":req.body.role}},function(error,result){       
    if(error)
      throw error;
    else {
    if(req.session.emailid==req.body.old)
      req.session.emailid=req.body.emailid;
    }
    res.send("1");
  })
  } else {
    res.redirect('/');
  }
})

app.post('/activateUser',function(req,res) {
  if(req.session.isLogin){
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
}else {
  res.redirect('/');
}
})

app.post('/deactivateUser',function(req,res) {
  if(req.session.isLogin){
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
}else {
  res.redirect('/');
}
})

app.post('/updateprofile',function(req,res){
  UsersNames.updateOne({"_id":req.session._id},{$set:{"isActive":"true","name":req.body.name,"DOB":req.body.DOB,"city":req.body.city,"gender":req.body.gender,"phoneno":req.body.phoneno,"city":req.body.city,"interests":req.body.interests,
  "aboutyou":req.body.aboutyou,"expectations":req.body.expectations}},function(error,result){
  if(error)
    throw error;
  else
  console.log("Updated from /updateprofile");
  res.send("1");
  })
  //res.send("1");
})

app.post('/changePassword' , (req,res)=>{
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

app.post('/checkDuplicate' , (req,res)=>{
  var data=UsersNames.find({}).exec(function(error,result)    {
    if(error)
        // throw error;
      console.log('helo');
    else
    {
      var da=[];
      var rew="false";
      da=result;
      for(i in result)
      {
        console.log(req.body.email+ " "+da[i].email);
        if(req.body.email==da[i].email)
        {
          rew="true";
        }
      }
      res.send(rew);
    }
})
})

app.post('/usersTable' , function(req, res) {
  console.log(req.body);
if(req.body.role === 'All' && req.body.status === 'All')
{
      UsersNames.countDocuments(function(e,count){
      var start=parseInt(req.body.start);
      var len=parseInt(req.body.length);

      UsersNames.find({

      }).skip(start).limit(len)
    .then(data=> {
      
      if (req.body.customsearch!="")
                    {
                        data = data.filter((value) => {
                            return value.email.includes(req.body.customsearch)
                        })
                    }
    
      res.send({"recordsTotal": count, "recordsFiltered" : count, data})
     })
     .catch(err => {
      res.send(err)
     })
   });

}

else if(req.body.role === 'All' && req.body.status !== 'All')
{
  console.log(req.body);
  var length;
      UsersNames.countDocuments(function(e,count){
      var start=parseInt(req.body.start);
      var len=parseInt(req.body.length);

      UsersNames.find({status: req.body.status}).then(data => length = data.length);

      UsersNames.find({ status: req.body.status }).skip(start).limit(len)
    .then(data=> {
      res.send({"recordsTotal": count, "recordsFiltered" : length, data})
     })
     .catch(err => {
      res.send(err)
     })
   });  
}

else if(req.body.role !== 'All' && req.body.status === 'All')
{
       console.log(req.body);
  var length;
      UsersNames.countDocuments(function(e,count){
      var start=parseInt(req.body.start);
      var len=parseInt(req.body.length);

      UsersNames.find({role: req.body.role}).then(data => length = data.length);

      UsersNames.find({ role: req.body.role }).skip(start).limit(len)
    .then(data=> {
      res.send({"recordsTotal": count, "recordsFiltered" : length, data})
     })
     .catch(err => {
      res.send(err)
     })
   }); 
}

else
{
       var length;
      UsersNames.countDocuments(function(e,count){
      var start=parseInt(req.body.start);
      var len=parseInt(req.body.length);

      UsersNames.find({role: req.body.role, status: req.body.status}).then(data => length = data.length);

      UsersNames.find({role: req.body.role, status: req.body.status}).skip(start).limit(len)
    .then(data=> {
      res.send({"recordsTotal": count, "recordsFiltered" : length, data})
     })
     .catch(err => {
      res.send(err)
     })
   }); 
}
  })

var storage = multer.diskStorage({
      destination : './public/uploads/',
      filename : function(req, file, callback)
      {
        photoname=req.session._id +path.extname(file.originalname);
        req.session.data.photoloc ='uploads/'+ photoname;
        callback(null,photoname);
      }
    })

     var upload = multer({
      storage : storage,
    }).single('file');

app.post('/uploadphoto',(req,res)=>{
  upload(req,res,(err)=>{
        if(err)
        {
          throw err;
        }
        else{
          console.log(req.file);
          console.log(photoname);
          UsersNames.updateOne({"_id":req.session._id},{$set:{"photoloc":'uploads/'+photoname}},function(error,result){
        
           })

          console.log();
          req.session.data.photoloc = 'uploads/'+photoname;
            
        }
      })

})

mongoose.connect(mongoDB);

module.exports = app;