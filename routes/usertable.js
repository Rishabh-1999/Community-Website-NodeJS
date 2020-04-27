const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const app = express.Router();
const multer = require("multer");
const passport = require("passport");
const GitHubStrategy = require("passport-github").Strategy;
var cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECERT
});

app.use(passport.initialize());
app.use(passport.session());

// parse application/x-www-form-urlencoded
app.use(
  bodyParser.urlencoded({
    extended: true
  })
);

// parse application/json
app.use(bodyParser.json());

// Models
var UsersNames = require("../models/usernames");

// Middleware
var middleware = require("../middlewares/middleware");

// Controllers
var controllers = require("../controllers");

app.post(
  "/activatesuperadmin",
  middleware.checkSession,
  middleware.checkSuperAdmin,
  controllers.user.activatesuperadmin
);

app.post("/checkLogin", passport.authenticate("local", {
  successRedirect: "/home",
  failureRedirect: "/",
  failureFlash: true,
}));

app.post(
  "/addUserToDataBase",
  middleware.checkSession,
  middleware.checkSuperAdmin,
  controllers.user.addUserToDataBase
);

app.post(
  "/updatetodatabase",
  middleware.checkSession,
  controllers.user.updatetodatabase
);

app.post(
  "/activateUser",
  middleware.checkSession,
  middleware.checkSuperAdmin,
  controllers.user.activateUser
);

app.post(
  "/deactivateUser",
  middleware.checkSession,
  middleware.checkSuperAdmin,
  controllers.user.deactivateUser
);

// Change Temp role
app.post(
  "/changetemprole",
  middleware.checkSession,
  middleware.checkSuperAdmin,
  controllers.user.changetemprole
);

//Update Profile of Users
app.post("/updateprofile", middleware.checkSession, function (req, res) {

  var updateObj = new Object();

  updateObj["status"] = "Confirmed"
  updateObj["isActive"] = "true";

  if (req.body.name) {
    updateObj["name"] = req.body.name
  }

  if (req.body.dob) {
    updateObj["DOB"] = req.body.dob
  }

  if (req.body.city) {
    updateObj["city"] = req.body.city
  }

  if (req.body.gender) {
    updateObj["gender"] = req.body.gender
  }

  if (req.body.phoneno) {
    updateObj["phoneno"] = req.body.phoneno
  }

  if (req.body.interests) {
    updateObj["interests"] = req.body.interests
  }

  if (req.body.aboutyou) {
    updateObj["aboutyou"] = req.body.aboutyou
  }

  if (req.body.expectations) {
    updateObj["expectations"] = req.body.expectations;
  }

  if (req.body.name) {
    updateObj["name"] = req.body.name
  }

  console.log(updateObj)

  if (req.files.userfile.size != 0) {

    const file = req.files.userfile;
    var reqpath = "community/" + "user" + "/" + req.session.passport.user._id;

    cloudinary.uploader.upload(
      file.tempFilePath, {
        public_id: reqpath,
        overwrite: true
      },
      function (err, result) {
        if (err) {
          throw err;
        } else {
          updateObj["photoloc"] = result.url;
          UsersNames.updateOne({
            _id: req.session.passport.user._id
          }, {
            $set: updateObj
          }, function (error, result) {
            if (error) {
              throw error;
            }
            req.session.passport.user.isActive = "true";
            req.session.passport.user.photoloc = result.url;

            req.flash('success', 'Profile Updated');
            res.render("home", {
              data: req.session.passport.user,
              editoption: true,
              title: req.session.passport.user.name,
              success: req.flash("success"),
              errors: req.flash("errors")
            });
          });
        }
      }
    );
  } else {
    UsersNames.updateOne({
        _id: req.session.passport.user._id
      }, {
        $set: updateObj
      },
      function (error, result) {
        if (error)
          throw error;
        req.session.passport.user.isActive = "true";

        req.flash('success', 'Profile Updated');
        res.render("home", {
          data: req.session.passport.user,
          editoption: true,
          title: req.session.passport.user.name,
          success: req.flash("success"),
          errors: req.flash("errors")
        });
      }
    );
  }
});

app.post(
  "/changePassword",
  middleware.checkSession,
  controllers.user.changePassword
);

//check duplicate for creating user emailid
app.post(
  "/checkDuplicate",
  middleware.checkSession,
  controllers.user.checkDuplicate
);

app.post(
  "/usersTable",
  middleware.checkSession,
  middleware.checkSuperAdmin,
  controllers.user.usersTable
);

// var storage = multer.diskStorage({
//   destination: "./public/uploads/",
//   filename: function (req, file, callback) {
//     photoname = req.session.passport.user._id + path.extname(file.originalname);
//     req.session.passport.user.photoloc = "/uploads/" + photoname;
//     callback(null, photoname);
//   }
// });
// var upload = multer({
//   storage: storage
// }).single("file");

// app.post("/uploadphoto", middleware.checkSession, controllers.cloudinary.uploadphoto);
// upload(req, res, err => {
//   if (err) {
//     throw err;
//   } else {
//     UsersNames.updateOne({
//         _id: req.session.passport.user._id
//       }, {
//         $set: {
//           photoloc: "/uploads/" + photoname
//         }
//       },
//       function (error, result) {
//         console.log("photo updated to database" + result);
//         req.session.passport.user.photoloc = "uploads/" + photoname;
//         res.redirect("/homewithedit");
//       }
//     );
//   }
// });
// });

app.get("/editprofile", middleware.checkSession, controllers.user.editprofile);

module.exports = app;