const express = require('express');
const path = require('path');
var bodyParser = require('body-parser')
const app = express.Router();

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }))

// parse application/json
app.use(bodyParser.json())

var discussion = require('../models/discussion');

var mongoose = require('mongoose');
var mongoDB = 'mongodb://localhost/myDB';

var checkSession = function (req, res, next) {
    if(req.session.isLogin)
      next();
    else
      res.redirect('/');
}

var checkSuperAdmin = function (req, res, next) {
  if(req.session.data.role=="SuperAdmin")
    next();
  else
    res.redirect('/');
}

/* create new discussion */
app.post('/addnewDiscussion',function (req, res) {
    discussion.create(req.body,function(error,result)
    {
      if(error)
      throw error;
      else
      {}
    })
     res.send("data saved");
})

// fetch all community discussions
app.post('/getDiscussion',function(req,res) {

  discussion.find({ "communityName" : req.body.communityName}).exec(function (err, result) {
   if (err) 
    return err;
  else
  {
    res.send(result)
  }
  })
})

// discussion owner //
app.get('/discussionOwner/:pros',function(req,res) {
    var id = req.params.pros.toString();
    users.findOne({ "_id": id },function(err,reses)
    {
        if(err)
        throw err;
        else
        {
            res.render('discussionOwnerInfo', {data: req.session.data,newdata:reses});
            //res.send("data deleted SUCCESFULLY")

        }
    });
})

// delete discussions //
app.delete('/deleteDiscussion/:pros',function(req,res) {
    var id = req.params.pros.toString();
    discussion.deleteOne({ "_id": id },function(err,reses)
    {
        if(err)
        throw err;
        else
        {
          res.send("data deleted SUCCESFULLY");
        }
    });
})

var dicussion = mongoose.model('discussiones');

module.exports = app;