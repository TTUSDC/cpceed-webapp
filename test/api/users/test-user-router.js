const mockgoose = require('mockgoose');
const mongoose = require('mongoose');
const request = require('supertest');
const chai = require('chai');
const sinon = require('sinon');
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
    beforeEach((done) => {
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
      .post('/api/users')
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
  });
});
