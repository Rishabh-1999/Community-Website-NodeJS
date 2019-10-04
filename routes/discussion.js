const express = require('express');
const path = require('path');
var bodyParser = require('body-parser')
const app = express.Router();

/* parse application/x-www-form-urlencoded */
app.use(bodyParser.urlencoded({ extended: true }))

/* parse application/json */
app.use(bodyParser.json())

/* Middleware */
var middleware = require('../middlewares/middleware');

/* models required */
var discussion = require('../models/discussion');
var comment = require('../models/comment');
var reply = require('../models/reply');

/* create new discussion */
app.post('/addnewDiscussion',function (req, res) {
    discussion.create(req.body,function(error,result)
    {
      if(error)
        res.send("false");
      else {
        console.log("New Dicussion Added /addnewDiscussion");
        res.send("true");
      }
    })
})

/* fetch all community discussions */
app.post('/getDiscussion',middleware.checkSession,function(req,res) {
  discussion.find({ "communityId" : req.body.communityId}).exec(function (err, result) {
   if (err) 
    return err;
  else {
    console.log("get Dicussion /getDiscussion");
    res.send(result)
  }
  })
})

/* Get all reply for a comment */
app.post('/getReply',middleware.checkSession,function(req,res) {
  reply.find({"commentId": req.body.commentId},function(err,data)
  {
      if(err)
        throw err;
      else {
        console.log("Get Reply /getReply")
        res.send(data)
      }
  });
})

/* discussion owner */
app.get('/discussionOwner/:pros',middleware.checkSession,function(req,res) {
    var id = req.params.pros.toString();
    users.findOne({ "_id": id },function(err,data)
    {
        if(err)
        throw err;
        else
            res.render('discussionOwnerInfo', {data: req.session.data,newdata:data});
    });
})

/* Get comment for a dicussion */
app.post('/getComments',middleware.checkSession,function(req,res) {
  comment.find({ "discussionId": req.body.discussionId },function(err,data)
  {
      if(err)
      throw err;
      else {
        console.log("get comments /getComments");
          res.send(data)
      }
  });
})

/* delete discussions */
app.delete('/deleteDiscussion/:pros',middleware.checkSession,function(req,res) {
    var id = req.params.pros.toString();
    discussion.deleteOne({ "_id": id },function(err,data)
    {
        if(err)
          res.send("false")
        else {
          console.log("delete dicussion /deleteDiscussion");
          res.send("true");
        }
    });
})

module.exports = app;