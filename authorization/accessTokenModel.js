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
    // get the user with credentials
    userDBHelper.getUserFromCredentials(username, password)
        .then(user => callback(false, user))
        .catch(error => callback(error, null));
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

function saveAccessToken(accessToken, cliendID, expires, user, callback) {
    accessTokenDBHelper.saveAccessToken(accessToken, user.id)
        .then(() => callback(null))
        .catch(error => callback(error));
}

/**
 * validate user along with his bearerToken
 * 
 * @param bearerToken
 * @param callback
 * 
 */

function getAccessToken(bearerToken, callback) {
    // try to get the userID from de database using bearerToken
    accessTokenDBHelper.getUserIDFromBearerToken(bearerToken)
        .then(userID => createAccessTokenFrom(userID))
        .then(accessToken => callback(null, false, accessToken))
        .catch(error => callback(true, null))
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