var express = require('express')
var path = require('path') 
var app = express()
var session= require('express-session')
var nodemailer = require('nodemailer');

app.use(session({
  secret: "abcUCAChitkara"
}));

//Acces static files
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');
app.set('views',path.join(__dirname, 'views'));

//Bodyparser
app.use(express.urlencoded({extended: true})); 
app.use(express.json()); 

//Connect with db
var mongoose = require('mongoose');
var mongoDB = 'mongodb://localhost/myDB';

mongoose.connection.on('error', (err) => {
    console.log('DB connection Error');
});
mongoose.connection.on('connected', (err) => {
    console.log('DB connected');
});

app.get('/home' , (req,res)=>{
  if(req.session.isLogin){
    res.render('home',{data: req.session.data});
  } else {
    res.redirect('/');
  }  
})

app.get('/taglists' , (req,res)=>{
  if(req.session.isLogin){
    res.render('taglists',{data: req.session.data});
  } else {
    res.redirect('/');
  }  
})

app.get('/tagpage' , (req,res)=>{
  if(req.session.isLogin){
    res.render('tagpage',{data: req.session.data});
  } else {
    res.redirect('/');
  }  
})

app.get('/taglists' , (req,res)=>{
  if(req.session.isLogin){
    res.render('taglists',{data: req.session.data});
  } else {
    res.redirect('/');
  }  
})

app.get('/addUser' , (req,res)=>{
  if(req.session.isLogin){
    res.render('addUser',{data: req.session.data});
  } else {
    res.redirect('/');
  }  
})

app.get('/table' , (req,res)=>{
  if(req.session.isLogin){
    res.render('table',{data: req.session.data});
  } else {
    res.redirect('/');
  } 
})

app.post('/usersTable' , function(req, res) {
  console.log(req.body);
    UsersNames.countDocuments(function(e,count){
      var start=parseInt(req.body.start);
      var len=parseInt(req.body.length);
      console.log(start+" "+len);
      UsersNames.find({
      }).skip(start).limit(len)
    .then(data=> {
      res.send({"recordsTotal": count, "recordsFiltered" : count, data})
     })
     .catch(err => {
      res.send(err)
     })
   });
  })

/*
app.get('/users',(req,res) => {
  var pageNo = parseInt(req.query.pageNo)
  var size = parseInt(req.query.size)
  var query = {}
  if(pageNo < 0 || pageNo === 0) {
        response = {"error" : true,"message" : "invalid page number, should start with 1"};
        return res.json(response)
  }
  query.skip = size * (pageNo - 1)
  query.limit = size
  // Find some documents
       user.count({},function(err,totalCount) {
             if(err) {
               response = {"error" : true,"message" : "Error fetching data"}
             }
         user.find({},{},query,function(err,data) {
              // Mongo command to fetch all data from collection.
            if(err) {
                response = {"error" : true,"message" : "Error fetching data"};
            } else {
                var totalPages = Math.ceil(totalCount / size)
                response = {"error" : false,"message" : data,"pages": totalPages};
            }
            res.json(response);
         });
       })
})*/

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

app.post('/changepass',(req,res)=>{
    console.log(req.body);
    console.log(req.session.password);
    if(req.body.oldpass!=req.session.password)
        res.send("0");
    else{
        UsersNames.updateOne({"_id":req.session._id},{$set:{"password":req.body.newpass}},function(error,result){
            
    if(error)
        throw error;
            else
                req.session.password=req.body.newpass;
            
        })
        res.send("1");
    }
})

var user = new mongoose.Schema({
    email: String,
    password: String,
    gender: String,
    phoneno: Number,
    city: String,
    name:String,
    DOB: String,
    role:String,
    status:String,
    restrict:String
  })

var UsersNames =  mongoose.model('usernames', user);

var tag = new mongoose.Schema({
    tagname:String,
    createdby:String,
    createddate:String
  })
var tagmodel =  mongoose.model('taglists', tag);

mongoose.connect(mongoDB);

