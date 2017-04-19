const mockgoose = require('mockgoose');
const mongoose = require('mongoose');
const bluebird = require('bluebird');
const chai = require('chai');
const chaiMoment = require('chai-moment');
const authManager = require('../../src/auth/auth-manager');
const userManager = require('../../src/users/user-manager');

const expect = chai.expect;

chai.use(chaiMoment);
mockgoose(mongoose);

describe('authManager', () => {
  // Connect to the database.
  before((done) => {
    mongoose.Promise = bluebird;
    mongoose.connect('', done);
  });

  // Clear the database before each test case.
  beforeEach((done) => {
    mockgoose.reset();
    done();
  });

  after((done) => { mongoose.unmock(done); });

  describe('#login', () => {
    it('should pass a token to the callback.', (done) => {
      const info = {
        email: 'student@test.com',
        password: 'P@ssw0rd!Student',
        firstName: 'Test',
        lastName: 'User',
        role: 'Student',
        studentId: '',
      };

      userManager.createUser(info, (createErr, uid) => {
        expect(createErr).to.be.null;
        expect(uid).to.be.a('string');

        authManager.login(info.email, info.password, (loginErr, token) => {
          expect(loginErr).to.be.null;
          expect(token).to.be.a('string');
          done();
        });
      });
    });
  });
});
