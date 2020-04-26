// Models
var UsersNames = require("../models/usernames");
var communitys = require('../models/communitys');

module.exports.inviteusersbyname = async function (req, res, next) {
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
                    data: req.session.passport.user,
                    data2: result
                });
            }
        })
    })
}