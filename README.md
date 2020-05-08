# Community-Website-Web-Project

Website in which community can interact with each other.It is a Website developed under UCA class for our Web Project.
To run this website run this command on command prompt on root folder.

It will run under the url http://127.0.0.1:3000/

### To Run
```
npm start or node app.js
```

### To Install Dependiences
```
npm install
```

Email and Password for Online Website:<br>
User:<br>
Email Id: user@gmail.com<br>
Password: user<br>

Admin :<br>
Email :admin@gmail.com<br>
Password: admin<br>
Email :batman@gmail.com<br>
Password: batman<br>
Email :ironman@gmail.com<br>
Password: ironman<br>

## Features

- Dynamic Data by mongoose database
- Different View For User, Admin and Super Admin
- Capable for uploading photo or setting photo of User
- Capable of sending Mail using NodeMailer
- Github Passport - Session
- Responsive Layout
- Mobile Friendly
- Open Source

## Pre-requisites

- Node JS (Tested on v12.14.0)
- Mongoose
- MongoDB Compass ( Optional )
- Pre-requisites or Dependencies( Defined Below )

## Schema

<h4><b>UserNames Schema</b></h4>

| Name         | Type   | Required | Unique | Encrpyted |
| ------------ | ------ | -------- | ------ | --------- |
| Name         | String | Yes      | No     | No        |
| Email        | String | Yes      | Yes    | No        |
| Gender       | String | Yes      | No     | No        |
| Password     | String | Yes      | No     | Yes       |
| DOB          | String | Yes      | No     | No        |
| Phone No.    | String | Yes      | No     | No        |
| City         | String | Yes      | No     | No        |
| role         | String | Yes      | No     | No        |
| status       | String | Yes      | No     | No        |
| restrict     | String | No       | No     | No        |
| isActive     | String | Yes      | No     | No        |
| interests    | String | No       | No     | No        |
| aboutyou     | String | No       | No     | No        |
| expectations | String | No       | No     | No        |
| photoloc     | String | No       | No     | No        |

<h4><b>Community Schema</b></h4>

| Name         | Type                           | Required | Unique |
| ------------ | ------------------------------ | -------- | ------ |
| Photoloc     | String                         | No       | No     |
| name         | String                         | Yes      | Yes    |
| members      | String                         | No       | No     |
| rule         | String                         | Yes      | No     |
| communityloc | String                         | No       | No     |
| createdate   | String                         | Yes      | No     |
| description  | String                         | No       | No     |
| owner        | String                         | Yes      | No     |
| status       | String                         | Yes      | No     |
| ownerid      | String                         | No       | No     |
| request      | Array of ObjectId('UsersName') | No       | No     |
| managers     | Array of ObjectId('UsersName') | No       | No     |
| invited      | Array of ObjectId('UsersName') | No       | No     |
| users        | Array of ObjectId('UsersName') | No       | No     |

<h4><b>Comment Schema</b></h4>

| Name         | Type   | Required | Unique |
| ------------ | ------ | -------- | ------ |
| comment      | String | No       | No     |
| postId       | String | No       | No     |
| communityId  | String | No       | No     |
| commentedBy  | String | No       | No     |
| discussionId | String | No       | No     |
| ownerId      | String | No       | No     |
| reply        | String | No       | No     |

<h4><b>Tag Schema</b></h4>

| Name        | Type   | Required | Unique |
| ----------- | ------ | -------- | ------ |
| tagname     | String | Yes      | No     |
| createdby   | String | Yes      | No     |
| createddate | String | Yes      | No     |
| deleted     | String | No       | No     |

<h4><b>Reply Schema</b></h4>

| Name         | Type   |
| ------------ | ------ |
| reply        | String |
| commentId    | String |
| repliedBy    | String |
| ownerId      | String |
| discussionId | String |

<h4><b>Discussion Schema</b></h4>

| Name          | Type   |
| ------------- | ------ |
| title         | String |
| description   | String |
| tag           | String |
| communityName | String |
| communityId   | String |
| createdDate   | String |
| ownerId       | String |
| createdBy     | String |

## Dependencies

- Express

```
npm install express
```

- Serve Favicon

```
npm install serve-favicon
```

- Express-Session

```
npm install express-session
```

- Express Fileupload

```
npm install express-fileupload
```

- Express Flash

```
npm install express-flash
```

- EJS

```
npm install ejs
```

- EJS-Mate

```
npm install ejs-mate
```

- Multer

```
npm install multer
```

- Mongoose

```
npm install mongoose
```

- Morgan

```
npm install morgan
```

- Connect Mongo

```
npm install connect-mongo
```

- Node Mailer

```
npm install nodemailer
```

- Dotenv

```
npm install dotenv
```

- Nodemon

```
npm install nodemon
```

- Bcrpty

```
npm install bcrpty  / npm i bcrpty
```

- Body Parser

```
npm install body-parser
```

- Cloudinary

```
npm install cloudinary
```

- Socket

```
npm install socket
```

- Passport

```
npm install passport
```

- Passport-Local

```
npm install passport-local
```

## Directory

```bash
|___ Root
|   |--- config
|   |    |--- db.js
|   |    |--- passport.js
|   |    |--- mail.js
|   |
|   |--- app.js
|   |
|   |--- Procfile ( Heroku )
|   |
|   |--- Dump (Mongoose Dump) (Dump)
|   |
|   |--- .env ( Environment Module )
|   |
|   |--- testing_module
|   |    |--- testing.csv
|   |
|   |--- config
|   |    |--- db.js
|   |    |--- passport.js
|   |    |--- mail.js
|   |
|   |--- Controller
|   |    |--- community.js
|   |    |--- community-user.js
|   |    |--- discussion.js
|   |    |--- index.js
|   |    |--- tag.js
|   |    |--- user.js
|   |
|   |--- Middlewares
|   |    |--- middleware.js
|   |
|   |--- Models
|   |    |--- comment.js
|   |    |--- communitys.js
|   |    |--- discussion.js
|   |    |--- reply.js
|   |    |--- tag.js
|   |    |--- usernames.js
|   |
|   |--- Public
|   |    |--- css (Static)
|   |    |--- images (Static)
|   |    |--- script (Static)
|   |
|   |--- routes
|   |    |--- community.js
|   |    |--- discussion.js
|   |    |--- tagtable.js
|   |    |--- usertable.js
|   |
|   |--- viwes
|   |    |--- js (static)
|   |    |--- layout
|   |    |    |--- layout.ejs
|   |    | 
|   |    |--- partials
|   |    |    |--- includes
|   |    |    |    |--- link-css.ejs
|   |    |    |    |--- link-js.ejs
|   |    |    |--- header.ejs
|   |    |    |--- navbar.ejs
|   |    |    |--- sidebar.ejs
|   |    |
|   |    |--- addCommunity.ejs
|   |    |--- addUser.ejs
|   |    |--- changepassword.ejs
|   |    |--- communityalllists.ejs
|   |    |--- communitylists.ejs
|   |    |--- communitymembers.ejs
|   |    |--- communityprofile.ejs
|   |    |--- communitytable.ejs
|   |    |--- discussion.ejs
|   |    |--- editcommunity.ejs
|   |    |--- editprofile.ejs
|   |    |--- home.ejs
|   |    |--- invitedbycommunity.ejs
|   |    |--- invitedusers.ejs
|   |    |--- loading.ejs
|   |    |--- login.ejs
|   |    |--- manageCommunity.ejs
|   |    |--- taglists.ejs
|   |    |--- tagpage.ejs
|   |    |--- userprofile.ejs
|   |    |--- usertable.ejs
```
