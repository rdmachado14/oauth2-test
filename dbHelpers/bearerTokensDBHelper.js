let mySqlConnection;

module.exports = injectedMySqlConnection => {

    mySqlConnection = injectedMySqlConnection;

    return {
        saveAccessToken: saveAccessToken,
        getUserIDFromBearerToken: getUserIDFromBearerToken,
    }
}

/**
 * 
 * saves the access token in database with the specified user id
 *
 * @param accessToken
 * @param userID
 * @param callback - takes an error or null in case of success
 * 
 */

function saveAccessToken(accessToken, userID, callback) {
    const getUserQuery = `insert into access_tokens (access_token, user_id) VALUES (${accessToken}, ${userID}) on duplicate
        key update access_token = ${accessToken};`;

    // insert the user
    mySqlConnection.query(getUserQuery, (response) => {

        // error can be null
        callback(response.error);
    });
}

/**
 * 
 * retrieves the user id from the specified bearer token
 * 
 * @param bearerToken
 * @param callback - takes user id or null for the error
 * 
 */

function getUserIDFromBearerToken(bearerToken, callback) {

    // get the user
    const getUserIDQuery = `select * from access_tokens where access_token = ${bearerToken};`;

    // execute query to get user id
    mySqlConnection.query(getUserIDQuery, (response) => {
        
        // get user if from the response
        const userID = response.results !== null && response.results.length === 1 ?
            response.results[0].user_id : null;

        callback(userID);
    });
}