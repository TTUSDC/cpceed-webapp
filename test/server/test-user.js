import sinon from 'sinon';
// import logger from 'logger/logger';
import { createUser } from 'server/user';
import * as connection from 'server/core/connection';
import { user38257001 as testUser } from './core/users';

const sinonChai = require('sinon-chai');
const chai = require('chai');

chai.use(sinonChai);
const expect = chai.expect;
const sandbox = sinon.sandbox.create();

export default describe('Server API: User', () => {
  beforeEach(() => {
    sandbox.stub(connection, 'post');
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
        expect(data).to.equal(expectedResult);
        done();
      }).catch((err) => {
        done(err);
      });
    });
  });
});
