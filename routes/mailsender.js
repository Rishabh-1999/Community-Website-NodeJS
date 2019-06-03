const express = require('express');
const path = require('path');
var bodyParser = require('body-parser')
const app = express.Router();
var nodemailer = require('nodemailer');

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

let transporter = nodemailer.createTransport({
  service:'gmail',
    auth: {
        user: 'rishabhanand33@gmail.com',
        pass: 'THMA15/11/99'
    },
    tls: {
          rejectUnauthorized: false
      }
});

app.post('/sendMail',function(req,res){
  console.log(req.body);
  transporter.sendMail(req.body, (error, info) => {
    if (error) {
        return "false"
    }
    console.log('success');
});
  return "true";
})