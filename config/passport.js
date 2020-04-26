const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcrypt");

const Users = require("../models/usernames");

module.exports = function (passport) {
  passport.serializeUser(function (user, done) {
    done(null, user);
  });

  passport.deserializeUser(function (user, done) {
    done(null, user);
  });

  passport.use(
    new LocalStrategy(
      {
        usernameField: "email",
        passReqToCallback: true,
      },
      (req, email, password, done) => {
        Users.findOne(
          {
            email: email,
          },
          function (err, result) {
            if (result != null) {
              bcrypt.compare(password, result.password, function (
                err,
                isMatch
              ) {
                if (isMatch) {
                  // var user = new Object();
                  // user._id = result._id;
                  // user.name = result.name;
                  // user.email = result.email;
                  // user.gender = result.gender;
                  // user.city = result.city;
                  // user.DOB = result.DOB;
                  // user.totalincart = result.totalincart;
                  // user.phoneno = result.phoneno;
                  // user.type = result.type;

                  var user = new Object();
                  user.name = result.name;
                  user._id = result._id;
                  user.email = result.email;
                  user.photoloc = result.photoloc;
                  user.gender = result.gender;
                  user.city = result.city;
                  user.DOB = result.DOB;
                  user.phoneno = result.phoneno;
                  user.role = result.role;
                  user.status = result.status;
                  user.restrict = result.restrict;
                  user.isActive = result.isActive;
                  user.temprole = result.role;

                  console.log("-------------------Logined--------------------");
                  return done(null, user);
                } else {
                  return done(
                    null,
                    false,
                    req.flash("errors", "Username/Password Incorrect.")
                  );
                }
              });
            } else {
              return done(
                null,
                false,
                req.flash("errors", "Username Not registered.")
              );
            }
          }
        )
          .select("+password")
          .catch((err) => {
            res.send(error);
          });
      }
    )
  );
};
