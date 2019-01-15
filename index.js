// port to connect
const port = 8080;

// mysql connection
const mysqlConnection = require('./dbHelpers/mySqlWrapper');

// database operations for saving and retrieving bearer tokens
const bearerTokens = require('./dbHelpers/bearerTokensDBHelper')(mysqlConnection);

// database operations for registering and retrieveng users
const user = require('./dbHelpers/userDBHelper')(mysqlConnection);

// parse api requests
const bodyParser = require('body-parser');

// express
const express = require('express');

// iniciate express
const expressApp = express();

// node-oauth2-server library
const oAuth2Server = require('node-oauth2-server');

// instantiate accessTokenModel
const oAuthModel = require('./authorization/accessTokenModel')(user, bearerTokens)

// instantiate oAuth2Server and pass in an object
expressApp.oauth = oAuth2Server({
    model: oAuthModel,
    grants: ['password'],
    debug: true,
});

// authRoutesMethods object
const authRoutesMethods = require('./authorization/authRoutesMethods')(user)

// authRouter object
const authRouter = require('./authorization/authRouter')(express.Router(), expressApp, authRoutesMethods);

// assign authRouter as middleware in the express app
expressApp.use('/auth', authRouter);

// oauth error handling
expressApp.use(expressApp.oauth.errorHandler());

// parse the urlencoded post data
expressApp.use(bodyParser.urlencoded({ extended: true }));

// init the server
expressApp.listen(port, () => {
    console.log('listening on port ', port);
});