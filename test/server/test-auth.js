import sinon from 'sinon';

import store from 'redux/store.js';
import Connection from 'server/core/connection';
import { AuthStates } from 'redux/actions';
import { login, logout } from 'server/user-auth';
import { user38257001 as testUser } from './core/users';

const sinonChai = require('sinon-chai');
const chai = require('chai');

const sandbox = sinon.sandbox.create();
const expect = chai.expect;
chai.use(sinonChai);

export default describe('Server API: Auth', () => {
  beforeEach(() => {
    sandbox.stub(Connection.prototype, 'call');
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
    it('should call onSuccess', (done) => {
      Connection.prototype.call.callsFake((onSuccess) => {
        onSuccess({ user: testUser });
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
        done();
      }).catch(done);
    });
  });

  describe('#logout', () => {
    it('should call onSuccess', (done) => {
      Connection.prototype.call.callsFake((onSuccess, onError) => {
        const method = Connection.prototype.call
          .thisValues[Connection.prototype.call.callCount - 1].method;
        if (method === 'post') {
          onSuccess({ user: testUser });
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
          const reduxUser = store.getState().user;
          expect(reduxUser.role).to.equal(AuthStates.GUEST);
          done();
        }).catch((err) => { done(err); });
      }).catch((err) => { done(err); });
    });
  });
});
