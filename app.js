var express = require("express");
var path = require("path");
var bodyParser = require("body-parser");
var session = require("express-session");
var nodemailer = require("nodemailer");
var fileupload = require("express-fileupload");
var mongoStore = require("connect-mongo")(session);
var favicon = require("serve-favicon");
var engine = require("ejs-mate");
var morgan = require("morgan");
var mongoose = require("mongoose");
var flash = require("express-flash");
const passport = require("passport");

if (process.env.NODE_ENV != "production") {
  require("dotenv").config();
}

var app = express();

var http = require("http");
var server = http.Server(app);
var PORT = process.env.PORT || 3000;

/* DB */
require("./config/db");

app.use(morgan("dev"));

/* Socket */
var io = require("socket.io")(http);

/* Session */
app.use(
  session({
    secret: "abcUCAChitkara",
    resave: true,
    saveUninitialized: true,
    store: new mongoStore({
      mongooseConnection: mongoose.connection,
    }),
  })
);

/* Acces static files */
app.use(favicon(path.join(__dirname, "public//images/", "favicon.ico")));
app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

app.engine("ejs", engine);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(flash());

/* Passport Config */
require("./config/passport")(passport);



app.use(
  fileupload({
    useTempFiles: true,
  })
);

/* Bodyparser */
app.use(
  express.urlencoded({
    extended: true,
  })
);
app.use(express.json());

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

/* Middleware */
var middleware = require("./middlewares/middleware");

/* Models Required */
var comment = require("./models/comment");
var reply = require("./models/reply");

/* Routing Implementation */
app.use("/tagTable", require("./routes/tagtable"));
app.use("/userTable", require("./routes/usertable"));
app.use("/communityTable", require("./routes/community"));
app.use("/discussion", require("./routes/discussion"));

/* Views */
/* Login Page */
app.get("/", (req, res) => {
  var err_msg = req.flash("errors")[0]
  if (req.isAuthenticated()) {
    req.logout();
  }
  res.render("login", {
    errors: err_msg == undefined ? [] : err_msg,
    success: req.flash("success")
  });
});

/* Profile Page */
app.get("/home", (req, res) => {
  //console.log(req.session.passport.user)
  if (req.session.passport.user.status == "Pending")
    res.render("editprofile", {
      data: req.session.passport.user,
      title: req.session.passport.user.name,

    });
  else
    res.render("home", {
      data: req.session.passport.user,
      editoption: false,
      title: req.session.passport.user.name,
      success: req.flash("success"),
      errors: req.flash("errors")
    });
});

/* Profile Page with Edit option */
app.get("/home/edit", middleware.checkSession, (req, res) => {
  res.render("home", {
    data: req.session.passport.user,
    editoption: true,
    title: req.session.passport.user.name,
    success: req.flash("success"),
    errors: req.flash("errors")
  });
});

/* Add User Page */
app.get(
  "/addUser",
  middleware.checkSession,
  middleware.checkSuperAdmin,
  (req, res) => {
    res.render("addUser", {
      data: req.session.passport.user,
      title: req.session.passport.user.name,
    });
  }
);

/* User Table Page */
app.get(
  "/usertable",
  middleware.checkSession,
  middleware.checkSuperAdmin,
  (req, res) => {
    res.render("usertable", {
      data: req.session.passport.user,
      title: req.session.passport.user.name,
    });
  }
);

/* Tag Creation Page */
app.get("/tagpage", middleware.checkSession, (req, res) => {
  res.render("tagpage", {
    data: req.session.passport.user,
    title: req.session.passport.user.name,
  });
});

/* Tag Table Page */
app.get("/taglists", middleware.checkSession, (req, res) => {
  res.render("taglists", {
    data: req.session.passport.user,
    title: req.session.passport.user.name,
  });
});

/* Add Community Page */
app.get("/invitedbycommunity", middleware.checkSession, (req, res) => {
  res.render("invitedbycommunity", {
    data: req.session.passport.user,
    title: req.session.passport.user.name,
  });
});

/* Add Community Page */
app.get(
  "/addCommunity",
  middleware.checkSession,
  middleware.checkSuperAdminOrCommunityManagers,
  (req, res) => {
    res.render("addCommunity", {
      data: req.session.passport.user,
      title: req.session.passport.user.name,
    });
  }
);

/* Community Table Page */
app.get(
  "/communitytable",
  middleware.checkSession,
  middleware.checkSuperAdmin,
  (req, res) => {
    res.render("communitytable", {
      data: req.session.passport.user,
      title: req.session.passport.user.name,
    });
  }
);

/* Edit Community Page */
app.get("/editcommunity", middleware.checkSession, (req, res) => {
  res.render("editcommunity", {
    data: req.session.passport.user,
    title: req.session.passport.user.name,
  });
});

/* All Community Page */
app.get("/communityalllists", middleware.checkSession, (req, res) => {
  res.render("communityalllists", {
    data: req.session.passport.user,
    title: req.session.passport.user.name,
  });
});

/* Community Page */
app.get("/communityPage", middleware.checkSession, (req, res) => {
  res.render("communitylists", {
    data: req.session.passport.user,
    title: req.session.passport.user.name,
  });
});

/* Change Password Page */
app.get("/changePassPage", middleware.checkSession, (req, res) => {
  res.render("changepassword", {
    data: req.session.passport.user,
    title: req.session.passport.user.name,
    success: req.flash("success"),
    errors: req.flash("errors")
  });
});

/* Logout Function */
app.post("/logout", middleware.checkSession, function (req, res) {
  req.session.destroy();
  res.redirect("/");
});

/* Socket for comment */
io.on("connection", function (socket) {
  socket.on("comment", function (data) {
    var commentData = new comment(data);
    commentData.save();
    socket.broadcast.emit("comment", data);
  });
});

/* Socket for replies */
io.on("connection", function (socket) {
  socket.on("reply", function (data) {
    var replyData = new reply(data);
    replyData.save();
    socket.broadcast.emit("reply", data);
  });
});

server.listen(PORT, () => {
  console.log("Sever on port: " + PORT);
});