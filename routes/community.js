const express = require('express');
const path = require('path');
var bodyParser = require('body-parser')
const app = express.Router();
const multer = require('multer');
var mongojs = require('mongojs')

var UsersNames = require('../models/usernames');

var mongoose = require('mongoose');
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({
  extended: true
}))

// parse application/json
app.use(bodyParser.json())

var middleware = require('../middlewares/middleware');

var UsersNames = require('../models/usernames');
var communitys = require('../models/communitys');
var tempcomm;

app.post('/getUsers', middleware.checkSession, function (req, res) {
  communitys.findOne({
    "_id": req.body._id
  }).populate('users').exec(function (err, result) {
    if (err)
      return err;
    else {
      console.log("Got Users for community table /getUsers");
      res.send(JSON.stringify(result.users))
    }
  })
})

// get managers in communityes
app.post('/getManagers', middleware.checkSession, function (req, res) {
  communitys.findOne({
    "_id": req.body._id
  }).populate('managers').
  exec(function (err, result) {
    if (err)
      return err;
    else {
      console.log("Got Users for community table /getManagers")
      res.send(JSON.stringify(result.managers))
    }
  })
})

// get invited users in communityes
app.post('/getinveted', middleware.checkSession, function (req, res) {
  communitys.findOne({
    "_id": req.body._id
  }).populate('invited').
  exec(function (err, result) {
    if (err)
      return err;
    else {
      console.log("Got Users for community table /getinveted")
      res.send(JSON.stringify(result.invited))
    }
  })
})


app.post('/getUsersInvited', middleware.checkSession, function (req, res) {
  communitys.find({
    "invited": {
      "$in": req.session._id
    }
  }).exec(function (err, result) {
    if (err)
      return err;
    else {
      console.log("Got Users for community table /getinveted")
      console.log()
      res.send(result)
    }
  })
})

// get request users in communityes
app.post('/getrequest', middleware.checkSession, function (req, res) {
  communitys.findOne({
    "_id": req.body._id
  }).populate('request').
  exec(function (err, result) {
    if (err)
      return err;
    else {
      console.log("Got Users for community table /getrequest")
      res.send(JSON.stringify(result.request))
    }
  })
})

// Get Community Lists for table 
app.post('/getCommunityLists', middleware.checkSession, function (req, res) {
  let query = {};
  let params = {};

  if (req.body.status === 'Direct')
    query = {
      rule: req.body.status
    };
  else if (req.body.status === 'Permission')
    query = {
      rule: req.body.status
    };

  if (req.body.search.value) {
    query["$or"] = [{
        "email": {
          "$regex": req.body.search.value,
          "$options": "i"
        }
      },
      {
        "name": {
          "$regex": req.body.search.value,
          "$options": "i"
        }
      },
      {
        "DOB": {
          "$regex": req.body.search.value,
          "$options": "i"
        }
      },
      {
        "phoneno": {
          "$regex": req.body.search.value,
          "$options": "i"
        }
      },
      {
        "gender": {
          "$regex": req.body.search.value,
          "$options": "i"
        }
      },
      {
        "city": {
          "$regex": req.body.search.value,
          "$options": "i"
        }
      }
    ]
  }

  let sortingType;
  if (req.body.order[0].dir === 'asc')
    sortingType = 1;
  else
    sortingType = -1;

  if (req.body.order[0].column === '0')
    params = {
      skip: parseInt(req.body.start),
      limit: parseInt(req.body.length),
      sort: {
        name: sortingType
      }
    };
  else if (req.body.order[0].column === '2')
    params = {
      skip: parseInt(req.body.start),
      limit: parseInt(req.body.length),
      sort: {
        communityloc: sortingType
      }
    };
  else if (req.body.order[0].column === '3')
    params = {
      skip: parseInt(req.body.start),
      limit: parseInt(req.body.length),
      sort: {
        owner: sortingType
      }
    };
  else if (req.body.order[0].column === '4')
    params = {
      skip: parseInt(req.body.start),
      limit: parseInt(req.body.length),
      sort: {
        createDate: sortingType
      }
    };

  communitys.find(query, {}, params, function (err, data) {
    if (err)
      console.log(err);
    else {
      communitys.countDocuments(query, function (err, filteredCount) {
        if (err)
          console.log(err);
        else {
          communitys.countDocuments(function (err, totalCount) {
            if (err)
              console.log(err);
            else
              res.send({
                "recordsTotal": totalCount,
                "recordsFiltered": filteredCount,
                data
              });
          })
        }
      });
    }
  });
});

