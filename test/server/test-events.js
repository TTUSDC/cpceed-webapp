import sinon from 'sinon';
// import logger from 'logger/logger';
import * as tokenManager from 'server/core/tokenmanager';
import Connection from 'server/core/connection';
import { createEvent } from 'server/events';
import { user38257001 as testUser } from './core/users';
import { testToken1 as testToken } from './core/tokens';
import { generateEventData } from '../core/events';

const sinonChai = require('sinon-chai');
const chai = require('chai');

chai.use(sinonChai);
const expect = chai.expect;
const sandbox = sinon.sandbox.create();

export default describe('Server API: Events', () => {
  beforeEach(() => {
    sandbox.stub(Connection.prototype, 'call');
    sandbox.stub(tokenManager, 'getToken').callsFake(() => testToken.token);
    sandbox.spy(tokenManager, 'decode');
  });

  afterEach(() => {
    sandbox.restore();
  });

  describe('#createEvent', () => {
    it('should create a new event', (done) => {
      const expectedResult = { uid: '12345678' };

      Connection.prototype.call.callsFake((onSuccess) => {
        onSuccess(expectedResult);
      });

      const testEvent = generateEventData(testUser.uid);
      createEvent(testEvent).then((data) => {
        expect(Connection.prototype.call).to.have.been.calledOnce;
        expect(data).to.equal(expectedResult);
        done();
      });
    }).timeout(10000);
  });
  // describe('#modify(uid, updatedEvent)', () => {
  //   it('should modify an existing event.', (done) => {
  //     createEvent(testEvent).then((uid) => {
  //       createdEvents.push(uid);
  //       const updatedEvent = testEvent;
  //       updatedEvent.title = 'UPDATED EVENT';
  //       modifyEvent(uid, updatedEvent).then((updatedUid) => {
  //         expect(updatedUid).to.equal(uid);
  //         const eventRef = eventsRef.child(uid);
  //         eventRef.once('value').then((snapshot) => {
  //           const eventData = snapshot.val();
  //           expect(eventData).to.deep.equal(updatedEvent);
  //           done();
  //         });
  //       });
  //     }).catch((err) => { done(err); });
  //   }).timeout(10000);
  // });
  // describe('#remove(uid)', () => {
  //   it('should remove an existing event.', (done) => {
  //     createEvent(testEvent).then((uid) => {
  //       createdEvents.push(uid);
  //       removeEvent(uid).then(() => {
  //         const eventRef = eventsRef.child(uid);
  //         eventRef.once('value').then((snapshot) => {
  //           expect(snapshot.val()).to.be.null;
  //           done();
  //         });
  //       });
  //     }).catch((err) => { done(err); });
  //   });
  // });
  // describe('#getByUid(uid)', () => {
  //   it('should return an existing event by UID.', (done) => {
  //     createEvent(testEvent).then((uid) => {
  //       createdEvents.push(uid);
  //       getEventByUid(uid).then((receivedEvent) => {
  //         expect(receivedEvent).to.deep.equal(testEvent);
  //         done();
  //       });
  //     }).catch((err) => { done(err); });
  //   });
  // });
  // describe('#getAll()', () => {
  //   it('should return all existing events.', (done) => {
  //     createEvent(testEvent).then((uid) => {
  //       createEvent(testEvent).then((uid2) => {
  //         getAllEvents().then((events) => {
  //           expect(events).to.contain.all.keys([uid, uid2]);
  //           done();
  //         });
  //       });
  //     }).catch((err) => { done(err); });
  //   }).timeout(10000);
  // });
});
