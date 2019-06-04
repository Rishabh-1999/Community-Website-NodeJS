var express = require('express')
var path = require('path') 
var app = express()
var session= require('express-session')
var nodemailer = require('nodemailer');
const passport = require('passport');

app.use(session({
  secret: "abcUCAChitkara"
}));

//Acces static files
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');
app.set('views',path.join(__dirname, 'views'));

app.use('/tagTable' , require('./routes/tagtable'))
app.use('/userTable' , require('./routes/usertable'))
app.use('/superadmincommunityTable' , require('./routes/superadmincommunity'))
// app.use('/mailsender' , require('./routes/mailsender'))

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

mongoose.connect(mongoDB);

app.get('/home' , (req,res)=>{
  if(req.session.isLogin){
    res.render('home',{data: req.session.data});
  } else {
    res.redirect('/');
  }  
})

app.get('/loading' , (req,res)=>{
  if(req.session.isLogin){
    res.render('loading',{data: req.session.data});
  } else {
    res.redirect('/');
  }  
})

app.get('/addCommunity' , (req,res)=>{
  if(req.session.isLogin){
    res.render('addCommunity',{data: req.session.data});
  } else {
    res.redirect('/');
  }  
})

app.get('/communityalllists' , (req,res)=>{
  if(req.session.isLogin){
    res.render('communityalllists',{data: req.session.data});
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

app.get('/table' , (req,res)=>{
  if(req.session.isLogin){
    res.render('table',{data: req.session.data});
  } else {
    res.redirect('/');
  } 
})

app.get('/communityPage' , (req,res)=>{
  if(req.session.isLogin){
    res.render('communitylists',{data: req.session.data});
  } else {
    res.redirect('/');
  } 
})

app.get('/superadmincommunityPage' , (req,res)=>{
  if(req.session.isLogin){
    res.render('superadmincommunitylists',{data: req.session.data});
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


app.get('/addUser' , (req,res)=>{
  if(req.session.isLogin){
    res.render('addUser',{data: req.session.data});
  } else {
    res.redirect('/');
  }  
})

app.get('/homewithedit' , (req,res)=>{
  if(req.session.isLogin){
    res.render('homewithedit',{data: req.session.data});
  } else {
    res.redirect('/');
  }  
})

app.get('/editprofile' , (req,res)=>{
  if(req.session.isLogin){
    res.render('editprofile',{data: req.session.data});
  } else {
    res.redirect('/');
  }  
})

app.get('/changePassPage' , (req,res)=>{
  if(req.session.isLogin){
    res.render('changepassword',{data: req.session.data});
  } else {
    res.redirect('/');
  } 
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
    if (error)
        res.send("false");
    else {
        console.log('success');
        res.send("true");
    }
});
})

app.post('/logout',function (req, res) {
    req.session.destroy();
    res.redirect('/');
    console.log('logout');
})

console.log("Running on port 3000");
app.listen(3000)
