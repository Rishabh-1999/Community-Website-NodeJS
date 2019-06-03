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

app.post('/getTagTable',function(req,res) {
  tagmodel.countDocuments(function(e,count){
    var start=parseInt(req.body.start);
    var len=parseInt(req.body.length);
    tagmodel.find({
    }).skip(start).limit(len)
      .then(data=> {
        if (req.body.search.value!="")
                    {
                        data = data.filter((value) => {
                            return value.tagname.includes(req.body.search.value)
                        })
                    }
    res.send({"recordsTotal": count, "recordsFiltered" : count, data})
    })
       .catch(err => {
        res.send(err)
      })
  });
  console.log('Tag Table Successfully fetched /getTagTable');
})

app.post('/addTag',function(req,res){
  let newTag = new tagmodel({
    tagname: req.body.value,
    createdby: req.session.name,
    createddate: req.body.datestr
  })
  newTag.save()
  .then(data => {
  console.log('Tag Added /addTag');
  res.render('tagpage',{data: req.session.data});
  })
  .catch(err => {
  console.error(err)
  res.send(error)
  })
})

app.post('/deletetag',function(req,res){
  tagmodel.findOneAndDelete({tagname: req.body.tagname,createdby:req.body.createdby,createddate:req.body.createddate})
  .then(data => {
    res.send(data)
  })
  .catch(err => {
        res.send(error)
  })
  console.log('Tag deleted /deletetag');
})

mongoose.connect(mongoDB);

module.exports = app;