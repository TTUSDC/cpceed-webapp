// import init from 'server/firebase.js';
import server from 'server/server.js';
import { store } from 'App.js';
import { AuthStates } from 'redux/actions';
//import logger from 'logger/logger.js';

const user38257001 = {
  studentId: '38257001',
  password: 'SD678fdg$',
  uid: 'e95IXy3d6zampLzmtnizERxjaMr2',
  email: 'test-38257001@ttu.edu',
};

const expect = require('chai').expect;

export default describe('Auth', () => {
  describe('#login(email,password)', () => {
    it('should login to account', (done) => {
      const testUser = user38257001;
      server.login(testUser.email, testUser.password).then((user) => {
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
      const testUser = user38257001;
      server.login(testUser.email, testUser.password).then((user) => {
        expect(user.studentId).to.equal(testUser.studentId);
        server.logout().then(() => {
          const reduxUser = store.getState().user;
          expect(reduxUser.role).to.equal(AuthStates.GUEST);
          done();
        }).catch((err) => { done(err); });
      }).catch((err) => { done(err); });
    }).timeout(10000);
  });
});
