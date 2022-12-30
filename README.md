# Ice Cream Places
## Introduction
Following project was created by group of students as student assignment. It was developed during single semester.
</br> 
Our task was to develop web application that would allow convenient ice cream parlors management. Additionally it suppose to create a single space that would gather all ice cream places and information about them for the ease of customers.
</br>
Project was developed using MERN stack.
</br>
</br>
**Following repository referes to project backend**
</br>
Frontend code may be found [here](https://github.com/Ice-Cream-Places-ICP/WEB)
</br>
## Getting started
To get the Node server running locally:
- Clone this repository
- `npm install` to install project [dependencies](#dependencies)
- Install MongoDB Community Edition using following [instructions](https://www.mongodb.com/docs/manual/installation/#tutorials)
- Add **.env** file to your project structure containing following [environmental variables](#environmental-variables)
- `npm run dev` to start the local server

To run tests:
- `npm run test`

## Dependencies
Production:
- [bcrypt](https://github.com/pyca/bcrypt) - Password hashing for your software and servers
- [cors](https://github.com/expressjs/cors) - Provides middleware that is being used to enable CORS for application
- [dotenv](https://github.com/motdotla/dotenv) - Loads environment variables from .env
- [expressjs](https://github.com/expressjs/express) - The server for handling and routing HTTP requests
- [jsonwebtoken](https://github.com/auth0/node-jsonwebtoken) - For generating JWTs used by authentication
- [mongoose](https://github.com/Automattic/mongoose) - For modeling and mapping MongoDB data to javascript 
- [morgan](https://github.com/expressjs/morgan) - HTTP request logger middleware
- [nodemailer](https://github.com/nodemailer/nodemailer) - Used for sending email on application behalf
- [validator](https://github.com/validatorjs/validator.js/) - A library of string validators and sanitizers
- [winston](https://github.com/winstonjs/winston) - Universal logging library

Development:
- [jest](https://github.com/facebook/jest) - Javascript testing framework
- [nodemon](https://github.com/remy/nodemon) - Monitor for any changes in your node.js application and automatically restart the server
- [supertest](https://github.com/ladjs/supertest) - Super-agent driven library for testing node.js HTTP servers using a fluent API

## Environmental variables
Following information should be stored in **.env** file:
- PORT - port number used by your application
- API_URL - application URL
- WEB_PORT - frontend application URL
- TOKEN_SECRET - application token secret
- DB_CONNECTION - MongoDB connection string
- TEST_DB_CONNECTION - MongoDB test database connection string
- USER - email address used by app to send verification email
- PASS - email password

Notes
- Application uses gmail as its service so in order to allow confirmation emails to be send properly you have to use gmail account

**.env** file example
```
PORT=5000
API_URL=http://localhost:5000
WEB_PORT=6000
TOKEN_SECRET=sample_secret
DB_CONNECTION=mongodb://localhost:27017/db-name
TEST_DB_CONNECTION=mongodb://localhost:27017/db-name-test
USER=sample-email-address@gmail.com
PASS=sample-password
```