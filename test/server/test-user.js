import sinon from 'sinon';
// import logger from 'logger/logger';
import { createUser, deleteUser } from 'server/user';
import * as connection from 'server/core/connection';
import * as tokenManager from 'server/core/tokenmanager';
import { user38257001 as testUser } from './core/users';
import { testToken1 as testToken } from './core/tokens';

const sinonChai = require('sinon-chai');
const chai = require('chai');

chai.use(sinonChai);
const expect = chai.expect;
const sandbox = sinon.sandbox.create();

export default describe('Server API: User', () => {
  beforeEach(() => {
    sandbox.stub(connection, 'post');
    sandbox.stub(connection, 'del');
    sandbox.stub(tokenManager, 'getToken').callsFake(() => testToken.token);
    sandbox.stub(tokenManager, 'decode');
  });

  afterEach(() => {
    sandbox.restore();
  });


  describe('#createUser', () => {
    it('should create the user', (done) => {
      const expectedResult = { uid: '12345678' };
      connection.post.callsFake(
        (endpoint, data, params, onSuccess) => {
          expect(endpoint).to.equal('/users');
          expect(data).to.equal(testUser);
          onSuccess(expectedResult);
        });
      createUser(testUser).then((data) => {
        expect(connection.post).to.have.been.calledOnce;
        expect(data).to.equal(expectedResult);
        done();
      }).catch((err) => {
        done(err);
      });
    });
  });

  describe('#deleteUser', () => {
    it('should delete the user', (done) => {
      connection.del.callsFake(
        (endpoint, data, params, onSuccess) => {
          expect(endpoint).to.equal('/users');
          expect(params).to.not.be.null;
          expect(params.uid).to.equal(testUser.uid);
          expect(params.token).to.equal(testToken.token);
          expect(tokenManager.getToken).to.have.been.calledOnce;
          expect(tokenManager.decode).to.not.have.been.called;
          onSuccess();
        });
      deleteUser(testUser.uid).then(() => {
        expect(connection.del).to.have.been.calledOnce;
        done();
      }).catch((err) => {
        done(err);
      });
    });
  });
});
