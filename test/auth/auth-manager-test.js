const mockgoose = require('mockgoose');
const mongoose = require('mongoose');
const bluebird = require('bluebird');
const chai = require('chai');
const chaiMoment = require('chai-moment');
const jwt = require('jsonwebtoken');
const authManager = require('../../src/auth/auth-manager');
const authModels = require('../../src/auth/auth-models');
const userManager = require('../../src/users/user-manager');

const expect = chai.expect;
const Session = authModels.Session;

chai.use(chaiMoment);
mockgoose(mongoose);

describe('authManager', () => {
  // Connect to the database.
  before((done) => {
    process.env.SECRET = 'testsecret';

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
    it('should pass a student token to the callback.', (done) => {
      const student = {
        email: 'student@test.com',
        password: 'P@ssw0rd!Student',
        firstName: 'Test',
        lastName: 'User',
        role: 'Student',
        studentId: '',
      };

      userManager.createUser(student, (createErr, uid) => {
        expect(createErr).to.be.null;
        expect(uid).to.be.a('string');

        authManager.login(student.email, student.password, (loginErr, token) => {
          expect(loginErr).to.be.null;

          const decoded = jwt.decode(token);
          expect(decoded.email).to.be.equal(student.email);
          expect(decoded.role).to.be.equal(student.role);
          expect(decoded.isApproved).to.be.false;
          done();
        });
      });
    });

    it('should pass an admin token to the callback.', (done) => {
      const admin = {
        email: 'admin@test.com',
        password: 'P@ssw0rd!Admin',
        firstName: 'Test',
        lastName: 'User',
        role: 'Admin',
      };

      userManager.createUser(admin, (createErr, uid) => {
        expect(createErr).to.be.null;
        expect(uid).to.be.a('string');

        authManager.login(admin.email, admin.password, (loginErr, token) => {
          expect(loginErr).to.be.null;

          const decoded = jwt.decode(token);
          expect(decoded.email).to.be.equal(admin.email);
          expect(decoded.role).to.be.equal(admin.role);
          expect(decoded.isApproved).to.be.false;
          done();
        });
      });
    });
  });

  describe('#logout', () => {
    it('should not find a session', (done) => {
      const email = 'session@test.com';
      const token = jwt.sign({}, process.env.SECRET);
      const session = new Session({ email, token });

      session.save((saveErr) => {
        expect(saveErr).to.be.null;

        authManager.logout(email, (logoutErr) => {
          expect(logoutErr).to.be.null;

          Session.findOne({ email }, (findErr, foundSession) => {
            expect(findErr).to.be.null;
            expect(foundSession).to.be.null;
            done();
          });
        });
      });
    });
  });

  describe('#verify', () => {
    it('should verify the student token', (done) => {
      done();
    });
  });
});
