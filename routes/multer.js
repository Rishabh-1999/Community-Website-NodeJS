const express = require('express');
const path = require('path');
const app = express.Router();
const multer = require('multer');



var storage = multer.diskStorage({
  destination: './public/uploads/',
  filename: function(req, file, cb){
      cb(null, req.session._id+ path.extname(file.originalname))
      UsersNames.updateOne({"_id":req.session._id},{$set:{"photoloc":'uploads/'+req.session._id+ path.extname(file.originalname)}},function(error,result){

  })
    }

});

const upload = multer({
  storage: storage,
}).single('file');

app.post('/uploadphoto',(req,res)=>{
  upload(req,res,err=>{
    if(err) throw err;
     res.render('home',{data: req.session.data});
  })

})

mongoose.connect(mongoDB);

module.exports = app;