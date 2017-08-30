const request = require('supertest');

const utilsUser = require('test/api/core/utils-user.js');
const utilsAuth = require('test/api/core/utils-auth.js');
const testUsers = require('test/core/users.js');
const connection = require('api/connection.js');
const app = require('api/app.js');

describe('Auth Router & Integration', () => {
  before((done) => {
    connection.open().then(() => done()).catch(done);
  });

  beforeEach((done) => {
    mockgoose.reset();
    done();
  });

  after((done) => {
    connection.close().then(() => done()).catch(done);
  });

  describe('POST /api/auth', () => {
    it('should return 201', (done) => {
      const testStudent = testUsers.student000;

      utilsUser.createAndLoginUser(app, testStudent, () => {
        done();
      });
    });
  });

  describe('DELETE /api/auth', () => {
    it('should return 204 when authorized', (done) => {
      const testStudent = testUsers.student000;

      utilsUser.createAndLoginUser(app, testStudent, (uid, agent) => {
        agent
          .delete('/api/auth')
          .expect(204)
          .end(done);
      });
    });

    it('should return 400 when unauthorized', (done) => {
      request(app)
        .delete('/api/auth')
        .expect(400)
        .end(done);
    });
  });

  describe('PUT /api/auth/password', () => {
    const testStudent = testUsers.student000;

    it('should return 200 when authorized', (done) => {
      utilsUser.createAndLoginUser(app, testStudent, (uid, agent) => {
        agent
          .put('/api/auth/password')
          .send({
            email: testStudent.email,
            password: testStudent.password,
            newPassword: 'T0t@llyS3cure',
          })
          .type('form')
          .expect(200)
          .end(done);
      });
    });

    it('should return 400 when unauthorized', (done) => {
      request(app)
        .put('/api/auth/password')
        .send({
          email: testStudent.email,
          password: testStudent.password,
          newPassword: 'T0t@llyS3cure',
        })
        .type('form')
        .expect(400)
        .end(done);
    });
  });

  describe('PUT /api/auth/email', () => {
    const testStudent = testUsers.student000;

    it('should return 200 when authorized', (done) => {
      utilsUser.createAndLoginUser(app, testStudent, (uid, agent) => {
        agent
          .put('/api/auth/email')
          .send({
            email: testStudent.email,
            password: testStudent.password,
            newEmail: 'admin000@ttu.edu',
          })
          .type('form')
          .expect(200)
          .end(done);
      });
    });

    it('should return 400 when unauthorized', (done) => {
      request(app)
        .put('/api/auth/email')
        .send({
          email: testStudent.email,
          password: testStudent.password,
          newEmail: 'admin000@ttu.edu',
        })
        .type('form')
        .expect(400)
        .end(done);
    });

    it('should delete user\'s existing sessions', (done) => {
      utilsUser.createAndLoginUser(app, testStudent, (uid, agent) => {
        utilsAuth.userHasSessions(testStudent.email)
          .then((sessions) => {
            expect(sessions).to.be.true;

            return agent
              .put('/api/auth/email')
              .send({
                email: testStudent.email,
                password: testStudent.password,
                newEmail: 'admin000@ttu.edu',
              })
              .type('form')
              .expect(200);
          })
          .then(() => utilsAuth.userHasSessions(testStudent.email))
          .then((sessions) => {
            expect(sessions).to.be.false;
            done();
          })
          .catch(done);
      });
    });
  });
});
