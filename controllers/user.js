var bcrypt = require("bcrypt");
const saltRounds = 10;

// Models
var UsersNames = require("../models/usernames");

module.exports.checkLogin = async function (req, res, next) {
    console.log("login data recieved");
    UsersNames.findOne({
            email: req.body.email,
            restrict: "false"
        },
        function (err, result) {
            console.log(result);
            if (result == null) res.send("wrong details");
            else {
                bcrypt.compare(req.body.password, result.password, function (
                    err,
                    password
                ) {
                    if (password) {
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
                        if (result.status == "Pending") res.send("not");
                        else res.send("Logined");
                    } else res.send("wrong details");
                });
            }
        }
    ).catch(err => {
        console.error(err);
        res.send(error);
    });
}

module.exports.updatetodatabase = async function (req, res, next) {
    UsersNames.updateOne({
            email: req.body.email
        }, {
            $set: {
                isActive: "true",
                email: req.body.email,
                phoneno: req.body.phoneno,
                city: req.body.city,
                status: req.body.status,
                role: req.body.role
            }
        },
        function (error, result) {
            if (error) throw error;
            else {
                if (req.session.emailid != req.body.email)
                    req.session.emailid = req.body.email;
            }
            res.send("1");
        }
    );
};

module.exports.activateUser = async function (req, res, next) {
    UsersNames.updateOne({
            _id: req.body._id
        }, {
            $set: {
                restrict: "true"
            }
        },
        function (error, result) {
            if (error) throw error;
            else {
                if (req.session.emailid == req.body.old)
                    req.session.emailid = req.body.emailid;
                console.log("Activated Requested User /activateUser");
                res.send("true");
            }
        }
    );
};

module.exports.deactivateUser = async function (req, res, next) {
    UsersNames.updateOne({
            _id: req.body._id
        }, {
            $set: {
                restrict: "false"
            }
        },
        function (error, result) {
            if (error) throw error;
            else {
                if (req.session.emailid == req.body.old)
                    req.session.emailid = req.body.emailid;
                console.log("Deactivated Requested User /deactivateUser");
                res.send("true");
            }
        }
    );
};

module.exports.changetemprole = async function (req, res, next) {
    if (req.session.data.temprole == "SuperAdmin") {
        req.session.data.temprole = "User";
        res.send("changed");
    } else {
        req.session.data.temprole = "SuperAdmin";
        res.send("changed");
    }
};

module.exports.updateprofile = async function (req, res, next) {
    UsersNames.updateOne({
            _id: req.session._id
        }, {
            $set: {
                status: "Confirmed",
                isActive: "true",
                name: req.body.name,
                DOB: req.body.DOB,
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
            res.send("true");
        }
    );
};

module.exports.changePassword = async function (req, res, next) {
    UsersNames.findOne({
            _id: req.session._id
        },
        function (error, result) {
            if (error) throw error;
            else {
                if (result == null) res.send("false");
                else {
                    bcrypt.compare(req.body.oldpass, result.password, function (
                        err,
                        boolans
                    ) {
                        if (boolans == true) {
                            bcrypt.hash(req.body.newpass, saltRounds, function (err, newpass) {
                                UsersNames.updateOne({
                                        _id: req.session._id
                                    }, {
                                        $set: {
                                            password: newpass
                                        }
                                    },
                                    function (error, result) {
                                        if (error) throw error;
                                        else {
                                            if (result == null) res.send("false");
                                            else {
                                                res.send("true");
                                            }
                                        }
                                    }
                                );
                            });
                        }
                        res.send("false");
                    });
                }
            }
        }
    );
};

module.exports.checkDuplicate = async function (req, res, next) {
    var data = UsersNames.find({}).exec(function (error, result) {
        if (error) throw error;
        else {
            var da = [];
            var rew = "false";
            da = result;
            for (i in result) {
                if (req.body.email == da[i].email) {
                    rew = "true";
                }
            }
            res.send(rew);
        }
    });
};

module.exports.usersTable = async function (req, res, next) {
    let query = {};
    let params = {};
    if (req.body.role === "All" && req.body.status !== "All")
        query = {
            status: req.body.status
        };
    else if (req.body.role !== "All" && req.body.status === "All")
        query = {
            role: req.body.role
        };
    else if (req.body.role !== "All" && req.body.status !== "All")
        query = {
            role: req.body.role,
            status: req.body.status
        };

    if (req.body.customsearch) {
        query["$or"] = [{
                name: {
                    $regex: req.body.search.value,
                    $options: "i"
                }
            },
            {
                communityloc: {
                    $regex: req.body.search.value,
                    $options: "i"
                }
            },
            {
                createdate: {
                    $regex: req.body.search.value,
                    $options: "i"
                }
            },
            {
                description: {
                    $regex: req.body.search.value,
                    $options: "i"
                }
            },
            {
                owner: {
                    $regex: req.body.search.value,
                    $options: "i"
                }
            },
            {
                status: {
                    $regex: req.body.search.value,
                    $options: "i"
                }
            }
        ];
    }

    let sortingType;
    if (req.body.order[0].dir === "asc") sortingType = 1;
    else sortingType = -1;

    if (req.body.order[0].column === "0")
        params = {
            skip: parseInt(req.body.start),
            limit: parseInt(req.body.length),
            sort: {
                email: sortingType
            }
        };
    else if (req.body.order[0].column === "2")
        params = {
            skip: parseInt(req.body.start),
            limit: parseInt(req.body.length),
            sort: {
                city: sortingType
            }
        };
    else if (req.body.order[0].column === "3")
        params = {
            skip: parseInt(req.body.start),
            limit: parseInt(req.body.length),
            sort: {
                status: sortingType
            }
        };
    else if (req.body.order[0].column === "4")
        params = {
            skip: parseInt(req.body.start),
            limit: parseInt(req.body.length),
            sort: {
                role: sortingType
            }
        };

    UsersNames.find(query, {}, params, function (err, data) {
        if (err) console.log(err);
        else {
            UsersNames.countDocuments(query, function (err, filteredCount) {
                if (err) console.log(err);
                else {
                    UsersNames.countDocuments(function (err, totalCount) {
                        if (err) console.log(err);
                        else
                            res.send({
                                recordsTotal: totalCount,
                                recordsFiltered: filteredCount,
                                data
                            });
                    });
                }
            });
        }
    });
};

module.exports.editprofile = async function (req, res, next) {
    UsersNames.findOne({
            _id: req.session._id
        },
        function (err, result) {
            var userdata = new Object();
            userdata.interests = result.interests;
            userdata.aboutyou = result.aboutyou;
            userdata.expectations = result.expectations;
            res.render("editprofile", {
                data: req.session.data,
                userdata: userdata
            });
        }
    );
};

module.exports.addUserToDataBase = async function (req, res, next) {
    bcrypt.hash(req.body.password, saltRounds, function (err, hash) {
        let newProduct = new UsersNames({
            email: req.body.email,
            password: hash,
            gender: "",
            DOB: "",
            phoneno: req.body.phoneno,
            city: req.body.city,
            name: req.body.name,
            role: req.body.role,
            restrict: "false",
            status: "Pending",
            isActive: "true",
            interests: "",
            aboutyou: "",
            expectations: "",
            photoloc: "/images/logo.png"
        });
        newProduct
            .save()
            .then(data => {
                console.log("New User created");
                res.send(data);
            })
            .catch(err => {
                res.send(err);
            });
    });
}

module.exports.activatesuperadmin = async function (req, res, next) {
    console.log("Activated issuperadmin /activatesuperadmin");
    req.session.data.issuperadmin = "true";
}