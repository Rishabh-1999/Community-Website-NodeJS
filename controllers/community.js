// Models
var communitys = require('../models/communitys');

module.exports.getUsersInvited = async function (req, res, next) {
    communitys.find({
        "invited": {
            "$in": req.session._id
        }
    }).exec(function (err, result) {
        if (err)
            return err;
        else {
            res.send(result)
        }
    })
}

module.exports.getCommunityLists = async function (req, res, next) {
    let query = {};
    let params = {};

    if (req.body.status === 'Direct')
        query = {
            rule: req.body.status
        };
    else if (req.body.status === 'Permission')
        query = {
            rule: req.body.status
        };

    if (req.body.search.value) {
        query["$or"] = [{
                "email": {
                    "$regex": req.body.search.value,
                    "$options": "i"
                }
            },
            {
                "name": {
                    "$regex": req.body.search.value,
                    "$options": "i"
                }
            },
            {
                "DOB": {
                    "$regex": req.body.search.value,
                    "$options": "i"
                }
            },
            {
                "phoneno": {
                    "$regex": req.body.search.value,
                    "$options": "i"
                }
            },
            {
                "gender": {
                    "$regex": req.body.search.value,
                    "$options": "i"
                }
            },
            {
                "city": {
                    "$regex": req.body.search.value,
                    "$options": "i"
                }
            }
        ]
    }

    let sortingType;
    if (req.body.order[0].dir === 'asc')
        sortingType = 1;
    else
        sortingType = -1;

    if (req.body.order[0].column === '0')
        params = {
            skip: parseInt(req.body.start),
            limit: parseInt(req.body.length),
            sort: {
                name: sortingType
            }
        };
    else if (req.body.order[0].column === '2')
        params = {
            skip: parseInt(req.body.start),
            limit: parseInt(req.body.length),
            sort: {
                communityloc: sortingType
            }
        };
    else if (req.body.order[0].column === '3')
        params = {
            skip: parseInt(req.body.start),
            limit: parseInt(req.body.length),
            sort: {
                owner: sortingType
            }
        };
    else if (req.body.order[0].column === '4')
        params = {
            skip: parseInt(req.body.start),
            limit: parseInt(req.body.length),
            sort: {
                createDate: sortingType
            }
        };

    communitys.find(query, {}, params, function (err, data) {
        if (err)
            console.log(err);
        else {
            communitys.countDocuments(query, function (err, filteredCount) {
                if (err)
                    console.log(err);
                else {
                    communitys.countDocuments(function (err, totalCount) {
                        if (err)
                            console.log(err);
                        else
                            res.send({
                                "recordsTotal": totalCount,
                                "recordsFiltered": filteredCount,
                                data
                            });
                    })
                }
            });
        }
    });
}

module.exports.joinandrequestcommunity = async function (req, res, next) {
    if (req.body.r == 0) {
        communitys.updateOne({
            "_id": req.body._id
        }, {
            $push: {
                "users": req.session._id
            }
        }, function (error, result) {
            if (error)
                throw error;
            else {
                console.log(req.session._id + " joined community " + req.body._id)
                res.send("true");
            }
        })
    } else {
        communitys.updateOne({
            "_id": req.body._id
        }, {
            $push: {
                "request": req.session._id
            }
        }, function (error, result) {
            if (error)
                throw error;
            else {
                console.log(req.session._id + " requested community " + req.body._id)
            }
            res.send("true");
        })
    }
}

module.exports.communityupdate = async function (req, res, next) {
    communitys.updateOne({
        "_id": req.body.id
    }, {
        $set: {
            "name": req.body.name,
            "status": req.body.status
        }
    }, function (error, result) {
        if (error)
            throw error;
        else {
            console.log("Community " + req.body.id + " updated")
            res.send("true");
        }
    })
}

module.exports.getArrayOwnCommunity = async function (req, res, next) {
    communitys.find({
        'ownerid': req.session._id
    }, function (err, result) {
        res.send(result);
    });
}

