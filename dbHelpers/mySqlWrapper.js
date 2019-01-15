module.exports = {
    query: query,
}

// mysql object
const mySql = require('mysql');

// object to connect to the db
let connection = null;

// creating connection to the db
function initConnection() {
    // setting the connection
    connection = mySql.createConnection({
        host: 'localhost',
        user: 'root',
        password: '',
        database: 'oAuth2Test'
    });
}

/**
 * 
 * run the specified query and returns a callback which is given with the results in db
 * 
 * @param queryString
 * @param callback - takes the db response
 * 
 */

function query(queryString, callback) {
    // init the db connection
    initConnection();

    // connect to the db
    connection.connect();

    // execute the query
    connection.query(queryString, function(error, results, fields) {
        console.log('mySql: query: error is: ', error, 'and results are: ', results);

        // disconnect from db
        connection.end();

        // send response in callback
        callback(createDataResponseObject(error, results));
    });
}

/**
 * creates and returns a DataResponseObject made out of the specified parameters.
 * A DataResponseObject has two variables. An error which is a boolean and the results of the query.
 *
 * @param error
 * @param results
 * @return {DataResponseObject<{error, results}>}
 */
function createDataResponseObject(error, results) {

    return {
      error: error,
      results: results === undefined ? null : results === null ? null : results
    }
}