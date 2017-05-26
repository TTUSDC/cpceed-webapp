import sinon from 'sinon';
import { createUser } from 'server/user';
import * as connection from 'server/core/connection';
import { user38257001 as testUser } from './core/users';

const sinonChai = require('sinon-chai');
const chai = require('chai');

chai.use(sinonChai);
const expect = chai.expect;

export default describe('Server API: User', () => {
  describe('#createUser', () => {
    it('should create the user', sinon.test(() => {
      this.stub(connection, 'post').callsFake((endpoint, data, onSuccess, onError) => {
        if (endpoint === '/users') {
          onSuccess();
        } else {
          onError(new Error('Test: Invalid post endpoint'));
        }
      });

    }));
  });
});
