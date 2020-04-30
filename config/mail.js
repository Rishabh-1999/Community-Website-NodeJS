var nodemailer = require("nodemailer");

/* Mail transporter */
let transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.NODEMAILER_EMAIL,
        pass: process.env.NODEMAILER_PASSWORD,
    },
    tls: {
        rejectUnauthorized: false,
    },
});

module.exports.sendAccountCreationMail = async function (email, name, password) {
    var obj = new Object();
    obj.to = email;
    obj.text = `
    Welcome to Community Webpage ${name} .
    Your password is ${password} .
    Thank You.
    `;
    obj.subject = "Welcome to cq";
    return await transporter.sendMail(obj, async (error, info) => {
        if (error)
            console.log(error)
    });
}

module.exports.sendMail = async function (obj_data) {
    var obj = new Object();
    obj.to = obj_data.to;
    obj.text = obj_data.text;
    obj.subject = obj_data.subject;
    await transporter.sendMail(obj, async (error, info) => {
        if (error)
            console.log(error)
    });
    return "true";
}