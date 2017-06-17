import sinon from 'sinon';
import { store } from 'App.jsx';
import { AuthStates } from 'redux/actions';
// import logger from 'logger.js';
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
  before(() => {
    sinon.stub(tokenManager, 'saveToken');
    sinon.stub(tokenManager, 'removeToken');
    sinon.stub(connection, 'post').callsFake((endpoint, data, onSuccess, onError) => {
      if (endpoint === '/auth') {
        onSuccess({
          token: testToken.token,
        });
      } else {
        onError(new Error('Test: Invalid post endpoint'));
      }
    });
    sinon.stub(connection, 'del').callsFake((endpoint, data, onSuccess, onError) => {
      if (endpoint === '/auth') {
        onSuccess();
      } else {
        onError(new Error('Test: Invalid del endpoint'));
      }
    });
  });

  afterEach(() => {
    tokenManager.saveToken.resetHistory();
    tokenManager.removeToken.resetHistory();
    connection.post.resetHistory();
    connection.del.resetHistory();
  });

  after(() => {
    tokenManager.saveToken.restore();
    tokenManager.removeToken.restore();
    connection.post.restore();
    connection.del.restore();
  });

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

  describe('#logout', () => {
    it('should remove the session token', (done) => {
      login(testUser.email, testUser.password).then((userData) => {
        expect(userData).to.not.be.null;
        logout().then(() => {
          expect(connection.del).to.have.been.calledOnce;
          const reduxUser = store.getState().user;
          expect(reduxUser.role).to.equal(AuthStates.GUEST);
          expect(tokenManager.removeToken).to.have.been.calledOnce;
          done();
        }).catch((err) => { done(err); });
      }).catch((err) => { done(err); });
    });
  });
});
