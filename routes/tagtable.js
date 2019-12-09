const express = require('express');
const bodyParser = require('body-parser')
const app = express.Router();

/* parse application/x-www-form-urlencoded */
app.use(bodyParser.urlencoded({
  extended: true
}))

/* parse application/json */
app.use(bodyParser.json())

/* Middleware */
var middleware = require('../middlewares/middleware');

// Controllers
var controllers = require('../controllers');

/*  GET for Tag Table */
app.post('/getTagTable', middleware.checkSession, middleware.checkSuperAdmin, controllers.tag.getTagTable);

/* POST add Tag to DB */
app.post('/addTag', middleware.checkSession, middleware.checkSuperAdmin, controllers.tag.addTag);

/* POST delete tag fom db */
app.post('/deletetag', middleware.checkSession, middleware.checkSuperAdmin, controllers.tag.deletetag);

/* POST check duplicate of tag from DB */
app.post('/checkDuplicate', middleware.checkSession, middleware.checkSuperAdmin, controllers.tag.checkDuplicate);

/* POST edit Tag */
app.post('/edittag', middleware.checkSession, middleware.checkSuperAdmin, controllers.tag.edittag);

module.exports = app;