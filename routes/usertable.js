const express = require('express');
const path = require('path');
var bodyParser = require('body-parser')
const app = express.Router();
const multer = require('multer');


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
    photoloc:String
  })

var UsersNames =  mongoose.model('usernames', user);

app.post('/checkLogin',function(req,res){
    console.log('login data recieved');
    UsersNames.findOne({email: req.body.email,password:req.body.password}, function(err, result) {
    console.log(result);
      if(result!=null) {
        req.session.isLogin=1;
        req.session._id=result._id;
        req.session.name=result.name;
        req.session.data=result;
        req.session.password=req.body.password;
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

app.post('/addUserToDataBase',function (req, res) {
    console.log(req.body);
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
  })

app.post('/updatetodatabase',function(req,res)
       {
    console.log(req.body);
        UsersNames.updateOne({"email":req.body.email},{$set:{"email":req.body.email,"phoneno":req.body.phoneno,"city":req.body.city,"status":req.body.status,"role":req.body.role}},function(error,result){
            
    if(error)
        throw error;
             else
                 {
                     if(req.session.emailid==req.body.old)
                req.session.emailid=req.body.emailid;
                 }
        })
        res.send("1");
})

app.post('/activateUser',function(req,res)
{
   console.log(req.body);
        UsersNames.updateOne({"_id":req.body._id},{$set:{"restrict":"true"}},function(error,result){
            
    if(error)
        throw error;
             else
                 {
                     if(req.session.emailid==req.body.old)
                req.session.emailid=req.body.emailid;
                 }
        })
})

app.post('/deactivateUser',function(req,res)
{
   console.log(req.body);
        UsersNames.updateOne({"_id":req.body._id},{$set:{"restrict":"false"}},function(error,result){
    if(error)
        throw error;
             else
                 {
                     if(req.session.emailid==req.body.old)
                req.session.emailid=req.body.emailid;
                 }
        })
})

app.get('/getTable',function(req,res)
{
   var data=UsersNames.find({}).exec(function(error,result)                           {
    if(error)
        throw error;
    else
        res.send(JSON.stringify(result));
  })
})

app.post('/updateprofile',function(req,res){
    console.log(req.body);
        UsersNames.updateOne({"_id":req.session._id},{$set:{"isActive":"true","name":req.body.name,"DOB":req.body.DOB,"city":req.body.city,"gender":req.body.gender,"phoneno":req.body.phoneno,"city":req.body.city,"interests":req.body.interests,
          "aboutyou":req.body.aboutyou,"expectations":req.body.expectations}},function(error,result){
            
            
    if(error)
        throw error;
             else
                 {
                     console.log("Updated from /updateprofile");
                 }
        })
})

app.get('/changePassPage' , (req,res)=>{
  if(req.session.isLogin){
    res.render('changepassword',{data: req.session.data});
  } else {
    res.redirect('/');
  } 
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
   //  UsersNames.countDocuments(function(e,count){
   //    var start=parseInt(req.body.start);
   //    var len=parseInt(req.body.length);
   //    console.log(start+" "+len);
   //    UsersNames.find({
   //    }).skip(start).limit(len)
   //  .then(data=> {
   //    res.send({"recordsTotal": count, "recordsFiltered" : count, data})
   //   })
   //   .catch(err => {
   //    res.send(err)
   //   })
   // });
//    if(req.body.role === 'All' && req.body.status === 'All')
// {

//       UsersNames.countDocuments(function(e,count){
//       var start=parseInt(req.body.start);
//       var len=parseInt(req.body.length);

//       UsersNames.find({

//       }).skip(start).limit(len)
//     .then(data=> {
//        if (req.body.search.value)
//                     {
//                         data = data.filter((value) => {
//                             return value.email.includes(req.body.search.value)
//                         })
//                     }
//       res.send({"recordsTotal": count, "recordsFiltered" : count, data})
//      })
//      .catch(err => {
//       res.send(err)
//      })
//    });
// }
if(req.body.role === 'All' && req.body.status === 'All')
{
      UsersNames.countDocuments(function(e,count){
      var start=parseInt(req.body.start);
      var len=parseInt(req.body.length);

      UsersNames.find({

      }).skip(start).limit(len)
    .then(data=> {
      if (req.body.search.value!="")
                    {
                        data = data.filter((value) => {
                            return value.email.includes(req.body.search.value)
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
  destination: './public/uploads/',
  filename: function(req, file, cb){
      cb(null, req.session._id+ path.extname(file.originalname))
      UsersNames.updateOne({"_id":req.session._id},{$set:{"photoloc":'uploads/'+req.session._id+ path.extname(file.originalname)}},function(error,result){

  })
    }

});

var upload = multer({
  storage: storage,
  limits:{fileSize: 1000000},
  fileFilter: function(req, file, callback) {
    validateFile(file, callback)
  }
}).single('file');

// const upload = multer({
//   storage: storage,
// }).single('file');
  
  
  
  function validateFile(file, callback) {
  let extensions = ['jpg', 'png', 'gif', 'jpeg'];
  let isAllowed = extensions.includes(file.originalname.split('.')[1].toLowerCase());
  let isAllowedMimeType = file.mimetype.startsWith("image/")
  if(isAllowed && isAllowedMimeType) {
    return callback(null, true);
  } else {
    callback("Erorr: File Type not allowed");
  }
}


app.post('/uploadphoto',(req,res)=>{
  upload(req,res,err=>{
    console.log("photo");
    
     res.render('home',{data: req.session.data});
  })

})

mongoose.connect(mongoDB);

module.exports = app;