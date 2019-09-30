const express = require('express');
const path = require('path');
var bodyParser = require('body-parser')
const app = express.Router();

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }))

// parse application/json
app.use(bodyParser.json())

var middleware = require('../middlewares/middleware');

var tagmodel = require('../models/tag');

app.post('/getTagTable',middleware.checkSession,middleware.checkSuperAdmin,function(req,res) {
  let query = {deleted:'0'};
    let params = {};

    if(req.body.customsearch)
    {
        query.name = {"$regex" : req.body.customsearch , "$options" : "i"};
    }

    let sortingType;
    if(req.body.order[0].dir === 'asc')
        sortingType = 1;
    else
        sortingType = -1;

    if(req.body.order[0].column === '0')
        params = {skip : parseInt(req.body.start) , limit : parseInt(req.body.length), sort : {tagname : sortingType}}; 
   
        tagmodel.find(query , {} , params , function (err , data)
        {
            if(err)
                console.log(err);
            else
            {
                tagmodel.countDocuments(query, function(err , filteredCount)
                {
                    if(err)
                        console.log(err);
                    else
                    {
                        tagmodel.countDocuments(function (err, totalCount)
                        {
                            if(err)
                                console.log(err);
                            else
                                res.send({"recordsTotal": totalCount,
                                    "recordsFiltered": filteredCount, data});
                        })
                    }
                });
            }
        })
  console.log('Tag Table Successfully fetched ->/getTagTable');
})

app.post('/addTag',middleware.checkSession,middleware.checkSuperAdmin,function(req,res){
  let newTag = new tagmodel({
    tagname: req.body.value,
    createdby: req.session.name,
    createddate: req.body.datestr,
    deleted: '0'
  })
  newTag.save()
  .then(data => {
    console.log('Tag Added ->/addTag');
    res.render('tagpage',{data: req.session.data});
  })
  .catch(err => {
    res.send(error)
  })
})

app.post('/deletetag',middleware.checkSession,middleware.checkSuperAdmin,function(req,res) {
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

app.post('/checkDuplicate' ,middleware.checkSession,middleware.checkSuperAdmin, (req,res)=>{
  tagmodel.find({deleted:'0'}).exec(function(error,result) {
  if(error) {
    console.log(error);
    throw error;
  }
  else
  {
    var temp=[];
    var returnflag="false";
    temp=result;
    for(i in result) {
      if(req.body.tagname==temp[i].tagname)
        returnflag="true";
    }
    console.log('Tag duplication ->/checkDuplicate ');
    res.send(returnflag);
  }
  })
})

app.post('/edittag' ,middleware.checkSession,middleware.checkSuperAdmin, (req,res)=>{
  tagmodel.updateOne({"tagname":req.body.oldtagname},{$set:{"tagname":req.body.newtagname}},function(error,result){
  if(error) {
    console.log(error);
    throw error;
  }
  else
  {
    console.log("Updated tag ->edittag");
    res.send("updated");
  }
  })
})

module.exports = app;