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

var checkSession = function (req, res, next) {
    if(req.session.isLogin)
      next();
    else
      res.redirect('/');
}

var checkSuperAdmin = function (req, res, next) {
    console.log(req);
    if(req.session.data.role=="SuperAdmin")
      next();
    else
      res.redirect('/');
}

app.get('/home' ,checkSession, (req,res)=>{
    res.render('home',{data: req.session.data});
})

app.get('/loading' ,checkSession, (req,res)=>{
    res.render('loading',{data: req.session.data});
})

app.get('/addCommunity' ,checkSession,checkSuperAdmin, (req,res)=>{
    res.render('addCommunity',{data: req.session.data}); 
})

app.get('/communityalllists' ,checkSession, (req,res)=>{
    res.render('communityalllists',{data: req.session.data}); 
})

app.get('/taglists' ,checkSession, (req,res)=>{
    res.render('taglists',{data: req.session.data}); 
})

app.get('/table' ,checkSession,checkSuperAdmin, (req,res)=>{
    res.render('table',{data: req.session.data});
})

app.get('/communityPage' ,checkSession, (req,res)=>{
    res.render('communitylists',{data: req.session.data});
})

// app.get('/communityprofile' ,checkSession, (req,res)=>{
//     res.render('communityprofile',{data: req.session.data}); 
// })

app.get('/superadmincommunityPage' ,checkSession,checkSuperAdmin, (req,res)=>{
    res.render('superadmincommunitylists',{data: req.session.data});
})

app.get('/tagpage' ,checkSession, (req,res)=>{
    res.render('tagpage',{data: req.session.data}); 
})


app.get('/addUser' ,checkSession,checkSuperAdmin, (req,res)=>{
    res.render('addUser',{data: req.session.data}); 
})

app.get('/homewithedit' ,checkSession, (req,res)=>{
    res.render('homewithedit',{data: req.session.data});
})

app.get('/editprofile' ,checkSession, (req,res)=>{
    res.render('editprofile',{data: req.session.data});
})

app.get('/editcommunity' ,checkSession, (req,res)=>{
    res.render('editcommunity',{data: req.session.data}); 
})

app.get('/changePassPage' ,checkSession, (req,res)=>{
    res.render('changepassword',{data: req.session.data});
})

let transporter = nodemailer.createTransport({
  service:'gmail',
    auth: {
        user: '',
        pass: ''
    },
    tls: {
          rejectUnauthorized: false
      }
});

app.post('/sendMail',checkSession, function(req,res){
  console.log(req.body);
  transporter.sendMail(req.body, (error, info) => {
    if (error)
        res.send("false");
    else {
        console.log('success');
        res.send("true");
    }
});
res.send("true");
})

app.post('/logout',checkSession,function (req, res) {
  req.session.destroy();
  res.redirect('/');
  console.log('logouted');
})

console.log("Running on port 3000");
app.listen(3000)