module.exports.getArrayOtherCommunity = async function (req, res, next) {
    communitys.find({
        $and: [{
            "users": {
                "$in": [req.session._id]
            }
        }, {
            "ownerid": {
                "$not": {
                    "$eq": req.session._id
                }
            }
        }]
    }, function (err, result) {
        res.send(result);
    });
}

module.exports.getArrayOtherCommunityInvited = async function (req, res, next) {
    communitys.find({
        $and: [{
            "invited": {
                "$in": [req.session._id]
            }
        }, {
            "users": {
                "$nin": [req.session._id]
            }
        }, {
            "managers": {
                "$nin": [req.session._id]
            }
        }, {
            "ownerid": {
                "$not": {
                    "$eq": req.session._id
                }
            }
        }]
    }, function (err, result) {
        res.send(result);
    });
}

module.exports.getAllActive = async function (req, res, next) {
    communitys.find({
        'ownerid': {
            "$ne": req.session._id
        },
        "users": {
            "$nin": [req.session._id]
        },
        "request": {
            "$nin": [req.session._id]
        }
    }).skip(req.body.start).limit(req.body.end).exec(function (error, result) {
        res.send(result);
    })
}

module.exports.communityDicussion_id = async function (req, res, next) {
    var id = req.params.pro.toString();
    communitys.findOne({
        "_id": id
    }, function (err, result) {
        if (err)
            throw err;
        else {
            res.render('discussion', {
                data: req.session.passport.user,
                data2: result
            });
        }
    })
}

module.exports.profile_id = async function (req, res, next) {
    var id = req.params.pro.toString();
    communitys.findOne({
        "_id": id
    }, function (err, result) {
        if (err)
            throw err;
        else {
            res.render('communityprofile', {
                data: req.session.passport.user,
                data2: result
            });
        }
    })
}

module.exports.deleteinvited = async function (req, res, next) {
    communitys.updateOne({
        "_id": req.body.commid
    }, {
        $pull: {
            "invited": req.body.id
        }
    }, function (err, result) {
        if (err)
            throw err;
        else {
            res.send("true");
        }
    })
}

module.exports.getManagers = async function (req, res, next) {
    communitys.findOne({
        "_id": req.body._id
    }).populate('managers').
    exec(function (err, result) {
        if (err)
            return err;
        else {
            res.send(JSON.stringify(result.managers))
        }
    })
}

module.exports.getinveted = async function (req, res, next) {
    communitys.findOne({
        "_id": req.body._id
    }).populate('invited').
    exec(function (err, result) {
        if (err)
            return err;
        else {
            res.send(JSON.stringify(result.invited))
        }
    })
}

module.exports.getrequest = async function (req, res, next) {
    communitys.findOne({
        "_id": req.body._id
    }).populate('request').
    exec(function (err, result) {
        if (err)
            return err;
        else {
            res.send(JSON.stringify(result.request))
        }
    })
}

module.exports.getUsers = async function (req, res, next) {
    communitys.findOne({
        "_id": req.body._id
    }).populate('users').exec(function (err, result) {
        if (err)
            return err;
        else {
            res.send(JSON.stringify(result.users))
        }
    })
}

module.exports.acceptinvites = async function (req, res, next) {
    communitys.updateOne({
        "_id": req.body._id
    }, {
        $pull: {
            "invited": req.session._id
        },
        $push: {
            "users": req.session._id
        }
    }, function (error, result) {
        if (error)
            throw error;
        else
            res.send("true");
    })
}

module.exports.rejectrequest = async function (req, res, next) {
    communitys.updateOne({
        "_id": req.body.commid
    }, {
        $pull: {
            "request": req.body._id
        }
    }, function (error, result) {
        if (error)
            throw error;
        else {
            res.send("true");
        }
    })
}

module.exports.acceptrequest = async function (req, res, next) {
    communitys.updateOne({
        "_id": req.body.commid
    }, {
        $pull: {
            "request": req.body._id
        },
        $push: {
            "users": req.body._id
        }
    }, function (error, result) {
        if (error)
            throw error;
        else {
            res.send("true");
        }
    })
}

