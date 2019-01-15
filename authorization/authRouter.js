/**
 *
 * @param router - we assign routes and endpoint functions for each route
 *                  to this object.
 *
 * @param expressApp - an instance of the express app. By applying
 *                     expressApp.oauth.grant() method to an endpoint
 *                     the endpoint will return a bearer token
 *                     to the client if it provides calid credentials.
 *
 * @param authRoutesMethods - an object which contains the registration method. It
 *                           can be populated with other methods such as deleteUser()
 *                           if you decide to build out of this project's structure.
 * @return {route}
 */

module.exports = (router, expressApp, authRoutesMethods) => {
    // route client´s to register new user
    router.post('/registerUser', authRoutesMethods.registerUser);

    // route client´s to login user with username and password
    // if they succefully login this method will return a bearer token
    router.post('/login', expressApp.oauth.grant(), authRoutesMethods.login);

    return router;
}