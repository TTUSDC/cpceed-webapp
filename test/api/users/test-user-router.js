const request = require('supertest');
const async = require('async');
const importFresh = require('import-fresh');
const utilsUser = require('../core/utils-user');
const testUsers = require('../../core/users');
const userManager = require('../../../api/users/user-manager');
const userModels = require('../../../api/users/user-models');

const Student = userModels.Student;

let api;
// const api = require('../../../server');

mockgoose(mongoose);

describe('User Router & Integration', () => {
  // before((done) => { mongoose.connect('', done); });

  before(() => {
    // The following line is temp until API does not auto start during testing
    api = importFresh('../../../server'); // eslint-disable-line global-require
  });

  beforeEach((done) => {
    mockgoose.reset();
    done();
  });

  after((done) => {
    api.close();
    mongoose.disconnect();
    mongoose.unmock(done);
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
          expect(foundStudent.email).to.equal(body.email);
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
          expect(returnedStudent.name).to.equal(fieldsToUpdate.name);
          expect(returnedStudent.email).to.equal(student.email);

          Student.findById(uid, (findErr, foundStudent) => {
            expect(findErr).to.be.null;
            expect(foundStudent).to.not.be.null;

            // Make sure the modified user was actually saved
            expect(foundStudent.name).to.equal(fieldsToUpdate.name);
            expect(foundStudent.email).to.equal(student.email);
            done();
          });
        });
      });
    });
  });
});
