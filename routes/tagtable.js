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
    createddate:String,
    deleted:String
  })
var tagmodel =  mongoose.model('taglists', tag);

app.post('/getTagTable',function(req,res) {
  tagmodel.countDocuments(function(e,count){
  var start=parseInt(req.body.start);
  var len=parseInt(req.body.length);

  tagmodel.find({deleted:'0'}).skip(start).limit(len)
  .then(data=> {
  if (req.body.customsearch!="") {
    data = data.filter((value) => {
            flag = value.tagname.includes(req.body.customsearch) || value.createddate.includes(req.body.customsearch)
             || value.createdby.includes(req.body.customsearch) ;
            return flag;
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
    createddate: req.body.datestr,
    deleted: '0'
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
  tagmodel.updateOne({tagname: req.body.tagname,createdby:req.body.createdby,createddate:req.body.createddate},
    {$set:{"deleted":"1"}})
  .then(data => {
    res.send(data)
  })
  .catch(err => {
        res.send(error)
  })
  console.log('Tag deleted /deletetag');
})

app.post('/checkDuplicate' , (req,res)=>{
  var data=tagmodel.find({deleted:'0'}).exec(function(error,result)    {
  if(error)
    throw error;
  else
  {
    var da=[];
    var rew="false";
    da=result;
    for(i in result)
    {
      if(req.body.tagname==da[i].tagname)
      {
        rew="true";
      }
    }
      res.send(rew);
  }
})
})

// mongoose.connect(mongoDB);

module.exports = app;