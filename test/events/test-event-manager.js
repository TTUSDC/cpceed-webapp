const mockgoose = require('mockgoose');
const mongoose = require('mongoose');
const chai = require('chai');
const eventManager = require('../../src/events/event-manager');
const eventModels = require('../../src/events/event-models');

chai.use(require('chai-shallow-deep-equal'));
chai.use(require('chai-moment'));

const expect = chai.expect;
const Event = eventModels.Event;

mockgoose(mongoose);

describe('eventManager', () => {
  before((done) => { mongoose.connect('', done); });

  beforeEach((done) => {
    mockgoose.reset();
    done();
  });

  after((done) => { mongoose.unmock(done); });

  describe('#createEvent', () => {
    it('should pass a created event to the callback', (done) => {
      const testEvent = {
        creator: 'creatoruid123',
        category: 'eventcategory',
        datetime: 'Apr 19 2017 15:34',
        location: 'ECE 204',
        title: 'Awesome Event',
        description: 'This event has an awesome description',
      };
      const testDatetime = testEvent.datetime;
      eventManager.createEvent(testEvent, {}, (createErr, createdEvent) => {
        expect(createErr).to.be.null;
        expect(createdEvent).to.not.be.null;
        expect(createdEvent.datetime).to.be.sameMoment(testEvent.datetime);

        // The next line is to handle the fact that datetimes when equivalent don't
        // mean equal when compared.
        delete testEvent.datetime;
        expect(createdEvent).to.shallowDeepEqual(testEvent);
        Event.findById(createdEvent.id, (findErr, foundEvent) => {
          expect(findErr).to.be.null;
          expect(foundEvent).to.not.be.null;
          expect(foundEvent.datetime).to.be.sameMoment(testDatetime);
          expect(foundEvent).to.shallowDeepEqual(testEvent);
          done();
        });
      });
    });
  });
});
