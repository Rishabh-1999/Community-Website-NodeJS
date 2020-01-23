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

passport.serializeUser(function (user, done) {
  done(null, user);
});

passport.deserializeUser(function (user, done) {
  done(null, user);
});

passport.use(
  new GitHubStrategy({
      clientID: process.env.GITHUB_CLIENTID,
      clientSecret: process.env.GITHUB_CLIENTSECERT,
      callbackURL: process.env.GITHUB_CALLBACKURL
    },
    function (accessToken, refreshToken, profile, cb) {
      return cb(null, profile);
    }
  )
);

app.get("/auth/github", passport.authenticate("github"));

app.get(
  "/auth/github/callback",
  passport.authenticate("github", {
    failureRedirect: "index.html"
  }),
  function (req, res) {
    UsersNames.findOne({
        githubid: req.session.passport.user._json.id
      },
      function (err, result) {
        console.log("githubsignin succesfull");
        if (result != null) {
          req.session.isLogin = 1;
          req.session._id = result._id;
          req.session.name = result.name;
          req.session.password = req.body.password;
          var ob = new Object();
          ob.name = result.name;
          ob._id = result._id;
          ob.email = result.email;
          ob.photoloc = result.photoloc;
          ob.gender = result.gender;
          ob.city = result.city;
          ob.DOB = result.DOB;
          ob.phoneno = result.phoneno;
          ob.role = result.role;
          ob.status = result.status;
          ob.restrict = result.restrict;
          ob.isActive = result.isActive;
          ob.githubid = result.githubid;
          ob.temprole = result.role;
          req.session.name = result.name;
          req.session.data = ob;
          res.redirect("/home");
        } else {
          var obj = {
            name: req.session.passport.user._json.name,
            email: req.session.passport.user._json.email,
            city: req.session.passport.user._json.location,
            status: "Pending",
            role: "User",
            githubid: req.session.passport.user._json.id,
            photoloc: "/images/logo.png",
            isActive: "true",
            email: req.body.email,
            gender: "",
            DOB: "",
            phoneno: req.body.phoneno,
            restrict: "false",
            interests: "",
            boutyou: "",
            expectations: "",
            email: req.body.email
          };
          UsersNames.create(obj, function (error, result) {
            if (error) throw error;
            else {
              req.session.data = obj;
              UsersNames.find({
                  githubid: req.session.passport.user._json.id
                })
                .then(data => {
                  req.session.data._id = data[0]._id;
                })
                .catch(err => {
                  throw err;
                });
              res.render("home", {
                data: req.session.data
              });
            }
          });
        }
      }
    ).catch(err => {
      res.send(err);
    });
  }
);

app.post(
  "/activatesuperadmin",
  middleware.checkSession,
  middleware.checkSuperAdmin,
  controllers.user.activatesuperadmin
);

app.post("/checkLogin", controllers.user.checkLogin);

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
  console.log(req.body)
  console.log(req.files.userfile)
  if (req.files.userfile.size != 0) {
    console.log("file exists")
    const file = req.files.userfile;
    var reqpath = "community/" + "user" + "/" + req.session._id;
    cloudinary.uploader.upload(
      file.tempFilePath, {
        public_id: reqpath,
        overwrite: true
      },
      function (err, result) {
        if (err) console.log(err);
        else {
          UsersNames.updateOne({
              _id: req.session._id
            }, {
              $set: {
                status: "Confirmed",
                isActive: "true",
                photoloc: result.url,
                name: req.body.fullname,
                DOB: req.body.dob,
                city: req.body.city,
                gender: req.body.gender,
                phoneno: req.body.phoneno,
                interests: req.body.interests,
                aboutyou: req.body.aboutyou,
                expectations: req.body.expectations
              }
            },
            function (error, result) {
              if (error) throw error;
              else req.session.data.isActive = "true";
              req.session.data.photoloc = result.url;
              console.log("Updated from /updateprofile");
              res.writeHead(200, {
                "Content-Type": "text/html"
              });
              res.write('<script>window.location= "/home"</script>');
              res.end();
            }
          );
        }
      }
    );
  } else {
    UsersNames.updateOne({
        _id: req.session._id
      }, {
        $set: {
          status: "Confirmed",
          isActive: "true",
          name: req.body.fullname,
          DOB: req.body.dob,
          city: req.body.city,
          gender: req.body.gender,
          phoneno: req.body.phoneno,
          interests: req.body.interests,
          aboutyou: req.body.aboutyou,
          expectations: req.body.expectations
        }
      },
      function (error, result) {
        if (error) throw error;
        else req.session.data.isActive = "true";
        console.log("Updated from /updateprofile");
        res.writeHead(200, {
          "Content-Type": "text/html"
        });
        res.write('<script>window.location= "/home"</script>');
        res.end();
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
//     photoname = req.session._id + path.extname(file.originalname);
//     req.session.data.photoloc = "/uploads/" + photoname;
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
//         _id: req.session._id
//       }, {
//         $set: {
//           photoloc: "/uploads/" + photoname
//         }
//       },
//       function (error, result) {
//         console.log("photo updated to database" + result);
//         req.session.data.photoloc = "uploads/" + photoname;
//         res.redirect("/homewithedit");
//       }
//     );
//   }
// });
// });

app.get("/editprofile", middleware.checkSession, controllers.user.editprofile);

module.exports = app;