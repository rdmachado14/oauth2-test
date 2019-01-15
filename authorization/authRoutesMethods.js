// object to saving new user and retrieving existing ones
let userDBHelper;

/**
 * @param injectedUserDBHelper - this object handles the execution of user
 * related database operation such as storing them when they register
 * 
 * @return {{ registerUser: registerUser, login: * }}
 */

module.exports = injectedUserDBHelper => {
    userDBHelper = injectedUserDBHelper

    return {
        registerUser: registerUser,
        login: login,
    }
}

/**
 * 
 * @param req - request from aqpi client
 * @param res - response to respond to client
 */

function registerUser(req, res) {

    // get username and password of the client
    const username = req.body.username;
    const password = req.body.password;

    // validate the resquest
    if(!isString(username) || !isString(password)) {
        return sendResponse(res, 'Invalid Credentials', true);
    }

    //query db to see if the user exists already
    userDBHelper.doesUserExist(username, (sqlError, doesUserExist) => {

        //check if the user exists
        if (sqlError !== null || doesUserExist) {
  
          //message to give summary to client
          const message = sqlError !== null ? "Operation unsuccessful" : "User already exists"
  
          //detailed error message from callback
          const error =  sqlError !== null ? sqlError : "User already exists"
  
          sendResponse(res, message, sqlError)
  
          return
        }
  
        //register the user in the db
        userDBHelper.registerUserInDB(username, password, dataResponseObject => {
  
          //create message for the api response
          const message =  dataResponseObject.error === null  ? "Registration was successful" : "Failed to register user"
  
          sendResponse(res, message, dataResponseObject.error)
        });
      });
}

function login(req, res) {
    const username = req.body.username;
    const password = req.body.password;


    // validate the resquest
    if(!isString(username) || !isString(password)) {
        return sendResponse(res, 'Invalid Credentials', true);
    }


    userDBHelper.getUserFromCredentials(username, (response) => {
        console.log(response);
    });
}

/**
 * 
 * send a responde created out of client parameters
 * 
 * @param res - reponse to respond to client
 * @param message - message to send to the client
 * @param error - error to send to the client
 * 
 */

function sendResponse(res, message, error) {
    // status code to send to the client
    res
        .status(error !== null ? error !== null ? 400 : 200 : 400)
        .json({
            'message': message,
            'error': error,
        });
}

/**
 * 
 * Returns true if the parameters is a string or false if doesn't
 * 
 * @param parameter - check if is a string
 * @return {boolean}
 * 
 */

function isString(parameter) {
    return parameter !== null && (typeof parameter === 'string' || parameter instanceof String) ? true : false;
}