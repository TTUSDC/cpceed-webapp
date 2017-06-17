import sinon from 'sinon';
import { store } from 'App.jsx';
import { AuthStates } from 'redux/actions';
// import logger from 'logger/logger.js';
import { login, logout } from 'server/user-auth';
import * as tokenManager from 'server/core/tokenmanager';
import Connection from 'server/core/connection';
import { user38257001 as testUser } from './core/users';
import { testToken1 as testToken } from './core/tokens';

const sinonChai = require('sinon-chai');
const chai = require('chai');


const sandbox = sinon.sandbox.create();

chai.use(sinonChai);
const expect = chai.expect;

export default describe('Server API: Auth', () => {
  beforeEach(() => {
    sandbox.stub(Connection.prototype, 'call');
    sandbox.stub(tokenManager, 'saveToken');
    sandbox.stub(tokenManager, 'removeToken');
    sandbox.stub(tokenManager, 'getToken');
  });

  afterEach(() => {
    sandbox.restore();
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
      Connection.prototype.call.callsFake((onSuccess) => {
        onSuccess({
          token: testToken.token,
        });
      });
      login(testUser.email, testUser.password).then((userData) => {
        const connectionCallData = Connection.prototype.call.thisValues[0];
        expect(userData).to.not.be.null;
        expect(Connection.prototype.call).to.have.been.calledOnce;
        expect(connectionCallData.method).to.equal('post');
        expect(connectionCallData.url).to.equal('/auth');
        expect(connectionCallData.config.data).to.deep.equal({
          email: testUser.email,
          password: testUser.password,
        });
        expect(tokenManager.saveToken).to.have.been.calledOnce;
        expect(tokenManager.saveToken.getCall(0).args[0]).to.equal(testToken.token);
        done();
      });
    });
  });

  describe('#logout', () => {
    it('should remove the session token', (done) => {
      tokenManager.getToken.callsFake(() => testToken.token);
      Connection.prototype.call.callsFake((onSuccess, onError) => {
        const method = Connection.prototype.call
          .thisValues[Connection.prototype.call.callCount - 1].method;
        if (method === 'post') {
          onSuccess({
            token: testToken.token,
          });
        } else if (method === 'delete') {
          onSuccess();
        } else {
          onError();
        }
      });
      login(testUser.email, testUser.password).then((userData) => {
        expect(userData).to.not.be.null;
        logout().then(() => {
          expect(Connection.prototype.call).to.have.been.calledTwice;
          const connectionCallData = Connection.prototype.call.thisValues[1];
          expect(connectionCallData.method).to.equal('delete');
          expect(connectionCallData.url).to.equal('/auth');
          expect(connectionCallData.config.data).to.deep.equal({
            token: testToken.token,
          });
          const reduxUser = store.getState().user;
          expect(reduxUser.role).to.equal(AuthStates.GUEST);
          expect(tokenManager.removeToken).to.have.been.calledOnce;
          expect(tokenManager.getToken).to.have.been.calledOnce;
          done();
        }).catch((err) => { done(err); });
      }).catch((err) => { done(err); });
    });
  });
});
