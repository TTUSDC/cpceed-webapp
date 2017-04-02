import init from 'server/firebase.js';
import { login } from 'server/user-auth.js';
import { store } from 'App.js';
import logger from 'logger/logger.js';

const user38257001 = {
  studentId: '38257001',
  password: 'SD678fdg$',
  uid: 'e95IXy3d6zampLzmtnizERxjaMr2',
};

const expect = require('chai').expect;

export default describe('Auth', () => {
  describe('#login(email,password)', () => {
    it('should login to account', (done) => {
      const testUser = user38257001;
      login('test-38257001@ttu.edu', 'SD678fdg$').then((user) => {
         expect(user.studentId).to.equal(testUser.studentId);
         done();
       }).catch((err) => {
         done(err);
       });
    }).timeout(10000);
  });
});
