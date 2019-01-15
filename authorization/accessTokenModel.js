let userDBHelper;
let accessTokenDBHelper;

module.exports = (injectedUserDbHelper, injectedAccessTokenDBHelper) => {
    userDBHelper = injectedUserDbHelper;
    accessTokenDBHelper = injectedAccessTokenDBHelper;

    return {
        getClient: getClient,
        grantTypeAllowed: grantTypeAllowed,
        getUser: getUser,
        saveAccessToken: saveAccessToken,
        getAccessToken: getAccessToken, 
    }
}

/**
 * method to return to client application to get the accessToken
 * 
 * @param clientID - used to find the clientID
 * @param clientSecret - used to validate the client
 * @param callback
 * 
 */

function getClient(clientID, clientSecret, callback) {
    // create the client
    const client = {
        clientID,
        clientSecret,
        grants: null,
        redirectUris: null,
    };

    callback(false, client);
}

/** 
 * check if the client with the specified cliendID is permitted to use the specified grantType
 * 
 * @param cliendID
 * @param grantType
 * @param callback
 * 
 */

function grantTypeAllowed(cliendID, grantType, callback) {
    callback(false, true);
}

/**
 * finds a user with specified usrname and password
 * 
 * @param username
 * @param password
 * @param callback
 * 
 */

function getUser(username, password, callback) {
    console.log('getUser() called and username is: ', username, ' and password is: ', password, ' and callback is: ', callback, ' and is userDBHelper null is: ', userDBHelper);

  //try and get the user using the user's credentials
  userDBHelper.getUserFromCredentials(username, password, callback)
}

/**
 * saves the accessToken along with the userID retrieved from the given user
 * 
 * @param accessToken
 * @param clientID
 * @param expires
 * @param user
 * @param callback
 * 
 */

function saveAccessToken(accessToken, clientID, expires, user, callback) {
    console.log('saveAccessToken() called and accessToken is: ', accessToken,
    ' and clientID is: ',clientID, ' and user is: ', user, ' and accessTokensDBhelper is: ', accessTokenDBHelper)
  
      //save the accessToken along with the user.id
      accessTokenDBHelper.saveAccessToken(accessToken, user.id, callback)
}

/**
 * validate user along with his bearerToken
 * 
 * @param bearerToken
 * @param callback
 * 
 */

function getAccessToken(bearerToken, callback) {
    //try and get the userID from the db using the bearerToken
    accessTokenDBHelper.getUserIDFromBearerToken(bearerToken, (userID) => {

    //create the token using the retrieved userID
    const accessToken = {
      user: {
        id: userID,
      },
      expires: null
    }

    //set the error to true if userID is null, and pass in the token if there is a userID else pass null
    callback(userID == null ? true : false, userID == null ? null : accessToken)
  })
}

/**
 * creates and returns an accessToken which contains an expiration date field
 * 
 * @param userID
 * @returns {Promise.<{user: {id: *}, expires: null}>}
 * 
 */

function createAccessTokenFrom(userId) {
    return Promise.resolve({
        user: {
            id: userID,
        },
        expires: null,
    });
}