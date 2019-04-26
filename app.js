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

app.get('/topbar' , (req,res)=>{
  res.render('topbar');
})

app.get('/main' , (req,res)=>{
  res.render('main',{data: req.session.data});
})

app.get('/addUser' , (req,res)=>{

  res.render('addUser');
})

app.get('/index' , (req,res)=>{
  consle.log('req.session.isLogin')
  if(req.session.isLogin==1)
  res.render('main',{data: req.session.data});
  else {
  req.send('index')
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

app.post('/checkLogin',function(req,res){

  var username=req.body.username;
  console.log(username);
  var password=req.body.password;
  console.log(password);
    UsersNames.findOne({name: username,password:password}, function(err, u) {
      console.log(u);
      if(u!=null)
      {
        
        req.session.isLogin=1;
        req.session.name=req.body.username;
        req.session.data=u;
        res.send("true");
      }
      else
        res.send("false");  
      })
      .catch(err => {
        console.error(err)
        res.send(error)
      })
})




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
console.log("Running on port 3000");
app.listen(3000)