/*
app.use('/login', function(req, res, next){
  if(req.session.isLogin){
    console.log("Already loggedIn")
  } else {
    req.session.isLogin = 1;
    res.render('main',{data: req.session.data});
  }  
   next();
  });*/

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


app.get('/getTable',function(req,res)
{
   var data=UsersNames.find({}).exec(function(error,result)                           {
    if(error)
        throw error;
    else
        res.send(JSON.stringify(result));
  })
})

app.post('/activateUser',function(req,res)
{
   console.log(req.body);
        UsersNames.updateOne({"email":req.body.email},{$set:{"restrict":"true"}},function(error,result){
            
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
        UsersNames.updateOne({"email":req.body.email},{$set:{"restrict":"false"}},function(error,result){
    if(error)
        throw error;
             else
                 {
                     if(req.session.emailid==req.body.old)
                req.session.emailid=req.body.emailid;
                 }
        })
})

app.get('/getTagTable',function(req,res)
{
   var data=tagmodel.find({}).exec(function(error,result)                           {
    if(error)
        throw error;
    else
        res.send(JSON.stringify(result));
  })
})

app.post('/addTag',function(req,res){
    console.log(req.body);
    let newTag = new tagmodel({
      tagname: req.body.value,
    createdby: req.session.name,
    createddate: req.body.datestr
    })
    newTag.save()
     .then(data => {
       console.log(data)
       res.send(data)
     })
     .catch(err => {
       console.error(err)
       res.send(error)
     })
})

let transporter = nodemailer.createTransport({
  service:'gmail',
    auth: {
        user: 'rishabhanand33@gmail.com',
        pass: 'THMA15/11/99'
    },
    tls: {
          rejectUnauthorized: false
      }
});

app.post('/sendMail',function(req,res){
  console.log(req.body);
  transporter.sendMail(req.body, (error, info) => {
    if (error) {
        return console.log(error.message);
    }
    console.log('success');
});
})

app.post('/deletetag',function(req,res){
  console.log(req.body);
    tagmodel.findOneAndDelete({_id: req.body._id})
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
app.post('/addUserToDataBase',function (req, res) {
    console.log(req.body);
    let newProduct = new UsersNames({
      email: req.body.email,
      password: req.body.password,
      gender: null,
      DOB: null,
      phoneno: req.body.phoneno,
      city: req.body.city,
      name: req.body.name,
      role: req.body.role,
      restrict: "true",
      status:  "Pending"
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

app.post('/logout',function (req, res) {
    req.session.destroy();
    console.log('logout');
})

console.log("Running on port 3000");
app.listen(3000)
/*
  // Add in db
app.post('/checkLogin',function (req, res) {
    console.log(req.body);
    var bn=new Object();
    bn.name="test";
bn.gender="Male";
bn.email="admin@gmail.com";
bn.city="chandigarh";
bn.DOB=""
    let newProduct = new product({
      Name: req.body.name,
      password: req.body.password
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
  
  //Get from DB
  app.get('/getData',function(req,res){
      product.find({
           // search query
           //productName: 'mlbTvrndc'  
      })
      .then(data => {
          console.log(data)
          res.send(data)
        })
        .catch(err => {
          console.error(err)
          res.send(error)
        })
  })

  app.post('/updateProduct',function(req,res){
    console.log(req.body);
    product.findOneAndUpdate(
    {
        productName: req.body.pname  // search query
    }, 
    {
      productName: req.body.newname   // field:values to update
    },
    {
      new: true,                       // return updated doc
      runValidators: true              // validate before update
    })
    .then(data => {
        console.log(data)
        res.send(data)
      })
      .catch(err => {
        console.error(err)
        res.send(error)
      })
})

app.post('/deleteproduct',function(req,res){
    console.log(req.body);
    product.findOneAndDelete({productName: req.body.name})
    .then(data => {
        console.log(data)
        res.send(data)
      })
      .catch(err => {
        console.error(err)
        res.send(error)
      })
})*/
