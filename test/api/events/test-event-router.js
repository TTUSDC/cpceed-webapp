const request = require('supertest');
const importFresh = require('import-fresh');
const importClear = require('clear-module');
const utilsUser = require('../core/utils-user');
const utilsEvents = require('../core/utils-events');
const testUsers = require('../../core/users');
const testEvents = require('../../core/events');
const eventManager = require('../../../api/events/event-manager');
const eventModels = require('../../../api/events/event-models');

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
    api.close();
    // mongoose.disconnect();
    mongoose.unmock(done);
    importClear('../../../server');
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
      eventManager.createEvent.restore();
      done();
    });

    it('should return 201 and the created event UID', (done) => {
      const testStudent = testUsers.student000;
      utilsUser.createAndLoginUser(api, testStudent, (userUid, token) => {
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

  describe('GET /api/events', () => {
    it('should return the correct event', (done) => {
      const admin = testUsers.admin000;
      utilsUser.createAndLoginUser(api, admin, (userUid, token) => {
        const testEvent = testEvents.generateEventData(userUid);
        utilsEvents.createEvent(api, { token, uid: userUid }, testEvent,
          (eventUid) => {
            request(api)
            .get('/api/events')
            .query({ uid: eventUid })
            .expect(200)
            .end((getErr, getRes) => {
              expect(getErr).to.be.null;
              const returnedEvent = getRes.body;
              expect(returnedEvent).to.not.be.null;
              expect(returnedEvent.location).to.equal(testEvent.location);
              done();
            });
          });
      });
    });
  });

  describe('PUT /api/users', () => {
    it('should update the created event', (done) => {
      const admin = testUsers.admin000;
      utilsUser.createAndLoginUser(api, admin, (userUid, token) => {
        const testEvent = testEvents.generateEventData(userUid);
        utilsEvents.createEvent(api, { token, uid: userUid }, testEvent,
          (eventUid) => {
            const fieldsToUpdate = {
              location: `${testEvent.location}_edit`,
            };
            request(api)
              .put('/api/events')
              .expect(200)
              .query({ token, uid: eventUid })
              .send(fieldsToUpdate)
              .end((putErr, putRes) => {
                expect(putErr).to.be.null;
                expect(putRes).to.not.be.null;
                const returnedEvent = putRes.body;
                expect(returnedEvent).to.not.be.null;
                expect(returnedEvent.location).to.equal(fieldsToUpdate.location);
                expect(returnedEvent.title).to.equal(testEvent.title);

                Event.findById(eventUid, (findErr, foundEvent) => {
                  expect(findErr).to.be.null;
                  expect(foundEvent).to.not.be.null;

                  // Make sure the modified event was actually saved
                  expect(foundEvent.location).to.equal(fieldsToUpdate.location);
                  expect(foundEvent.title).to.equal(testEvent.title);
                  done();
                });
              });
          });
      });
    });
  });
});
