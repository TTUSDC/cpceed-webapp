import logger from 'logger/logger';
import * as connection from 'server/core/connection';

export function createUser(newUser) {
  return new Promise((resolve, reject) => {
    connection.post('/users', newUser,
    (res) => {
      logger.info(res, 'res');
      resolve(res);
    }, reject);
  });
}

export function modifyUser() {

}