//Join Community
app.post('/joinandrequestcommunity', middleware.checkSession, function (req, res) {
  if (req.body.r == 0) {
    communitys.updateOne({
      "_id": req.body._id
    }, {
      $push: {
        "users": req.session._id
      }
    }, function (error, result) {
      if (error)
        throw error;
      else {
        console.log(req.session._id + " joined community " + req.body._id)
        res.send("true");
      }
    })
  } else {
    communitys.updateOne({
      "_id": req.body._id
    }, {
      $push: {
        "request": req.session._id
      }
    }, function (error, result) {
      if (error)
        throw error;
      else {
        console.log(req.session._id + " requested community " + req.body._id)
      }
      res.send("true");
    })
  }
})

// Update Community Details
app.post('/communityupdate', middleware.checkSession, middleware.checkSuperAdminOrCommunityManagers, function (req, res) {
  communitys.updateOne({
    "_id": req.body.id
  }, {
    $set: {
      "name": req.body.name,
      "status": req.body.status
    }
  }, function (error, result) {
    if (error)
      throw error;
    else {
      console.log("Community " + req.body.id + " updated")
      res.send("true");
    }
  })
})

// Get Array which User is Owner
app.get('/getArrayOwnCommunity', middleware.checkSession, function (req, res) {
  communitys.find({
    'ownerid': req.session._id
  }, function (err, result) {
    console.log("Got Array in which User is Owner");
    res.send(result);
  });
})

// Get Array in which User is Member or managers and Not Owner
app.get('/getArrayOtherCommunity', middleware.checkSession, function (req, res) {
  communitys.find({
    $and: [{
      "users": {
        "$in": [req.session._id]
      }
    }, {
      "ownerid": {
        "$not": {
          "$eq": req.session._id
        }
      }
    }]
  }, function (err, result) {
    console.log("Got Array in which User in Member in Community");
    res.send(result);
  });
})

// Get Array in which User has Requested
app.get('/getArrayOtherCommunityInvited', middleware.checkSession, function (req, res) {
  communitys.find({
    $and: [{
      "invited": {
        "$in": [req.session._id]
      }
    }, {
      "users": {
        "$nin": [req.session._id]
      }
    }, {
      "managers": {
        "$nin": [req.session._id]
      }
    }, {
      "ownerid": {
        "$not": {
          "$eq": req.session._id
        }
      }
    }]
  }, function (err, result) {
    console.log("Got array in which User has Requested to join Community");
    res.send(result);
  });
})

//Function to get Time in PM or AM
function formatAMPM(date) {
  var hours = date.getHours();
  var minutes = date.getMinutes();
  var ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12;
  hours = hours ? hours : 12;
  minutes = minutes < 10 ? '0' + minutes : minutes;
  var strTime = hours + ':' + minutes + ' ' + ampm;
  return strTime;
}

var tempid;

//Add Community
app.post('/addCommunity', middleware.checkSession, middleware.checkSuperAdminOrCommunityManagers, function (req, res) {
  var rule;
  var photoname;
  if (tempcomm == null)
    photoname = "/images/defaultCommunity.jpg";
  else
    photoname = "/uploads/" + tempcomm;
  var dat = new Date();
  var datestr = "";
  datestr = dat.getDate();
  datestr = datestr + "-" + dat.getMonth();
  datestr = datestr + "-" + dat.getFullYear();
  datestr = datestr + " (" + formatAMPM(dat) + ")";
  //"photoloc":"/images/defaultCommunity.jpg",
  let newProduct = new communitys({
    "photoloc": photoname,
    "name": req.body.name,
    "members": null,
    "rule": req.body.rule,
    "communityloc": "Not Known",
    "createdate": datestr,
    "description": req.body.description,
    "owner": req.session.name,
    "status": "Active",
    "ownerid": req.session._id
  })
  newProduct.save()
    .then(data => {
      console.log("->" + data);
      tempid = data._id;
      res.send("true")
      upload(req, res, (err) => {
        if (err)
          throw err;
        else {
          console.log(res);
          tempid = res._id;
          res.send("true")
        }
      })
    })
    .catch(err => {
      console.log(err);
    })
})

