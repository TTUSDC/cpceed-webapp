const mockgoose = require('mockgoose');
const mongoose = require('mongoose');
const bluebird = require('bluebird');
const chai = require('chai');
const chaiMoment = require('chai-moment');
const jwt = require('jsonwebtoken');
const authManager = require('../../../api/auth/auth-manager');
const authModels = require('../../../api/auth/auth-models');
const userManager = require('../../../api/users/user-manager');
const userModels = require('../../../api/users/user-models');
const testUsers = require('../../core/users');

const expect = chai.expect;
const Session = authModels.Session;
const Admin = userModels.Admin;
const Student = userModels.Student;

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
      const student = testUsers.student000;

      userManager.createUser(student, (createErr, uid) => {
        expect(createErr).to.be.null;
        expect(uid).to.be.a('string');

        authManager.login(student.email, student.password, (loginErr, token) => {
          expect(loginErr).to.be.null;

          const decoded = jwt.decode(token);
          expect(decoded.email).to.be.equal(student.email);
          expect(decoded.role).to.be.equal(student.role);
          expect(decoded.isApproved).to.be.false;
          expect(decoded.id).to.be.a('string');
          Student.findById(decoded.id, (studentErr, foundStudent) => {
            expect(studentErr).to.be.null;
            expect(foundStudent.email).to.equal(student.email);
            done();
          });
        });
      });
    });

    it('should pass an admin token to the callback.', (done) => {
      const admin = testUsers.admin000;

      userManager.createUser(admin, (createErr, uid) => {
        expect(createErr).to.be.null;
        expect(uid).to.be.a('string');

        authManager.login(admin.email, admin.password, (loginErr, token) => {
          expect(loginErr).to.be.null;

          const decoded = jwt.decode(token);
          expect(decoded.email).to.be.equal(admin.email);
          expect(decoded.role).to.be.equal(admin.role);
          expect(decoded.isApproved).to.be.false;
          expect(decoded.id).to.be.a('string');

          Admin.findById(decoded.id, (adminErr, foundAdmin) => {
            expect(adminErr).to.be.null;
            expect(foundAdmin.email).to.equal(admin.email);
            done();
          });
        });
      });
    });
  });

  describe('#logout', () => {
    it('should not find a session', (done) => {
      const email = 'session@test.com';
      const token = jwt.sign({ email }, process.env.SECRET);
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
    it('should verify the passed token', (done) => {
      const email = 'session@test.com';
      const token = jwt.sign({ email }, process.env.SECRET);
      const session = new Session({ email, token });

      session.save((saveErr) => {
        expect(saveErr).to.be.null;

        const req = { body: { token } };
        const res = { locals: { err: null, auth: null } };

        authManager.verify(req, res, () => {
          expect(res.locals.err).to.be.null;
          expect(res.locals.auth).to.deep.equal(jwt.decode(token));
          done();
        });
      });
    });
  });
});
