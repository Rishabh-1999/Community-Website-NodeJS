var express = require('express');
var path = require('path');
var app = express();
var session= require('express-session');
var nodemailer = require('nodemailer');
var mongoStore = require('connect-mongo')(session);
var favicon = require('serve-favicon');
require('dotenv').config();

var http = require("http").Server(app);
var io = require("socket.io")(http);

/* Acces static files */
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');
app.set('views',path.join(__dirname, 'views'));
app.use(favicon(path.join(__dirname, 'public//images/', 'favicon.ico')));

/* Mongoose Connectopn */
var mongoose = require('mongoose');
var mongoDB = 'mongodb://localhost/myDB';
mongoose.Promise = global.Promise;
var db = mongoose.connection;
mongoose.set('useCreateIndex', true);
mongoose.connect(mongoDB,{ useNewUrlParser: true });

/* Session */
app.use(session({
    secret: "abcUCAChitkara",
    resave: true,
    saveUninitialized: false,
    store : new mongoStore({mongooseConnection:db})
  }));

/* Middleware */
var middleware = require('./middlewares/middleware');

/* Routing Implementation */
app.use('/tagTable' , require('./routes/tagtable'));
app.use('/userTable' , require('./routes/usertable'));
app.use('/communityTable' , require('./routes/community'));
app.use('/discussion' , require('./routes/discussion'));

/* Models Required */
var discussion = require('./models/discussion');
var comment = require('./models/comment');
var reply = require('./models/reply');

/* Bodyparser */
app.use(express.urlencoded({extended: true})); 
app.use(express.json()); 

/* Mongoose Connection Checking */
mongoose.connection.on('error', (err) => {
    console.log('DB connection Error');
});

mongoose.connection.on('connected', (err) => {
    console.log('DB connected');
});

/* Views */
/* Login Page */
app.get('/' ,middleware.isAllowed, (req,res)=>{
    res.redirect('/');
})

/* Profile Page */
app.get('/home' ,middleware.checkSession, (req,res)=>{
    res.render('home',{data: req.session.data});
})

/* Profile Page with Edit option */
app.get('/homewithedit' ,middleware.checkSession, (req,res)=>{
    res.render('homewithedit',{data: req.session.data});
})

/* Add User Page */
app.get('/addUser' ,middleware.checkSession,middleware.checkSuperAdmin, (req,res)=>{
    res.render('addUser',{data: req.session.data}); 
})

/* User Table Page */
app.get('/usertable' ,middleware.checkSession,middleware.checkSuperAdmin, (req,res)=>{
    res.render('usertable',{data: req.session.data});
})

/* Tag Creation Page */
app.get('/tagpage' ,middleware.checkSession, (req,res)=>{
    res.render('tagpage',{data: req.session.data}); 
})

/* Tag Table Page */
app.get('/taglists' ,middleware.checkSession, (req,res)=>{
    res.render('taglists',{data: req.session.data}); 
})

/* Add Community Page */
app.get('/invitedbycommunity' ,middleware.checkSession, (req,res)=>{
    res.render('invitedbycommunity',{data: req.session.data}); 
})

/* Add Community Page */
app.get('/addCommunity' ,middleware.checkSession,middleware.checkSuperAdminOrCommunityManagers, (req,res)=>{
    res.render('addCommunity',{data: req.session.data}); 
})

/* Community Table Page */
app.get('/communitytable' ,middleware.checkSession,middleware.checkSuperAdmin, (req,res)=>{
    res.render('communitytable',{data: req.session.data});
})

/* Edit Community Page */
app.get('/editcommunity' ,middleware.checkSession, (req,res)=>{
    res.render('editcommunity',{data: req.session.data}); 
})

/* All Community Page */
app.get('/communityalllists' ,middleware.checkSession, (req,res)=>{
    res.render('communityalllists',{data: req.session.data}); 
})

/* Community Page */
app.get('/communityPage' ,middleware.checkSession, (req,res)=>{
    res.render('communitylists',{data: req.session.data});
})

/* Change Password Page */
app.get('/changePassPage' ,middleware.checkSession, (req,res)=>{
    res.render('changepassword',{data: req.session.data});
})

/* Mail transporter */
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

/* POST function for mail send */
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

/* Logout Function */
app.post('/logout',middleware.checkSession,function (req, res) {
  req.session.destroy();
  res.redirect('/');
  console.log('logouted');
})

/* Socket for comment */
io.on('connection',function(socket){
    socket.on('comment',function(data){
        console.log(data);
        var commentData = new comment(data);
        commentData.save();
        socket.broadcast.emit('comment',data);  
    });
  });

/* Socket for replies */
io.on('connection',function(socket){
    socket.on('reply',function(data){
        console.log(data);
        var replyData = new reply(data);
        replyData.save();
        socket.broadcast.emit('reply',data);  
    });
});
  

console.log("Running on port 3000");
http.listen(3000)