module.exports.sendInvite = async function (req, res, next) {
    communitys.updateOne({
        "_id": req.body.commid
    }, {
        $push: {
            "invited": req.body.invitedid
        }
    }, function (error, result) {
        if (error)
            res.send("false");
        else {
            res.send("true");
        }
    })
}


module.exports.promoteusers = async function (req, res, next) {
    communitys.updateOne({
        "_id": req.body.commid
    }, {
        $pull: {
            "users": req.body._id
        },
        $push: {
            "managers": req.body._id
        }
    }, function (error, result) {
        if (error)
            throw error;
        else {
            res.send("true");
        }
    })
}

module.exports.getUsersOtherThanInCommunity = async function (req, res, next) {
    communitys.findOne({
        "_id": req.body.commid
    }, function (error, communitydata) {
        if (error)
            throw error;
        else {
            communitydata.managers.push(mongoose.mongo.ObjectId(communitydata.ownerid))
            UsersNames.find({
                "$and": [{
                    "$and": [{
                        "$and": [{
                            "$and": [{
                                "_id": {
                                    "$nin": communitydata.managers
                                },
                                "_id": {
                                    "$nin": communitydata.users
                                }
                            }],
                            "_id": {
                                "$nin": communitydata.invited
                            }
                        }],
                        "_id": {
                            "$nin": communitydata.request
                        }
                    }],
                    "_id": {
                        "$nin": communitydata.ownerid
                    }
                }]
            }, function (error, result) {
                if (error)
                    console.log(error)
                res.send(result)
            });
        }
    });
}

module.exports.leaveCommunity = async function (req, res, next) {
    communitys.updateOne({
        "_id": req.body.commid
    }, {
        $pull: {
            "users": req.session._id
        }
    }, function (error, result) {
        if (error)
            throw error;
        else {
            res.send("true");
        }
    })
}

module.exports.cancelRequestByUser = async function (req, res, next) {
    communitys.updateOne({
        "_id": req.body.commid
    }, {
        $pull: {
            "request": req.body._id
        }
    }, function (error, result) {
        if (error)
            throw error;
        else {
            res.send("true");
        }
    })
}

module.exports.leaveCommunitybyforce = async function (req, res, next) {
    communitys.updateOne({
        "_id": req.body.commid
    }, {
        $pull: {
            "users": req.body._id
        }
    }, function (error, result) {
        if (error)
            throw error;
        else {
            res.send("true");
        }
    })
}

module.exports._id = async function (req, res, next) {
    var id = req.params.pro.toString();
    communitys.findOne({
        "_id": id
    }, function (err, result) {
        if (err)
            throw err;
        else {
            res.render('manageCommunity', {
                data: req.session.passport.user,
                data2: result
            });
        }
    })
}

module.exports.edit_id = async function (req, res, next) {
    var id = req.params.pro.toString();
    communitys.findOne({
        "_id": id
    }, function (err, result) {
        if (err)
            throw err;
        else {
            res.render('editcommunity', {
                data: req.session.passport.user,
                data2: result
            });
        }
    })
}

module.exports.userprofile_id = async function (req, res, next) {
    var id = req.params.pro.toString();
    UsersNames.findOne({
        "_id": id
    }, function (err, result) {
        if (err)
            throw err;
        else {
            res.render('userprofile', {
                data: req.session.passport.user,
                data2: result
            });
        }
    })
}

module.exports.communitymembers_id = async function (req, res, next) {
    var id = req.params.pro.toString();
    communitys.findOne({
        "_id": id
    }, function (err, result) {
        if (err)
            throw err;
        else {
            res.render('communitymembers', {
                data: req.session.passport.user,
                data2: result
            });
        }
    })
}

module.exports.inviteusers_id = async function (req, res, next) {
    var id = req.params.pro.toString();
    communitys.findOne({
        "_id": id
    }, function (err, result) {
        if (err)
            throw err;
        else {
            res.render('inviteusers', {
                data: req.session.passport.user,
                data2: result
            });
        }
    })
}