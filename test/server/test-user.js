import sinon from 'sinon';
// import logger from 'logger/logger';
import { createUser, deleteUser, modifyUser, getUser } from 'server/user';
import Connection from 'server/core/connection';
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
    sandbox.stub(Connection.prototype, 'call');
    sandbox.stub(tokenManager, 'getToken').callsFake(() => testToken.token);
    sandbox.spy(tokenManager, 'decode');
  });

  afterEach(() => {
    sandbox.restore();
  });


  describe('#createUser', () => {
    it('should create the user', (done) => {
      const expectedResult = { uid: '12345678' };

      Connection.prototype.call.callsFake((onSuccess) => {
        onSuccess(expectedResult);
      });

      createUser(testUser).then((data) => {
        expect(Connection.prototype.call).to.have.been.calledOnce;
        expect(data).to.equal(expectedResult);
        done();
      }).catch(done);
    });
  });

  describe('#deleteUser', () => {
    it('should delete the user with passed in UID', (done) => {
      Connection.prototype.call.callsFake((onSuccess) => {
        onSuccess();
      });

      deleteUser(testUser.uid).then(() => {
        // expect(connection.del).to.have.been.calledOnce;
        done();
      }).catch(done);
    });
  });

  describe('#modifyUser', () => {
    it('should modify the user with passed in UID', (done) => {
      const fieldsToUpdate = {
        name: 'newName',
      };
      Connection.prototype.call.callsFake((onSuccess) => {
        onSuccess();
      });

      modifyUser(fieldsToUpdate, testUser.uid).then(() => {
        // expect(connection.put).to.have.been.calledOnce;
        done();
      }).catch(done);
    });
  });

  describe('#getUser', () => {
    it('should return the requested user with passed in UID', (done) => {
      Connection.prototype.call.callsFake((onSuccess) => {
        onSuccess(testUser);
      });
      getUser(testUser.uid).then((userData) => {
        // expect(connection.get).to.have.been.calledOnce;
        expect(userData).to.equal(testUser);
        done();
      }).catch(done);
    });
  });
});
