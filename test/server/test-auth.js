import { store } from 'App.js';
import { AuthStates } from 'redux/actions';
// import logger from 'logger/logger.js';
import { login, logout } from 'server/user-auth';

import { user38257001 as testUser } from './core/users';

const expect = require('chai').expect;

export default describe('Server API: Auth', () => {
  describe('initial state', () => {
    /*
     * The purpose of these tests is not to test the code of user-auth, but to
     * test certain assumptions that other tests here make.
     * If one of these tests fails, that means that an assumption a test here
     * makes and relies on may no longer be valid.
     */
    it('should be in GUEST mode', (done) => {
      const reduxUser = store.getState().user;
      expect(reduxUser.role).to.equal(AuthStates.GUEST);
      done();
    });
  });
  describe('#login(email,password)', () => {
    it('should login to account', (done) => {
      login(testUser.email, testUser.password).then((user) => {
        expect(user.studentId).to.equal(testUser.studentId);
        const reduxUser = store.getState().user;
        expect(reduxUser.studentId).to.equal(testUser.studentId);
        expect(reduxUser.uid).to.equal(testUser.uid);
        done();
      }).catch((err) => {
        done(err);
      });
    }).timeout(10000);
  });
  describe('#logout()', () => {
    it('should login then logout of account', (done) => {
      login(testUser.email, testUser.password).then((user) => {
        expect(user.studentId).to.equal(testUser.studentId);
        logout().then(() => {
          const reduxUser = store.getState().user;
          expect(reduxUser.role).to.equal(AuthStates.GUEST);
          done();
        }).catch((err) => { done(err); });
      }).catch((err) => { done(err); });
    }).timeout(10000);
  });
});
