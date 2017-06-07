const mockgoose = require('mockgoose');
const mongoose = require('mongoose');
const request = require('supertest');
const chai = require('chai');
const sinon = require('sinon');
const async = require('async');
const testUsers = require('../../core/users');
const userManager = require('../../../api/users/user-manager');
const userModels = require('../../../api/users/user-models');

chai.use(require('sinon-chai'));

const expect = chai.expect;
const Student = userModels.Student;

let api;
// const api = require('../../../server');

mockgoose(mongoose);

describe('user router & integration', () => {
  // before((done) => { mongoose.connect('', done); });

  before(() => {
    // The following line is temp until API does not auto start during testing
    api = require('../../../server'); // eslint-disable-line global-require
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
    const endpoint = '/api/users';
    it('should create, login, and get the student', (done) => {
      const student = testUsers.student000;

      const getUserTest = (uid, token) => {
        request(api)
        .get(endpoint)
        .query({
          uid,
          token,
        })
        .expect(200)
        .end((getErr, getRes) => {
          expect(getErr).to.be.null;
          const returnedStudent = getRes.body;
          expect(returnedStudent.uid).to.equal(uid);
          expect(returnedStudent.email).to.equal(student.email);
          done(getErr);
        });
      };

      const loginUserTest = (uid) => {
        request(api)
      .post('/api/auth')
      .send({
        email: student.email,
        password: student.password,
      })
      .type('form')
      .expect(201)
      .end((loginErr, loginRes) => {
        expect(loginErr).to.be.null;
        const token = loginRes.body.token;
        expect(token).to.exist;
        getUserTest(uid, token);
      });
      };

      request(api)
    .post(endpoint)
    .send(student)
    .type('form')
    .expect(201)
    .end((createErr, createRes) => {
      expect(createErr).to.be.null;
      const uid = createRes.body.uid;
      expect(uid).to.not.be.null;
      loginUserTest(uid);
    });
    });
  });
});
