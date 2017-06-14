const mockgoose = require('mockgoose');
const mongoose = require('mongoose');
const request = require('supertest');
const chai = require('chai');
const sinon = require('sinon');
const importFresh = require('import-fresh');
const importClear = require('clear-module');
const utilsUser = require('../core/utils-user');
const testUsers = require('../../core/users');
const testEvents = require('../../core/events');
const eventManager = require('../../../api/events/event-manager');
const eventModels = require('../../../api/events/event-models');

chai.use(require('sinon-chai'));

const expect = chai.expect;
const Event = eventModels.Event;

let api;
mockgoose(mongoose);

describe('Event Router & Integration', () => {
  before(() => {
    // The following line is temp until API does not auto start during testing
    api = importFresh('../../../server'); // eslint-disable-line global-require
  });

  beforeEach((done) => {
    mockgoose.reset();
    done();
  });

  after((done) => {
    // api.close();
    // mongoose.disconnect();
    mongoose.unmock(done);
  });

  describe('POST /api/events', () => {
    before((done) => {
      sinon.spy(eventManager, 'createEvent');
      done();
    });

    afterEach((done) => {
      eventManager.createEvent.reset();
      done();
    });

    after((done) => {
      api.close();
      eventManager.createEvent.restore();
      importClear('../../../server');
      done();
    });

    it('should return 201 and the created event UID', (done) => {
      const testStudent = testUsers.student000;
      testStudent.email = 'something@else.com';
      utilsUser.createAndLoginStudent(api, testStudent, (userUid, token) => {
        const testEvent = testEvents.generateEventData(userUid);
        request(api)
          .post('/api/events')
          .send(testEvent)
          .type('form')
          .query({ userUid, token })
          .expect(201)
          .end((err, res) => {
            expect(err).to.be.null;
            const eventUid = res.body.uid;
            expect(eventUid).to.not.be.null;
            expect(eventManager.createEvent).to.have.been.calledOnce;
            Event.findById(eventUid, (findErr, foundEvent) => {
              expect(findErr).to.be.null;
              expect(foundEvent.creator).to.equal(testEvent.creator);
              done();
            });
          });
      });
    });
  });
});
