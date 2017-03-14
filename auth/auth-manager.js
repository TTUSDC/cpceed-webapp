var config = require('../config.js');
var Lockit = require('lockit');

// mongodb - https://github.com/zemirco/lockit/tree/master/examples/mongodb

/**
 * Check if the given password hash matches the password
 * hash in the db. If yes, then create and send a token to the client.
 * Otherwise, raise an error.
 * @param {Object} reqData - The request object containing the fields.
 * @param {Object} locals - An object containing the current request's local
 *     variables.
 * @param {reportCallback} loginCallback - Called once the operation finishes.
 */
var login = (reqData, locals, loginCallback) => {
  // TODO(the-pat): check if the given password hash matches the password
  // hash in the db. If yes, then create and send a token to the client
};

/**
 * Delete the current user's auth token.
 * @param {string} userUid - The UID corresponding to the user to be logged out
 * @param {Object} reqData - The request object containing the fields.
 * @param {Object} locals - An object containing the current request's local
 *     variables.
 * @param {reportCallback} loginCallback - Called once the operation finishes.
 */
var logout = (userUid, reqData, locals, logoutCallback) => {
  // TODO(the-pat): Delete the current users auth token
};
