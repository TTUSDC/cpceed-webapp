const request = require('supertest');
const async = require('async');
const utilsUser = require('../core/utils-user');
const testUsers = require('../../core/users');
const userManager = require('../../../api/users/user-manager');
const userModels = require('../../../common/models/users');
const compareHelper = require('../core/helper-compare');
const server = require('../../../server');

const Student = userModels.Student;

let api;

mockgoose(mongoose);

describe('User Router & Integration', () => {
  before((done) => { api = server.start(done); });

  beforeEach((done) => {
    mockgoose.reset();
    done();
  });

  after((done) => {
    server.stop(() => {
      mongoose.unmock(done);
    });
  });

  describe('POST /api/users', () => {
    const endpoint = '/api/users';
    before((done) => {
      sinon.spy(userManager, 'createUser');
      done();
    });

    afterEach((done) => {
      userManager.createUser.reset();
      done();
    });

    after((done) => {
      userManager.createUser.restore();
      done();
    });

    it('should return 201 and the created student UID', (done) => {
      const body = testUsers.student000;
      request(api)
      .post(endpoint)
      .send(body)
      .type('form')
      .expect(201)
      .end((err, res) => {
        expect(err).to.be.null;
        const uid = res.body.uid;
        expect(uid).to.not.be.null;
        expect(userManager.createUser).to.have.been.calledOnce;
        expect(userManager.createUser.args[0][0].email).to.equal(body.email);
        Student.findById(uid, (findErr, foundStudent) => {
          expect(findErr).to.be.null;
          compareHelper.compareStudentInfo(body, foundStudent);
          done();
        });
      });
    });

    const requiredKeys = ['email', 'password', 'role'];
    const createIteratee = (key, createCb) => {
      const originalStudent = testUsers.student000;
      const student = JSON.parse(JSON.stringify(originalStudent)); // For object copying
      delete student[key];
      it(`should have returned an error for missing key: ${key}`, (innerDone) => {
        request(api)
          .post(endpoint)
          .send(student)
          .type('form')
          .expect(400, innerDone);
      });
      createCb();
    };


    async.each(requiredKeys, createIteratee, (asyncCreateErr) => {
      expect(asyncCreateErr).to.be.null;
    });
  });

  describe('GET /api/users', () => {
    const getUserTest = (student, query, done) => {
      request(api)
        .get('/api/users')
        .query(query)
        .expect(200)
        .end((getErr, getRes) => {
          expect(getErr).to.be.null;
          const returnedStudent = getRes.body;
          expect(returnedStudent.email).to.equal(student.email);
          compareHelper.compareStudentInfo(student, returnedStudent);

          done(getErr);
        });
    };

    it('should get the logged in student by passing the UID', (done) => {
      const student = testUsers.student000;
      utilsUser.createAndLoginUser(api, student, (uid, token) => {
        getUserTest(student, { uid, token }, done);
      });
    });

    it('should get the logged in student WITHOUT passing the UID', (done) => {
      const student = testUsers.student000;
      utilsUser.createAndLoginUser(api, student, (uid, token) => {
        getUserTest(student, { token }, done);
      });
    });
  });

  describe('PUT /api/users', () => {
    it('should update the logged in student', (done) => {
      const student = testUsers.student000;
      utilsUser.createAndLoginUser(api, student, (uid, token) => {
        const fieldsToUpdate = {
          name: `${student.name}_edit`,
        };

        const expectedStudent = JSON.parse(JSON.stringify(student));
        expectedStudent.name = fieldsToUpdate.name;

        request(api)
        .put('/api/users')
        .expect(200)
        .query({ token })
        .send(fieldsToUpdate)
        .end((putErr, putRes) => {
          expect(putErr).to.be.null;
          expect(putRes).to.not.be.null;
          const returnedStudent = putRes.body;

          // Make sure the modified user was returned
          compareHelper.compareStudentInfo(expectedStudent, returnedStudent);

          Student.findById(uid, (findErr, foundStudent) => {
            expect(findErr).to.be.null;
            expect(foundStudent).to.not.be.null;

            // Make sure the modified user was actually saved
            compareHelper.compareStudentInfo(expectedStudent, foundStudent);

            done();
          });
        });
      });
    });
  });
});
