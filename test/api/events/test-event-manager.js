const async = require('async');
const eventManager = require('../../../api/events/event-manager');
const eventModels = require('../../../common/models/event-models');

const Event = eventModels.Event;

mockgoose(mongoose);

describe('eventManager', () => {
  // Helper method to get an object for event test
  const getDefaultTestData = (seed) => {
    const datetime = '2017-04-19T20:34:00.000Z';
    const obj = {
      creator: `creatoruid123${seed}`,
      category: `eventcategory${seed}`,
      location: `ECE 204${seed}`,
      title: `Awesome Event${seed}`,
      description: `This event has an awesome description${seed}`,
      datetime,
    };
    const event = new Event(obj);
    delete obj.datetime;
    const defaultTestData = { obj, datetime, event };
    return defaultTestData;
  };


  before((done) => {
    mongoose.connect('', done);
  });

  beforeEach((done) => {
    mockgoose.reset();
    done();
  });

  after((done) => { mongoose.unmock(done); });

  describe('#createEvent', () => {
    it('should pass a created and saved event to the callback', (done) => {
      const testData = getDefaultTestData();
      const testEvent = testData.obj;
      testEvent.datetime = testData.datetime;

      eventManager.createEvent(testEvent, {}, (createErr, createdEvent) => {
        // The next line is to handle the fact that datetimes when equivalent don't
        // mean equal when compared.
        delete testEvent.datetime;
        expect(createErr).to.be.null;
        expect(createdEvent).to.not.be.null;
        expect(createdEvent.datetime).to.be.sameMoment(testData.datetime);
        expect(createdEvent).to.shallowDeepEqual(testEvent);

        Event.findById(createdEvent.id, (findErr, foundEvent) => {
          expect(findErr).to.be.null;
          expect(foundEvent).to.not.be.null;
          expect(foundEvent.datetime).to.be.sameMoment(testData.datetime);
          expect(foundEvent).to.shallowDeepEqual(testEvent);
          done();
        });
      });
    });
  });

  describe('#modifyEvent', () => {
    it('should pass a modified and saved event to the callback', (done) => {
      const testData = getDefaultTestData();
      const originalEvent = testData.event;
      const updatedEvent = {
        creator: 'updatedCreatorId',
        category: 'eventcategoryish',
        datetime: '2017-05-19T20:34:00.000Z',
        location: 'ECE 204',
        title: 'Not Awesome Event',
        description: 'This event had an awesome description',
      };
      const testDatetime = updatedEvent.datetime;
      originalEvent.save((saveErr, createdEvent) => {
        expect(saveErr).to.be.null;
        expect(createdEvent).to.not.be.null;

        eventManager.modifyEvent(createdEvent.id, updatedEvent, {},
          (modifyErr, realUpdatedEvent) => {
            // The next line is to handle the fact that datetimes when
            // equivalent don't mean equal when compared.
            delete updatedEvent.datetime;
            expect(modifyErr).to.be.null;
            expect(realUpdatedEvent).to.not.be.null;
            expect(realUpdatedEvent.datetime)
              .to.be.sameMoment(testDatetime);
            expect(realUpdatedEvent).to.shallowDeepEqual(updatedEvent);

            Event.findById(realUpdatedEvent.id, (findErr, foundEvent) => {
              expect(findErr).to.be.null;
              expect(foundEvent).to.not.be.null;
              expect(foundEvent.datetime).to.be.sameMoment(testDatetime);
              expect(foundEvent).to.shallowDeepEqual(updatedEvent);
              done();
            });
          });
      });
    });
  });

  describe('#deleteEvent', () => {
    it('should delete a saved event', (done) => {
      const testData = getDefaultTestData();

      testData.event.save((saveErr, createdEvent) => {
        expect(saveErr).to.be.null;
        expect(createdEvent).to.not.be.null;

        eventManager.deleteEvent(createdEvent.id, {}, (err, deletedEvent) => {
          expect(err).to.be.null;
          expect(deletedEvent).to.not.be.null;
          expect(deletedEvent.datetime).to.be.sameMoment(testData.datetime);
          expect(deletedEvent).to.shallowDeepEqual(testData.obj);

          Event.findById(createdEvent.id, {}, (foundErr, foundEvent) => {
            expect(foundEvent).to.be.null;
            done(err);
          });
        });
      });
    });
  });

  describe('#getEventById', () => {
    it('should pass the event with the given id to the callback', (done) => {
      const testData = getDefaultTestData();

      testData.event.save((saveErr, createdEvent) => {
        expect(saveErr).to.be.null;
        expect(createdEvent).to.exist;

        eventManager.getEventById(createdEvent.id, {},
          (getErr, foundEvent) => {
            expect(getErr).to.be.null;
            expect(foundEvent).to.exist;
            expect(foundEvent.datetime).to.be.sameMoment(testData.datetime);
            expect(foundEvent).to.shallowDeepEqual(testData.obj);
            done();
          });
      });
    });
  });

  describe('#getAllEvents', () => {
    it('should pass an object of all events to the callback', (done) => {
      const testDataList = [
        getDefaultTestData(1),
        getDefaultTestData(2),
        getDefaultTestData(3),
      ];
      const savedItemsList = [];

      const saveIteratee = (testData, saveCb) => {
        testData.event.save((saveErr, savedEvent) => {
          expect(saveErr).to.be.null;
          expect(savedEvent).to.exist;
          const savedItem = testData;
          savedItem.savedEvent = savedEvent;
          savedItem.id = savedEvent.id;
          savedItemsList.push(savedItem);
          saveCb();
        });
      };

      async.each(testDataList, saveIteratee, (asyncSaveErr) => {
        expect(asyncSaveErr).to.be.null;

        eventManager.getAllEvents({}, {}, (getErr, events) => {
          expect(getErr).to.be.null;
          expect(events).to.exist;

          const getIteratee = (savedItem, cb) => {
            it(`should have returned event with id: ${savedItem.id}`,
            (innerDone) => {
              const event = events[savedItem.id];
              expect(event).to.exist;
              expect(event.datetime).to.be.sameMoment(savedItem.datetime);
              expect(event).to.shallowDeepEqual(savedItem.obj);
              innerDone();
            });
            cb();
          };

          describe('eventManager', () => {
            describe('#getAllEvents', () => {
              async.each(savedItemsList, getIteratee, (err) => {
                done(err);
              });
            });
          });
        });
      });
    });
  });
});
