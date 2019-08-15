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

var checkSession = function (req, res, next) {
    if(req.session.isLogin)
      next();
    else
      res.redirect('/');
}

var tag = new mongoose.Schema({
    tagname:String,
    createdby:String,
    createddate:String,
    deleted:String
  })

var tagmodel =  mongoose.model('taglists', tag);

app.post('/getTagTable',checkSession,function(req,res) {
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

app.post('/addTag',checkSession,function(req,res){
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
    res.send(error)
  })
})

app.post('/deletetag',checkSession,function(req,res){
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

app.post('/checkDuplicate' ,checkSession, (req,res)=>{
  tagmodel.find({deleted:'0'}).exec(function(error,result) {
  if(error)
    throw error;
  else
  {
    var da=[];
    var returnflag="false";
    da=result;
    for(i in result) {
      if(req.body.tagname==da[i].tagname)
        returnflag="true";
    }
    console.log('Tag duplication /checkDuplicate '+returnflag);
    res.send(returnflag);
  }
  })
})

app.post('/edittag' ,checkSession, (req,res)=>{
  console.log(req.body);
  tagmodel.updateOne({"tagname":req.body.oldtagname},{$set:{"tagname":req.body.newtagname}},function(error,result){
  if(error)
    throw error;
  else
  {
    console.log("Edited from :"+req.body.oldtagname +"to"+req.body.newtagname);
  }
  })
})

module.exports = app;