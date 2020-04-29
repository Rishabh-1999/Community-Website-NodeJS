var bcrypt = require("bcrypt");
const saltRounds = 10;
var cloundinary = require("cloudinary").v2;

cloundinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECERT
});

// Models
var UsersNames = require("../models/usernames");

/* Config */
var {
    sendAccountCreationMail
} = require("../config/mail")

module.exports.checkLogin = async function (req, res, next) {
    console.log("login data recieved");
    UsersNames.findOne({
            email: req.body.email,
            restrict: "false"
        },
        function (err, result) {
            if (result == null) res.send("wrong details");
            else {
                bcrypt.compare(req.body.password, result.password, function (
                    err,
                    password
                ) {
                    if (password) {
                        req.session.isLogin = 1;
                        req.session.passport.user._id = result._id;
                        req.session.passport.user.name = result.name;

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
                        req.session.passport.user.name = result.name;
                        req.session.passport.user = ob;

                        if (result.status == "Pending") res.send("not");
                        else res.send("Logined");
                    } else res.send("wrong details");
                });
            }
        }
    ).select("+password").catch(err => {
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
    if (req.session.passport.user.temprole == "SuperAdmin") {
        req.session.passport.user.temprole = "User";
        res.send("changed");
    } else {
        req.session.passport.user.temprole = "SuperAdmin";
        res.send("changed");
    }
};

module.exports.changePassword = async function (req, res, next) {

    if (req.body.oldPassword == req.body.newPassword) {
        req.flash('errors', 'Password Are not same');
        res.render("changepassword", {
            data: req.session.passport.user,
            title: req.session.passport.user.name,
            success: req.flash("success"),
            errors: req.flash("errors")
        });
    } else
        UsersNames.findOne({
                _id: req.session.passport.user._id
            },
            async function (error, result) {
                if (error) throw error;
                else {
                    bcrypt.compare(req.body.oldPassword, result.password, function (
                        err,
                        boolans
                    ) {
                        if (boolans) {
                            bcrypt.hash(req.body.newPassword, saltRounds, function (err, newpass) {
                                if (err)
                                    throw err;
                                UsersNames.updateOne({
                                        _id: req.session.passport.user._id
                                    }, {
                                        $set: {
                                            password: newpass
                                        }
                                    },
                                    function (error, result) {
                                        if (error) throw error;
                                        else {
                                            req.flash('success', 'Password Updated');
                                            res.render("changepassword", {
                                                data: req.session.passport.user,
                                                title: req.session.passport.user.name,
                                                success: req.flash("success"),
                                                errors: req.flash("errors")
                                            });
                                        }
                                    }
                                );
                            });
                        } else {
                            req.flash('errors', 'Current Password is wrong');
                            res.render("changepassword", {
                                data: req.session.passport.user,
                                title: req.session.passport.user.name,
                                success: req.flash("success"),
                                errors: req.flash("errors")
                            });
                        }
                    });
                }
            }
        ).select("+password");
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
            _id: req.session.passport.user._id
        },
        function (err, result) {
            var userdata = new Object();
            userdata.interests = result.interests;
            userdata.aboutyou = result.aboutyou;
            userdata.expectations = result.expectations;
            res.render("editprofile", {
                data: req.session.passport.user,
                title: req.session.passport.user.name,
                userdata: userdata
            });
        }
    );
};

module.exports.addUserToDataBase = async function (req, res, next) {
    bcrypt.hash(req.body.password, saltRounds, async function (err, hash) {
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
        await newProduct
            .save()
            .then(async (data_user) => {
                await sendAccountCreationMail(req.body.email, req.body.name, req.body.password);
                console.log("New User created");
                res.send("true")
            })
            .catch(err => {
                console.log(err)
                res.send("false");
            });
    });
}

module.exports.activatesuperadmin = async function (req, res, next) {
    console.log("Activated issuperadmin /activatesuperadmin");
    req.session.passport.user.issuperadmin = "true";
}