var storagecomm = multer.diskStorage({
  destination: './public/uploads/',
  filename: function (req, file, callback) {
    console.log("tempid" + tempid)
    tempcomm = 'community' + tempid + path.extname(file.originalname);
    callback(null, tempcomm);
  }
})

var uploadcomm = multer({
  storage: storagecomm,
}).single('file');

app.post('/uploadphotoCommunity', middleware.checkSession, middleware.checkSuperAdminOrCommunityManagers, (req, res) => {
  console.log("uploadphotoCommunity")
  uploadcomm(req, res, (err) => {
    if (err) {
      throw err;
    } else {
      communitys.updateOne({
        "_id": tempid
      }, {
        $set: {
          "photoloc": '/uploads/' + tempcomm
        }
      }, function (error, result) {
        console.log("photo updated to database" + result)
        communitys.findOne({
          "_id": tempid
        }, function (err, result) {
          if (err)
            throw err;
          else {
            res.render('manageCommunity', {
              data: req.session.data,
              data2: result
            });
          }
        })
      })
    }
  })
})

app.post('/getAllActive', middleware.checkSession, function (req, res) {
  communitys.find({
    'ownerid': {
      "$ne": req.session._id
    },
    "users": {
      "$nin": [req.session._id]
    },
    "request": {
      "$nin": [req.session._id]
    }
  }).skip(req.body.start).limit(req.body.end).exec(function (error, result) {
    res.send(result);
  })
})

app.post('/updatecomm', middleware.checkSession, function (req, res) {
  tempid = req.body._id;
  communitys.findOneAndUpdate({
    "_id": req.body._id
  }, {
    "name": req.body.name,
    "description": req.body.description,
    "rule": req.body.rule
  }, function (err, result) {
    if (err)
      throw err
    else {
      communitys.findOne({
        "_id": req.body._id
      }, function (err, result) {
        if (err)
          throw err;
        else {
          res.send("true")
        }
      })
    }
  });
})


app.get('/:pro', middleware.checkSession, (req, res) => {
  var id = req.params.pro.toString();
  communitys.findOne({
    "_id": id
  }, function (err, result) {
    if (err)
      throw err;
    else {
      console.log("Manage Community");
      res.render('manageCommunity', {
        data: req.session.data,
        data2: result
      });
    }
  })
})

app.get('/edit/:pro', middleware.checkSession, (req, res) => {
  var id = req.params.pro.toString();
  communitys.findOne({
    "_id": id
  }, function (err, result) {
    if (err)
      throw err;
    else {
      console.log("Edit Profile of Community");
      res.render('editcommunity', {
        data: req.session.data,
        data2: result
      });
    }
  })
})

app.get('/userprofile/:pro', middleware.checkSession, (req, res) => {
  var id = req.params.pro.toString();
  UsersNames.findOne({
    "_id": id
  }, function (err, result) {
    if (err)
      throw err;
    else {
      console.log("User Profile For Community");
      res.render('userprofile', {
        data: req.session.data,
        data2: result
      });
    }
  })
})

app.post('/leaveCommunitybyforce', middleware.checkSession, (req, res) => {
  communitys.updateOne({
    "_id": req.body.commid
  }, {
    $pull: {
      "users": req.body._id
    }
  }, function (error, result) {
    if (error)
      throw error;
    else {
      res.send("true");
    }
  })
})

app.post('/cancelRequestByUser', middleware.checkSession, (req, res) => {
  communitys.updateOne({
    "_id": req.body.commid
  }, {
    $pull: {
      "request": req.body._id
    }
  }, function (error, result) {
    if (error)
      throw error;
    else {
      res.send("true");
    }
  })
})

app.post('/leaveCommunity', middleware.checkSession, (req, res) => {
  communitys.updateOne({
    "_id": req.body.commid
  }, {
    $pull: {
      "users": req.session._id
    }
  }, function (error, result) {
    if (error)
      throw error;
    else {
      res.send("true");
    }
  })
})

var Schema = mongoose.Schema,
  ObjectId = Schema.ObjectId;

