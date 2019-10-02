var express = require('express')
var path = require('path') 
var app = express()
var session= require('express-session')
var nodemailer = require('nodemailer');
var mongoStore = require('connect-mongo')(session);
var favicon = require('serve-favicon');
require('dotenv').config()

//Acces static files
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');
app.set('views',path.join(__dirname, 'views'));
app.use(favicon(path.join(__dirname, 'public//images/', 'favicon.ico')));

var mongoose = require('mongoose');
var mongoDB = 'mongodb://localhost/myDB';
mongoose.Promise = global.Promise;

var db = mongoose.connection;

mongoose.set('useCreateIndex', true)
app.use(session({
    secret: "abcUCAChitkara",
    resave: true,
    saveUninitialized: false,
    store : new mongoStore({mongooseConnection:db})
  }));

var middleware = require('./middlewares/middleware');

app.use('/tagTable' , require('./routes/tagtable'))
app.use('/userTable' , require('./routes/usertable'))
app.use('/communityTable' , require('./routes/community'))
app.use('/discussion' , require('./routes/discussion'))

//Bodyparser
app.use(express.urlencoded({extended: true})); 
app.use(express.json()); 

mongoose.connection.on('error', (err) => {
    console.log('DB connection Error');
});

mongoose.connection.on('connected', (err) => {
    console.log('DB connected');
});

mongoose.connect(mongoDB,{ useNewUrlParser: true });

app.get('/' ,middleware.isAllowed, (req,res)=>{
    res.redirect('/');
})

app.get('/home' ,middleware.checkSession, (req,res)=>{
    res.render('home',{data: req.session.data});
})

app.get('/addCommunity' ,middleware.checkSession,middleware.checkSuperAdminOrCommunityManagers, (req,res)=>{
    res.render('addCommunity',{data: req.session.data}); 
})

app.get('/communityalllists' ,middleware.checkSession, (req,res)=>{
    res.render('communityalllists',{data: req.session.data}); 
})

app.get('/taglists' ,middleware.checkSession, (req,res)=>{
    res.render('taglists',{data: req.session.data}); 
})

app.get('/usertable' ,middleware.checkSession,middleware.checkSuperAdmin, (req,res)=>{
    res.render('usertable',{data: req.session.data});
})

app.get('/communityPage' ,middleware.checkSession, (req,res)=>{
    res.render('communitylists',{data: req.session.data});
})

app.get('/communitytable' ,middleware.checkSession,middleware.checkSuperAdmin, (req,res)=>{
    res.render('communitytable',{data: req.session.data});
})

app.get('/tagpage' ,middleware.checkSession, (req,res)=>{
    res.render('tagpage',{data: req.session.data}); 
})

app.get('/addUser' ,middleware.checkSession,middleware.checkSuperAdmin, (req,res)=>{
    res.render('addUser',{data: req.session.data}); 
})

app.get('/homewithedit' ,middleware.checkSession, (req,res)=>{
    res.render('homewithedit',{data: req.session.data});
})

app.get('/editcommunity' ,middleware.checkSession, (req,res)=>{
    res.render('editcommunity',{data: req.session.data}); 
})

app.get('/changePassPage' ,middleware.checkSession, (req,res)=>{
    res.render('changepassword',{data: req.session.data});
})

let transporter = nodemailer.createTransport({
  service:'gmail',
    auth: {
        user: 'rishabhanand33@gmail.com' ,
        pass: process.env.password
    },
    tls: {
          rejectUnauthorized: false
      }
});

app.post('/sendMail',middleware.checkSession, function(req,res){
  transporter.sendMail(req.body, (error, info) => {
    if (error)
        res.send("false");
    else {
        console.log('success');
        res.send("true");
    }
    });
})

app.post('/logout',middleware.checkSession,function (req, res) {
  req.session.destroy();
  res.redirect('/');
  console.log('logouted');
})

console.log("Running on port 3000");
app.listen(3000)