var express = require('express')
var path = require('path') 
var app = express()
var session= require('express-session')

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

var user = new mongoose.Schema({
    email: String,
    password: String,
    gender: String,
    phoneno: Number,
    city: String,
    name:String,
    DOB: String,
    role:String
  })

var UsersNames =  mongoose.model('usernames', user);

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
        req.session.name=req.body.username;
        req.session.data=result;
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
      gender: null,
      DOB: null,
      phoneno: req.body.phoneno,
      city: req.body.city,
      name: req.body.name,
      role: req.body.role
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

app.get('/logout',function (req, res) {
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
