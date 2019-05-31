const express = require('express');
const path = require('path');
var bodyParser = require('body-parser')
const app = express.Router();


// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())


var mongoose = require('mongoose');
var mongoDB = 'mongodb://localhost/myDB';

var tag = new mongoose.Schema({
    tagname:String,
    createdby:String,
    createddate:String
  })
var tagmodel =  mongoose.model('taglists', tag);


app.post('/getTagTable',function(req,res)
{
  console.log("--------------");
  console.log(req.body);
  console.log("--------------");
    tagmodel.countDocuments(function(e,count){
      var start=parseInt(req.body.start);
      var len=parseInt(req.body.length);
      console.log(start+" "+len);
      tagmodel.find({
      }).skip(start).limit(len)
    .then(data=> {
      res.send({"recordsTotal": count, "recordsFiltered" : count, data})
     })
     .catch(err => {
      res.send(err)
     })
   });
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
      res.render('tagpage',{data: req.session.data});
     })
     .catch(err => {
       console.error(err)
       res.send(error)
     })
})

app.post('/deletetag',function(req,res){
  console.log(req.body);
    tagmodel.findOneAndDelete({tagname: req.body.tagname,createdby:req.body.createdby,createddate:req.body.createddate})
    .then(data => {
        console.log(data)
        res.send(data)
      })
      .catch(err => {
        console.error(err)
        res.send(error)
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


mongoose.connect(mongoDB);

module.exports = app;