app.post('/getUsersOtherThanInCommunity', middleware.checkSession, (req, res) => {
  communitys.findOne({
    "_id": req.body.commid
  }, function (error, communitydata) {
    if (error)
      throw error;
    else {
      communitydata.managers.push(mongoose.mongo.ObjectId(communitydata.ownerid))
      UsersNames.find({
        "$and": [{
          "$and": [{
            "$and": [{
              "$and": [{
                "_id": {
                  "$nin": communitydata.managers
                },
                "_id": {
                  "$nin": communitydata.users
                }
              }],
              "_id": {
                "$nin": communitydata.invited
              }
            }],
            "_id": {
              "$nin": communitydata.request
            }
          }],
          "_id": {
            "$nin": communitydata.ownerid
          }
        }]
      }, function (error, result) {
        if (error)
          console.log(error)
        res.send(result)
      });
    }
  });
})


app.post('/promoteusers', middleware.checkSession, (req, res) => {
  communitys.updateOne({
    "_id": req.body.commid
  }, {
    $pull: {
      "users": req.body._id
    },
    $push: {
      "managers": req.body._id
    }
  }, function (error, result) {
    if (error)
      throw error;
    else {
      res.send("true");
    }
  })
})

app.post('/sendInvite', middleware.checkSession, (req, res) => {
  communitys.updateOne({
    "_id": req.body.commid
  }, {
    $push: {
      "invited": req.body.invitedid
    }
  }, function (error, result) {
    if (error)
      res.send("false");
    else {
      res.send("true");
    }
  })
})

app.post('/acceptrequest', middleware.checkSession, (req, res) => {
  communitys.updateOne({
    "_id": req.body.commid
  }, {
    $pull: {
      "request": req.body._id
    },
    $push: {
      "users": req.body._id
    }
  }, function (error, result) {
    if (error)
      throw error;
    else {
      res.send("true");
    }
  })
})

app.post('/rejectrequest', middleware.checkSession, (req, res) => {
  communitys.updateOne({
    "_id": req.body.commid
  }, {
    $pull: {
      "request": req.body._id
    }
  }, function (error, result) {
    if (error)
      throw error;
    else {
      res.send("true");
    }
  })
})

app.post('/acceptinvites', middleware.checkSession, (req, res) => {
  communitys.updateOne({
    "_id": req.body._id
  }, {
    $pull: {
      "invited": req.session._id
    },
    $push: {
      "users": req.session._id
    }
  }, function (error, result) {
    if (error)
      throw error;
    else
      res.send("true");
  })
})

app.get('/communitymembers/:pro', middleware.checkSession, (req, res) => {
  var id = req.params.pro.toString();
  communitys.findOne({
    "_id": id
  }, function (err, result) {
    if (err)
      throw err;
    else {
      res.render('communitymembers', {
        data: req.session.data,
        data2: result
      });
    }
  })
})

app.get('/inviteusers/:pro', middleware.checkSession, (req, res) => {
  var id = req.params.pro.toString();
  communitys.findOne({
    "_id": id
  }, function (err, result) {
    if (err)
      throw err;
    else {
      res.render('inviteusers', {
        data: req.session.data,
        data2: result
      });
    }
  })
})

app.post('/inviteusersbyname', middleware.checkSession, (req, res) => {
  UsersNames.findOne({
    "email": req.body.email
  }, function (err, result) {
    communitys.updateOne({
      "_id": req.body.commid
    }, {
      $push: {
        "invited": result._id
      }
    }, function (err, result1) {
      if (err)
        throw err;
      else {
        res.render('inviteusers', {
          data: req.session.data,
          data2: result
        });
      }
    })
  })
})

app.post('/deleteinvited', middleware.checkSession, (req, res) => {
  communitys.updateOne({
    "_id": req.body.commid
  }, {
    $pull: {
      "invited": req.body.id
    }
  }, function (err, result) {
    if (err)
      throw err;
    else {
      res.send("true");
    }
  })
})

app.get('/profile/:pro', middleware.checkSession, (req, res) => {
  var id = req.params.pro.toString();
  communitys.findOne({
    "_id": id
  }, function (err, result) {
    if (err)
      throw err;
    else {
      res.render('communityprofile', {
        data: req.session.data,
        data2: result
      });
    }
  })
})

app.get('/communityDicussion/:pro', middleware.checkSession, (req, res) => {
  var id = req.params.pro.toString();
  communitys.findOne({
    "_id": id
  }, function (err, result) {
    if (err)
      throw err;
    else {
      res.render('discussion', {
        data: req.session.data,
        data2: result
      });
    }
  })
})

module.exports = app