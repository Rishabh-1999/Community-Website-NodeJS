# Community-Website-Web-Project

Website in which community can interact with each other.It is a Website developed under UCA class for our Web Project.
To run this website run this command on command prompt on root folder.

```
npm start or node app.js
```

It will run under the url http://127.0.0.1:3000/

Email and Password for Online Website:<br>
User:<br>
Email Id: user@gmail.com<br>
Password: user<br>

Admin :<br>
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
- Pre-requisites or Dependencies(Below)

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
| githubid     | String | No       | No     | No        |

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

- EJS

```
npm install ejs
```

- Express-Session

```
npm install express-session
```

- Multer

```
npm install multer
```

- Mongoose

```
npm install mongoose
```

- Node Mailer

```
npm install nodemailer
```

- Passport-GitHub

```
npm install passport-github
```

- Dotenv

```
npm install dotenv
```

- Bcrpty

```
npm install bcrpty  / npm i bcrpty
```

- Socket

```
npm install socket
```

## Directory

```bash
|___ Root
|   |--- app.js
|   |
|   |--- Controller
|   |    |--- community.js
|   |    |--- community-user.js
|   |    |--- discussion.js
|   |    |--- index.js
|   |    |--- tag.js
|   |    |--- user.js
|   |
|   |--- Dump (Mongoose Dump) (Dump)
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
|   |    |--- images (Staic and Dynamic)
|   |    |--- script (Static)
|   |    |--- index.html
|   |
|   |--- Routes
|   |    |--- community.js
|   |    |--- discussion.js
|   |    |--- tagtable.js
|   |    |--- usertable.js
|   |
|   |--- viwes
|   |    |--- js (static)
|   |    |--- partials
|   |    |    |--- sidebar.ejs
|   |    |    |--- topar.ejs
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
|   |    |--- homewithedit.ejs
|   |    |--- invitedbycommunity.ejs
|   |    |--- invitedusers.ejs
|   |    |--- loading.ejs
|   |    |--- manageCommunity.ejs
|   |    |--- taglists.ejs
|   |    |--- tagpage.ejs
|   |    |--- userprofile.ejs
|   |    |--- usertable.ejs
```
