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

    // query to see if user exists
    userDBHelper.doesUserExist(username)
        .then(doesUserExist => {

            // check is user doesn't exist
            if(doesUserExist === false) {
                return userDBHelper.registerUserInDB(username, password);
            } else {
                throw new Error('User already exists');
            }
        })
        .then(
            // succefully stored the user
            sendResponse(res, 'Registration was successful', null)
        )
        .catch(error => {
            // failed to register the user
            sendResponse(res, 'Failed to register user', error)
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