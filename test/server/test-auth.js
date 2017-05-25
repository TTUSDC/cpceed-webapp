import sinon from 'sinon';
import { store } from 'App.js';
import { AuthStates } from 'redux/actions';
import logger from 'logger/logger.js';
import { login, logout } from 'server/user-auth';
import * as tokenManager from 'server/core/tokenmanager';
import * as connection from 'server/core/connection';
import { user38257001 as testUser } from './core/users';
import { testToken1 as testToken } from './core/tokens';

const sinonChai = require('sinon-chai');
const chai = require('chai');

chai.use(sinonChai);
const expect = chai.expect;

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
  describe('#login', () => {
    beforeEach(() => {
      sinon.stub(tokenManager, 'saveToken');
      sinon.stub(connection, 'post', (endpoint, data, onSuccess) => {
        onSuccess({
          token: testToken.token,
        });
      });
    });

    afterEach(() => {
      tokenManager.saveToken.restore();
    });

    it('should save the session token', (done) => {
      login(testUser.email, testUser.password).then((userData) => {
        expect(userData).to.not.be.null;
        expect(connection.post).to.have.been.calledOnce;
        const connectionPostData = connection.post.getCall(0).args[1];
        expect(connectionPostData.email).to.equal(testUser.email);
        expect(connectionPostData.password).to.equal(testUser.password);
        expect(tokenManager.saveToken).to.have.been.calledOnce;
        expect(tokenManager.saveToken.getCall(0).args[0]).to.equal(testToken.token);
        done();
      });
    });
  });
  // describe('#logout()', () => {
  //   it('should login then logout of account', (done) => {
  //     login(testUser.email, testUser.password).then((user) => {
  //       expect(user.studentId).to.equal(testUser.studentId);
  //       logout().then(() => {
  //         const reduxUser = store.getState().user;
  //         expect(reduxUser.role).to.equal(AuthStates.GUEST);
  //         done();
  //       }).catch((err) => { done(err); });
  //     }).catch((err) => { done(err); });
  //   }).timeout(10000);
  // });
});
