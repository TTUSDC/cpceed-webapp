const authManager = require('../../../api/auth/auth-manager');
const authModels = require('../../../api/auth/auth-models');
const userManager = require('../../../api/users/user-manager');
const userModels = require('../../../api/users/user-models');
const testUsers = require('../../core/users');
const testTokens = require('../../core/tokens');
const authErrors = require('../../../api/errors/auth-errors');

const Session = authModels.Session;
const Student = userModels.Student;

mockgoose(mongoose);

describe('authManager', () => {
  // Connect to the database.
  before((done) => {
    process.env.SECRET = 'testsecret';
    mongoose.Promise = global.Promise;
    mongoose.connect('', done);
  });

  // Clear the database before each test case.
  beforeEach((done) => {
    mockgoose.reset();
    done();
  });

  after((done) => { mongoose.unmock(done); });

  describe('#login', () => {
    it('should resolve a token.', (done) => {
      const student = testUsers.student000;

      userManager.createUser(student, (createErr, uid) => {
        expect(createErr).to.be.null;
        expect(uid).to.be.a('string');

        authManager.login(student.email, student.password)
          .then((token) => {
            expect(token).to.be.a('string');

            return Session.findOne({ id: token }).exec();
          })
          .then((session) => {
            expect(session.id).to.be.a('string');
            expect(session.email).to.be.a('string');

            return Student.findOne({ email: session.email }).exec();
          })
          .then((user) => {
            expect(user.email).to.be.equal(student.email);
            expect(user.role).to.be.equal(student.role);
            expect(user.isApproved).to.be.false;
            expect(user.id).to.be.a('string');

            done();
          })
          .catch((err) => {
            // If an error is ever thrown, this unit test should fail
            expect(err).to.be.null;

            done();
          });
      });
    });
  });

  describe('#logout', () => {
    it('should not find a session', (done) => {
      const email = 'session@test.com';
      let sessionId;

      Session.genId()
        .then((id) => {
          sessionId = id;
          const session = new Session({ email, id });

          return session.save();
        })
        .then(() => authManager.logout(sessionId))
        .then(() => Session.findOne({ id: sessionId }).exec())
        .then((session) => {
          expect(session).to.be.null;

          done();
        })
        .catch((err) => {
          expect(err).to.be.null;

          done();
        });
    });
  });

  describe('#verify', () => {
    it('should verify the passed token', (done) => {
      const student = testUsers.student000;

      userManager.createUser(student, () => {
        authManager.login(student.email, student.password)
          .then((token) => {
            const req = { body: { token } };
            const res = { locals: { err: null, auth: null } };

            authManager.verify(req, res, () => {
              expect(res.locals.err).to.be.null;

              done();
            });
          })
          .catch((err) => {
            expect(err).to.be.null;

            done();
          });
      });
    });
  });

  describe('#validateUidPermissions', () => {
    let req;
    let res;

    beforeEach(() => {
      req = { query: {} };
      res = { locals: { err: null, auth: {} } };
    });
    describe('user accessing their own data', () => {
      const testToken = testTokens.testTokenStudent000;
      beforeEach(() => {
        req.query.token = testToken.token;
        res.locals.auth.id = testToken.id;
      });
      it('should let them with a query param', (done) => {
        req.query.uid = testToken.id;

        authManager.validateUidPermissions(req, res, () => {
          expect(res.locals.err).to.be.null;
          expect(res.locals.uid).to.equal(testToken.id);
          done();
        });
      });
      it('should let them without a query param', (done) => {
        authManager.validateUidPermissions(req, res, () => {
          expect(res.locals.err).to.be.null;
          expect(res.locals.uid).to.be.equal(testToken.id);
          done();
        });
      });
    });

    describe('users accessing other data', () => {
      it('should not let a student access other data', (done) => {
        const testStudentToken = testTokens.testTokenStudent000;
        req.query.uid = 'notmyuid';
        req.query.token = testStudentToken.token;
        res.locals.auth.id = testStudentToken.id;
        res.locals.auth.role = 'student';

        authManager.validateUidPermissions(req, res, () => {
          expect(res.locals.err).to.be.an('error');
          expect(res.locals.err).to.equal(authErrors.unauthorizedError);
          done();
        });
      });
      it('should let an admin access other data', (done) => {
        const testStudentToken = testTokens.testTokenStudent000;
        const testAdminToken = testTokens.testTokenAdmin000;
        req.query.uid = testStudentToken.id;
        req.query.token = testAdminToken.token;
        res.locals.auth.id = testAdminToken.id;
        res.locals.auth.role = 'admin';

        authManager.validateUidPermissions(req, res, () => {
          expect(res.locals.err).to.not.be.an('error');
          expect(res.locals.uid).to.equal(testStudentToken.id);
          done();
        });
      });
    });
  });
});
