/* models required */
var discussion = require("../models/discussion");
var comment = require("../models/comment");
var reply = require("../models/reply");

module.exports.addnewDiscussion = async function (req, res, next) {
    discussion.create(req.body, function (error, result) {
        if (error) res.send("false");
        else {
            console.log("New Dicussion Added /addnewDiscussion");
            res.send("true");
        }
    });
}

module.exports.getDiscussion = async function (req, res, next) {
    discussion
        .find({
            communityId: req.body.communityId
        })
        .exec(function (err, result) {
            if (err) return err;
            else {
                console.log("get Dicussion /getDiscussion");
                res.send(result);
            }
        });
}

module.exports.getReply = async function (req, res, next) {
    reply.find({
            commentId: req.body.commentId
        },
        function (err, data) {
            if (err) throw err;
            else {
                console.log("Get Reply /getReply");
                res.send(data);
            }
        }
    );
}

module.exports.discussionOwner_id = async function (req, res, next) {
    var id = req.params.pros.toString();
    users.findOne({
            _id: id
        },
        function (err, data) {
            if (err) throw err;
            else
                res.render("discussionOwnerInfo", {
                    data: req.session.data,
                    newdata: data
                });
        }
    );
}

module.exports.getComments = async function (req, res, next) {
    comment.find({
            discussionId: req.body.discussionId
        },
        function (err, data) {
            if (err) throw err;
            else {
                console.log("get comments /getComments");
                res.send(data);
            }
        }
    );
}

module.exports.deleteDiscussion_id = async function (req, res, next) {
    var id = req.params.pros.toString();
    discussion.deleteOne({
            _id: id
        },
        function (err, data) {
            if (err) res.send("false");
            else {
                console.log("delete dicussion /deleteDiscussion");
                res.send("true");
            }
        }
    );
}