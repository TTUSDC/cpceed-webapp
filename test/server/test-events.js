import sinon from 'sinon';
import logger from 'logger/logger';
import * as tokenManager from 'server/core/tokenmanager';
import Connection from 'server/core/connection';
import {
  createEvent,
  modifyEvent,
  removeEvent,
  getEvent,
  getAllEvents,
} from 'server/events';
// import logger from 'logger.js';
import connectWithAuth from './core/utils';
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
      const testEvent = generateEventData(testUser.uid);

      const expectedResult = { uid: '12345678' };

      Connection.prototype.call.callsFake((onSuccess) => {
        onSuccess(expectedResult);
      });

      createEvent(testEvent).then((data) => {
        expect(Connection.prototype.call).to.have.been.calledOnce;
        const connectionCallData = Connection.prototype.call.thisValues[0];
        expect(connectionCallData.method).to.equal('post');
        expect(connectionCallData.url).to.equal('/events');
        expect(connectionCallData.config.data).to.deep.equal(testEvent);
        expect(data).to.equal(expectedResult);
        expect(connectionCallData.config.params.token).to.equal(testToken.token);
        done();
      });
    });
  });
  describe('#modifyEvent', () => {
    it('should modify an existing event.', (done) => {
      const testEvent = generateEventData(testUser.uid);
      const testEventUid = '123kl4j123srfa3';

      Connection.prototype.call.callsFake((onSuccess) => {
        onSuccess(testEvent);
      });

      modifyEvent(testEventUid, testEvent).then((data) => {
        expect(Connection.prototype.call).to.have.been.calledOnce;
        const connectionCallData = Connection.prototype.call.thisValues[0];
        expect(connectionCallData.method).to.equal('put');
        expect(connectionCallData.url).to.equal('/events');
        expect(connectionCallData.config.data).to.deep.equal(testEvent);
        expect(connectionCallData.config.params.token).to.equal(testToken.token);
        expect(connectionCallData.config.params.uid).to.equal(testEventUid);
        expect(data).to.equal(testEvent);
        done();
      });
    });
  });
  describe('#removeEvent', () => {
    it('should remove an existing event.', (done) => {
      const testEventUid = '123kl4j123srfa3';

      Connection.prototype.call.callsFake((onSuccess) => {
        onSuccess();
      });

      removeEvent(testEventUid).then(() => {
        expect(Connection.prototype.call).to.have.been.calledOnce;
        const connectionCallData = Connection.prototype.call.thisValues[0];
        expect(connectionCallData.method).to.equal('delete');
        expect(connectionCallData.url).to.equal('/events');
        expect(connectionCallData.config.params.uid).to.equal(testEventUid);
        expect(connectionCallData.config.params.token).to.equal(testToken.token);
        done();
      });
    });
  });
  describe('#getEvent', () => {
    it('should return an existing event by UID.', (done) => {
      const testEvent = generateEventData(testUser.uid);
      const testEventUid = '123kl4j123srfa3';

      Connection.prototype.call.callsFake((onSuccess) => {
        onSuccess(testEvent);
      });

      getEvent(testEventUid).then((data) => {
        expect(Connection.prototype.call).to.have.been.calledOnce;
        const connectionCallData = Connection.prototype.call.thisValues[0];
        expect(connectionCallData.method).to.equal('get');
        expect(connectionCallData.url).to.equal('/events');
        expect(connectionCallData.config.params.uid).to.equal(testEventUid);
        expect(connectionCallData.config.params.token).to.equal(testToken.token);
        expect(data).to.equal(testEvent);
        done();
      });
    });
  });
  describe('#getAllEvents', () => {
    it('should return all existing events.', (done) => {
      const testEvents = {
        id1: generateEventData(testUser.uid),
        id2: generateEventData(testUser.uid),
        id3: generateEventData(testUser.uid),
      };

      Connection.prototype.call.callsFake((onSuccess) => {
        onSuccess(testEvents);
      });

      getAllEvents().then((list) => {
        expect(Connection.prototype.call).to.have.been.calledOnce;
        const connectionCallData = Connection.prototype.call.thisValues[0];
        expect(connectionCallData.method).to.equal('get');
        expect(connectionCallData.url).to.equal('/events');
        expect(connectionCallData.endpoint).to.equal('all');
        expect(connectionCallData.config.params.token).to.equal(testToken.token);
        expect(list).to.deep.equal(testEvents);
        done();
      });
    });
  });
});
