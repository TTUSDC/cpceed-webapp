const express = require('express');
const userManager = require('api/users/user-manager');
const authManager = require('api/auth/auth-manager');
const logger = require('common/logger.js');

const userRouter = express.Router();

/**
 * Route for creating a new user
 * # API
 * - Endpoint: `/api/users`
 * - Verb: POST
 * - Success Code: 201
 *
 * @typedef {function} Route-CreateUser
 * @param {Object} req - Express request object
 * @param {UserSchema} req.body - User to be created
 * @param {Object} res - Express result object
 * @param {string} res.body - UID of the created user if successful, else the
 *                          error message
 * @param {number} res.status - Indicates success or not
 */
userRouter.post('/', (req, res) => {
  userManager.createUser(req.body, (err, uid) => {
    if (err) {
      logger.error(err);
      res.status(400).json(err).end();
    } else {
      // A User was created.
      res.status(201).json({ uid }).end();
    }
  });
});

/**
 * Route for modiying an existing user
 * # API
 * - Endpoint: `/api/users`
 * - Verb: PUT
 * - Success Code: 200
 *
 * @typedef {function} Route-ModifyUser
 * @param {Object} req - Express request object
 * @param {string} [req.query.uid] UID of user to be modified
 * @param {UserSchema} req.body - Updated fields of the user
 * @param {Object} res - Express result object
 * @param {number} status - 200 on success, 400 if error
 * @param {UserSchema|string} res.body - Modified user | error message
 * @param {string} token - Admin | Modified User
 */
userRouter.put('/',
    authManager.verify,
    authManager.validateUidPermissions,
    (req, res) => {
      userManager.modifyUser(res.locals.uid, req.body, res.locals,
        (err, user) => {
          if (err) {
            logger.error(err);
            res.status(400).json(err).end();
            return;
          }
          res.status(200).json(user).end();
        });
    });

/**
 * Route for deleting an existing user
 * # API
 * - Endpoint: `/api/users`
 * - Verb: DELETE
 * - Success Code: 200
 *
 * @typedef {function} Route-DeleteUser
 * @param {Object} req - Express request object
 * @param {string} [req.query.uid] - UID of user to be deleted
 * @param {string}  token - Admin | User to be deleted
 * @param {Object} res - Express result object
 */
userRouter.delete('/',
    authManager.verify,
    authManager.validateUidPermissions,
    (req, res) => {
      userManager.deleteUser(res.locals.uid, res.locals, (err, result) => {
        if (err) {
          logger.error(err);
          res.status(400).json(err).end();
          return;
        }
        res.status(200).json(result).end();
      });
    });

/**
 * Route for getting an existing user
 * # API
 * - Endpoint: `/api/users`
 * - Verb: GET
 * - Success Code: 200
 *
 * @typedef {function} Route-GetUser
 * @param {Object} req - Express request object
 * @param {string} [req.query.uid] - UID of user to be retrieved
 * @param {string} token - Admin | User being retrieved
 * @param {Object} res - Express result object
 */
userRouter.get('/',
    authManager.verify,
    authManager.validateUidPermissions,
    (req, res) => {
      const uid = res.locals.uid;
      userManager.getUserById(uid, {}, (err, user) => {
        if (err) {
          logger.error(err);
          res.status(400).send(err).end();
          return;
        }

        if (!user) {
          logger.error('No user found.');
          res.status(404).end();
          return;
        }

        res.status(200).json(user).end();
      });
    });

module.exports = { userRouter };
