// import logger from 'logger/logger';
import * as connection from 'server/core/connection';
import * as tokenManager from 'server/core/tokenmanager';

/**
 * Creates a new user on the server
 *
 * @param {UserSchema} newUser - The data for the new user
 * @return {Promise<string, Error>} - Promise that resolves with the UID or
 *                                    rejects with the error
 */
export function createUser(newUser) {
  return new Promise((resolve, reject) => {
    connection.post('/users', newUser, {},
    (res) => {
      resolve(res);
    }, reject);
  });
}

/**
 * Deletes a user from the database
 *
 * @param {string} [userUid] - UID of user to be removed, defaults to current
 *                             user's uid
 * @return {Promise<Error>} - Resolves on null, rejects with error
 */
export function deleteUser(userUid) {
  return new Promise((resolve, reject) => {
    const token = tokenManager.getToken();
    const uid = userUid || tokenManager.decode(token).id;
    connection.del('/users', {}, { uid, token }, (res) => {
      resolve(res);
    }, reject);
  });
}
