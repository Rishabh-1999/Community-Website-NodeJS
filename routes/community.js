const express = require('express');
const path = require('path');
const bodyParser = require('body-parser')
const app = express.Router();
const multer = require('multer');
var cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECERT
});

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({
  extended: true
}))

// parse application/json
app.use(bodyParser.json())

// MIddleware
var middleware = require('../middlewares/middleware');

// Controllers
var controllers = require("../controllers");

// Models
var communitys = require('../models/communitys');

// get users in communityes
app.post('/getUsers', middleware.checkSession, controllers.community.getUsers);

// get managers in communityes
app.post('/getManagers', middleware.checkSession, controllers.community.getManagers);

// get invited users in communityes
app.post('/getinveted', middleware.checkSession, controllers.community.getinveted);

// get users invited in communityes
app.post('/getUsersInvited', middleware.checkSession, controllers.community.getUsersInvited);

// get request users in communityes
app.post('/getrequest', middleware.checkSession, controllers.community.getrequest);

// Get Community Lists for table 
app.post('/getCommunityLists', middleware.checkSession, controllers.community.getCommunityLists);

//Join Community
app.post('/joinandrequestcommunity', middleware.checkSession, controllers.community.joinandrequestcommunity);

// Update Community Details
app.post('/communityupdate', middleware.checkSession, middleware.checkSuperAdminOrCommunityManagers, controllers.community.communityupdate);

// Get Array which User is Owner
app.get('/getArrayOwnCommunity', middleware.checkSession, controllers.community.getArrayOwnCommunity);

// Get Array in which User is Member or managers and Not Owner
app.get('/getArrayOtherCommunity', middleware.checkSession, controllers.community.getArrayOtherCommunity);

// Get Array in which User has Requested
app.get('/getArrayOtherCommunityInvited', middleware.checkSession, controllers.community.getArrayOtherCommunityInvited);

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
var tempcomm;

//Add Community
app.post('/addCommunity', middleware.checkSession, middleware.checkSuperAdminOrCommunityManagers, function (req, res) {
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
    "owner": req.session.passport.user.name,
    "status": "Active",
    "ownerid": req.session.passport.user._id
  })
  newProduct.save()
    .then(data => {
      tempid = data._id;
      res.send("true")
      upload(req, res, (err) => {
        if (err)
          throw err;
        else {
          tempid = res._id;
          res.send("true")
        }
      })
    })
    .catch(err => {
      console.log(err);
    })
})

// var storagecomm = multer.diskStorage({
//   destination: './public/uploads/',
//   filename: function (req, file, callback) {
//     tempcomm = 'community' + tempid + path.extname(file.originalname);
//     callback(null, tempcomm);
//   }
// })

// var uploadcomm = multer({
//   storage: storagecomm,
// }).single('file');

app.post('/uploadphotoCommunity', middleware.checkSession, middleware.checkSuperAdminOrCommunityManagers, (req, res) => {
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
        communitys.findOne({
          "_id": tempid
        }, function (err, result) {
          if (err)
            throw err;
          else {
            res.render('manageCommunity', {
              data: req.session.passport.user,
              data2: result
            });
          }
        })
      })
    }
  })
})

app.post('/getAllActive', middleware.checkSession, controllers.community.getAllActive);

app.post('/updatecomm', middleware.checkSession, function (req, res) {
  console.log(req.files.communityfile)
  console.log(req.body)
  if (req.files.size != 0) {
    const file = req.files.communityfile;
    var reqpath = "community/" + "community" + "/" + req.session.passport.user._id;
    cloudinary.uploader.upload(
      file.tempFilePath, {
        public_id: reqpath,
        overwrite: true
      },
      function (err, result) {
        if (err) console.log(err);
        else {
          communitys.findOneAndUpdate({
            "_id": req.body._id
          }, {
            "name": req.body.name,
            "description": req.body.description,
            "rule": req.body.rule,
            "photoloc": result.url
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
                  res.writeHead(200, {
                    "Content-Type": "text/html"
                  });
                  res.write('<script>window.location= "/communityPage"</script>');
                  res.end();
                }
              })
            }
          });
        }
      }
    );
  } else {
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
            res.writeHead(200, {
              "Content-Type": "text/html"
            });
            res.write('<script>window.location= "/communityPage"</script>');
            res.end();
          }
        })
      }
    });
  }

})

app.get('/:pro', middleware.checkSession, controllers.community._id);

app.get('/edit/:pro', middleware.checkSession, controllers.community.edit_id);

app.get('/userprofile/:pro', middleware.checkSession, controllers.community.userprofile_id);

app.post('/leaveCommunitybyforce', middleware.checkSession, controllers.community.leaveCommunitybyforce);

app.post('/cancelRequestByUser', middleware.checkSession, controllers.community.cancelRequestByUser);

app.post('/leaveCommunity', middleware.checkSession, controllers.community.leaveCommunity);

app.post('/getUsersOtherThanInCommunity', middleware.checkSession, controllers.community.getUsersOtherThanInCommunity);

app.post('/promoteusers', middleware.checkSession, controllers.community.promoteusers);

app.post('/sendInvite', middleware.checkSession, controllers.community.sendInvite);

app.post('/acceptrequest', middleware.checkSession, controllers.community.acceptrequest);

app.post('/rejectrequest', middleware.checkSession, controllers.community.rejectrequest);

app.post('/acceptinvites', middleware.checkSession, controllers.community.acceptinvites);

app.get('/communitymembers/:pro', middleware.checkSession, controllers.community.communitymembers_id);

app.get('/inviteusers/:pro', middleware.checkSession, controllers.community.inviteusers_id);

app.post('/inviteusersbyname', middleware.checkSession, controllers.communityusers.inviteusersbyname);

app.post('/deleteinvited', middleware.checkSession, controllers.community.deleteinvited);

app.get('/profile/:pro', middleware.checkSession, controllers.community.profile_id);

app.get('/communityDicussion/:pro', middleware.checkSession, controllers.community.communityDicussion_id);

module.exports = app