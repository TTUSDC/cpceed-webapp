// import logger from 'logger/logger';
import * as connection from 'server/core/connection';


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

export function modifyUser() {

}
