const express = require("express");
const bodyParser = require("body-parser");
const app = express.Router();

/* parse application/x-www-form-urlencoded */
app.use(
  bodyParser.urlencoded({
    extended: true
  })
);

/* parse application/json */
app.use(bodyParser.json());

/* Middleware */
var middleware = require("../middlewares/middleware");

/* models required */
var discussion = require("../models/discussion");
var comment = require("../models/comment");
var reply = require("../models/reply");

// Controllers
var controllers = require("../controllers");

/* create new discussion */
app.post("/addnewDiscussion", controllers.discussion.addnewDiscussion);

/* fetch all community discussions */
app.post("/getDiscussion", middleware.checkSession, controllers.discussion.getDiscussion);

/* Get all reply for a comment */
app.post("/getReply", middleware.checkSession, controllers.discussion.getReply);

/* discussion owner */
app.get("/discussionOwner/:pros", middleware.checkSession, controllers.discussion.discussionOwner_id);

/* Get comment for a dicussion */
app.post("/getComments", middleware.checkSession, controllers.discussion.getComments);

/* delete discussions */
app.delete("/deleteDiscussion/:pros", middleware.checkSession, controllers.discussion.deleteDiscussion_id);

module.exports = app;