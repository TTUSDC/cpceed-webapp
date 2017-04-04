import * as firebase from 'firebase';
import {
  create as createEvent,
  modify as modifyEvent,
  remove as removeEvent,
} from 'server/events';
import logger from 'logger/logger';
import connectWithAuth from './core/utils';

const expect = require('chai').expect;

export default describe('events', () => {
  const createdEvents = [];
  const testEvent = {
    datetime: '2017:05:20:09:00',
    location: 'United Supermarkets Arena',
    title: 'Graduation',
    description: 'TTU Commencement for the College of Engineering',
  };
  let eventsRef;
  before((done) => {
    connectWithAuth().then(() => {
      eventsRef = firebase.database().ref().child('events');
      done();
    }).catch((err) => {
      done(err);
    });
  });

  after((done) => {
    const removeEventPromises = [];
    createdEvents.forEach((eventUid) => {
      removeEventPromises.push(eventsRef.child(eventUid).remove());
    });

    Promise.all(removeEventPromises).then(() => {
      done();
    }).catch((err) => { done(err); });
  });
  describe('#create(newEvent)', () => {
    it('should create a new event.', (done) => {
      createEvent(testEvent).then((uid) => {
        createdEvents.push(uid);
        const eventRef = eventsRef.child(uid);
        eventRef.once('value').then((snapshot) => {
          const eventData = snapshot.val();
          expect(eventData).to.deep.equal(testEvent);
          done();
        }).catch((err) => { done(err); });
      });
    }).timeout(10000);
  });
  describe('#modify(uid, updatedEvent)', () => {
    it('should modify an existing event.', (done) => {
      createEvent(testEvent).then((uid) => {
        createdEvents.push(uid);
        const updatedEvent = testEvent;
        updatedEvent.title = 'UPDATED EVENT';
        modifyEvent(uid, updatedEvent).then((updatedUid) => {
          expect(updatedUid).to.equal(uid);
          const eventRef = eventsRef.child(uid);
          eventRef.once('value').then((snapshot) => {
            const eventData = snapshot.val();
            expect(eventData).to.deep.equal(updatedEvent);
            done();
          });
        });
      }).catch((err) => { done(err); });
    }).timeout(10000);
  });
  describe('#remove(uid)', () => {
    it('should remove an existing event.', (done) => {
      createEvent(testEvent).then((uid) => {
        removeEvent(uid).then(() => {
          const eventRef = eventsRef.child(uid);
          eventRef.once('value').then((snapshot) => {
            expect(snapshot.val()).to.be.null;
            done();
          });
        });
      }).catch((err) => { done(err); });
    });
  });
});
