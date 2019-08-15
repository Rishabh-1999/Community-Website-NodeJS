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
app.use(bodyParser.urlencoded({ extended: false }))

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
UsersNames.findOne({"githubid" :req.session.passport.user._json.id},function(err, result) {
console.log("githubsignin succesful");
if(result!=null)
{
  console.log("result not null");
  console.log(result);
  console.log(result.email);
  console.log(result.name);

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
        ob.interests=result.interests
        ob.aboutyou=result.aboutyou
        ob.expectations=result.expectations
        ob.githubid=result.githubid
        ob.temprole=result.role;
        req.session.name=result.name;
        req.session.data=ob;
        console.log(req.session.data)
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

app.post('/activatesuperadmin',checkSession,function(req,res){
  console.log('Activated issuperadmin /activatesuperadmin');
  req.session.data.issuperadmin="true";
})

app.post('/checkLogin',function(req,res) {
    console.log('login data recieved');
    UsersNames.findOne({"email": req.body.email,"password":req.body.password,status:"Confirmed",restrict:"false"}, function(err, result) {
    console.log(result);
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
        ob.interests=result.interests
        ob.aboutyou=result.aboutyou
        ob.expectations=result.expectations
        ob.githubid=result.githubid
        ob.temprole=result.role;
        req.session.name=result.name;
        req.session.data=ob;
        console.log(req.session)
        if(result.isActive=="false")
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

app.post('/addUserToDataBase',checkSession,function (req, res) {
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
      photoloc:"/images/logo.png",
    })
    newProduct.save()
     .then(data => {
       console.log("New User created");
       console.log(data);
       res.send(data)
     })
     .catch(err => {
       res.send(error)
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

app.post('/activateUser',checkSession,function(req,res) {
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
app.post('/deactivateUser',checkSession,function(req,res) {
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
app.post('/changetemprole',checkSession,function(req,res) {
  if(req.session.data.temprole=="SuperAdmin")
  {
    req.session.data.temprole="User"
    console.log(req.session.data)
    res.send("changed")
  }
  else
  {
    req.session.data.temprole="SuperAdmin"
    console.log(req.session.data)
    res.send("changed")
  }
})

//Update Profile of Users
app.post('/updateprofile',checkSession,function(req,res){
  UsersNames.updateOne({"_id":req.session._id},{$set:{"isActive":"true","name":req.body.name,"DOB":req.body.DOB,"city":req.body.city,"gender":req.body.gender,"phoneno":req.body.phoneno,"interests":req.body.interests,
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

app.post('/usersTable' ,checkSession, function(req, res) {
if(req.body.role === 'All' && req.body.status === 'All')
{
  UsersNames.countDocuments(function(e,count){
  var start=parseInt(req.body.start);
  var len=parseInt(req.body.length);

  UsersNames.find({}).skip(start).limit(len)
  .then(data=> {
  if (req.body.customsearch!="") {
    data = data.filter((value) => {
            flag = value.email.includes(req.body.customsearch) || value.phoneno.includes(req.body.customsearch)
             || value.city.includes(req.body.customsearch) || value.status.includes(req.body.customsearch) 
             || value.role.includes(req.body.customsearch);
            return flag;
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
  var length;
  UsersNames.countDocuments(function(e,count){
  var start=parseInt(req.body.start);
  var len=parseInt(req.body.length);

  UsersNames.find({status: req.body.status}).then(data => length = data.length);
  UsersNames.find({ status: req.body.status }).skip(start).limit(len)
  .then(data=> {
    if (req.body.customsearch!="") {
    data = data.filter((value) => {
            flag = value.email.includes(req.body.customsearch) || value.phoneno.includes(req.body.customsearch)
             || value.city.includes(req.body.customsearch) || value.status.includes(req.body.customsearch) 
             || value.role.includes(req.body.customsearch);
            return flag;
          })
  }
  res.send({"recordsTotal": count, "recordsFiltered" : length, data})
  })
  .catch(err => {
  res.send(err)
  })
  });  
}

else if(req.body.role !== 'All' && req.body.status === 'All')
{
  var length;
  UsersNames.countDocuments(function(e,count){
  var start=parseInt(req.body.start);
  var len=parseInt(req.body.length);

  UsersNames.find({role: req.body.role}).then(data => length = data.length);

  UsersNames.find({ role: req.body.role }).skip(start).limit(len)
  .then(data=> {
    if (req.body.customsearch!="") {
    data = data.filter((value) => {
            flag = value.email.includes(req.body.customsearch) || value.phoneno.includes(req.body.customsearch)
             || value.city.includes(req.body.customsearch) || value.status.includes(req.body.customsearch) 
             || value.role.includes(req.body.customsearch);
            return flag;
          })
  }
  res.send({"recordsTotal": count, "recordsFiltered" : length, data})
  })
  .catch(err => {
  res.send(err)
  })
  }); 
} else {
  var length;
  UsersNames.countDocuments(function(e,count){
  var start=parseInt(req.body.start);
  var len=parseInt(req.body.length);

  UsersNames.find({role: req.body.role, status: req.body.status}).then(data => length = data.length);

  UsersNames.find({role: req.body.role, status: req.body.status}).skip(start).limit(len)
  .then(data=> {
    if (req.body.customsearch!="") {
    data = data.filter((value) => {
            flag = value.email.includes(req.body.customsearch) || value.phoneno.includes(req.body.customsearch)
             || value.city.includes(req.body.customsearch) || value.status.includes(req.body.customsearch) 
             || value.role.includes(req.body.customsearch);
            return flag;
          })
  }
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
          console.log(req.file);
          console.log(photoname);
          UsersNames.updateOne({"_id":req.session._id},{$set:{"photoloc":'/uploads/'+photoname}},function(error,result){
              console.log("photo updated to database"+result)
              req.session.data.photoloc = 'uploads/'+photoname;
              res.redirect('/homewithedit');
           })
        }
      })
})
/*--------------------------------------------------------------------------------------------------------------*/

var communitys = new mongoose.Schema({
  "photoloc":String,
  "name":String,
  "members":String,
  "rule":String,
  "communityloc":String,
  "createdate":String,
  "description":String,
  "owner":String,
  "status":String,
  "ownerid":String,
  "request":[{'type': mongoose.Schema.Types.ObjectId , 'ref':UsersNames}],
  "managers":[{'type': mongoose.Schema.Types.ObjectId , 'ref':UsersNames}],
  "invited":[{'type': mongoose.Schema.Types.ObjectId , 'ref':UsersNames}],
  "users": [{'type': mongoose.Schema.Types.ObjectId , 'ref':UsersNames}]
})

var communitys =  mongoose.model('communitys', communitys);

// get users in communityes
app.post('/getUsers',checkSession,function(req,res) {
  if(req.session.isLogin){
communitys.findOne({ "_id" : req.body._id }).populate('users').exec(function (err, result) {
    if (err) 
      return err;
    else
    {
      console.log("Got Users for community table /getUsers");
      res.send(JSON.stringify(result.users))
    }
  })
}
})

// get managers in communityes
app.post('/getManagers',checkSession,function(req,res) {
if(req.session.isLogin){
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
}
})

// get invited users in communityes
app.post('/getinveted',checkSession,function(req,res) {
if(req.session.isLogin){
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
}
})

// get request users in communityes
app.post('/getrequest',checkSession,function(req,res) {
if(req.session.isLogin){
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
}
})

// get request users in communityes(Not Used)
// app.post('/promoteuser',function(req,res) {
// if(req.session.isLogin){
//     var res;
//     UsersNames.find({"_id":req.body._id}).exec(function(error,result)    {
//   if(error)
//     throw error;
//   else
//   {
//     var ch=result.role;
//     if(result.role=="User")
//     {
//       ch="Admin";
//     }
//     else if(result.role=="Admin")
//     {
//       ch="SuperAdmin"
//     }
//     UsersNames.updateOne({"_id":req.body._id},{$set:{"role":ch}},function(error,result){
//   if(error)
//     res.send("false")
//   else
//     res.send("true")
//   })
//   }
// })
//   }
// })

// Remove users from community (Not User)
//   app.post('/remove',function(req,res) {
//   if(req.session.isLogin){
//     var res;
//     =UsersNames.find({"_id":req.body._id}).exec(function(error,result)    {
//   if(error)
//     throw error;
//   else
//   {
//     var ch=result.role;
//     if(result.role=="User")
//     {
//       ch="Admin";
//     }
//     else if(result.role=="Admin")
//     {
//       ch="SuperAdmin"
//     }
//     UsersNames.updateOne({"_id":req.body._id},{$set:{"role":ch}},function(error,result){
//   if(error)
//     res.send("false")
//   else
//     res.send("true")
//   })
//   }
// })
//   }
// })

// Get Community Lists for table 
app.post('/getCommunityLists',checkSession,function(req, res) {
  console.log(req.body);
  var count;
      communitys.countDocuments(function(e,c){
        count=c;
      })
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
    console.log("SuperAdmin Community table sended /getCommunityLists")
      res.send({"recordsTotal": count, "recordsFiltered" : count, data})
     })
     .catch(err => {
      res.send(err)
    })
  });

//Join Community
app.post('/joincommunity',checkSession,function(req,res) {
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
  communitys.updateOne({"_id":req.body._id},{$push:{"invited":req.session._id}},function(error,result){       
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
app.post('/communityupdate',checkSession,function(req,res) {
  if(req.session.isLogin){
  communitys.updateOne({"_id":req.body.id},{$set:{"name":req.body.name,"status":req.body.status}},function(error,result){       
    if(error)
      throw error;
    else {
      console.log("Community "+req.body.id+" updated")
    res.send("true");
  }
  })
  } else {
    res.redirect('/');
  }
})

// Get Array which User is Owner
app.get('/getArrayOwnCommunity',checkSession,function(req,res) {
  if(req.session.isLogin){
    console.log("okokok")
    communitys.find({'ownerid':req.session._id}, function(err, result){
     console.log("Got Array in which User is Owner");
      res.send(result);
});
} else {
    res.redirect('/');
  }
})

// Get Array in which User is Member or managers and Not Owner
app.get('/getArrayOtherCommunity',checkSession,function(req,res) {
  if(req.session.isLogin){
    communitys.find({ $and:[{"users": { "$in" : [req.session._id]}},{ "ownerid" : { "$not":{ "$eq":req.session._id}}}]}, function(err, result){
     console.log("Got Array in which User in Member in Community");
      res.send(result);
});
} else {
    res.redirect('/');
  }
})

// Get Array in which User has Requested
app.get('/getArrayOtherCommunityInvited',checkSession,function(req,res) {
  if(req.session.isLogin){
    communitys.find({ $and:[{"invited": { "$in" : [req.session._id]}},{"users": { "$nin" : [req.session._id]}},{"managers": {  "$nin" : [req.session._id]}},{ "ownerid" : { "$not":{ "$eq":req.session._id}}}]}, function(err, result){
     console.log("Got array in which User has Requested to join Community");
      res.send(result);
});
} else {
    res.redirect('/');
  }
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
app.post('/addCommunity',checkSession,function (req, res) {
var rule;
console.log(req.body);
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
  if(req.session.isLogin){
    let newProduct = new communitys({
  "photoloc":photoname,
  "name":req.body.name,
  "members":null,
  "rule":req.body.rule,
  "communityloc":"Not Known",
  "createdate":datestr,
  "description":req.body.description,
  "owner":req.session.name,
  "status":"false",
  "ownerid":req.session._id,
  "managers":null,
  "invited":null,
    })
    newProduct.save()
     .then(data => {
       console.log(data)
       upload(req,res,(err)=>{
        if(err)
          throw err;
        else{
          // if(photoname!=null && photoname!=undefined && photoname!="")
          //  communitys.updateOne({"_id":data._id},{"photoloc":'/uploads/'+photoname},function(error,result){
          //  })
          // communitys.updateOne({"_id":data._id},{$push:{"users":req.session._id}},function(error,result){
          //  })
          // console.log("Community Created "+data)
          //res.render('communitylists',{data: req.session.data});
          res.send(true)
        }
      })
     })
     .catch(err => {
       console.error(err)
       res.send(err)
     })
   }else {
    res.redirect('/');
    res.send(true)
}
})
var tempcomm;

var storagecomm = multer.diskStorage({
      destination : './public/uploads/',
      filename : function(req, file, callback)
      {
        tempcomm='community'+Date.now()+path.extname(file.originalname);
        callback(null,tempcomm);
      }
    })

     var uploadcomm = multer({
      storage : storagecomm,
    }).single('myfile');

app.post('/uploadphotoCommunity',checkSession,(req,res)=>{
  uploadcomm(req,res,(err)=>{
        if(err)
        {
          throw err;
        }

})
})

app.get('/getAllActive',checkSession,function(req,res) {
  if(req.session.isLogin){
    communitys.find({'ownerid':{"$ne":req.session._id}, "users": { "$nin" : [req.session._id]}}, function(err, result){
     console.log(result);
      res.send(result);
})
} else {
    res.redirect('/');
  }
})

app.post('/updatecomm',checkSession,function(req,res) {
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

module.exports=app
