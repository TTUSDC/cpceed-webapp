import sinon from 'sinon';

import Connection from 'server/core/connection';
import {
  createReport,
  modifyReport,
  removeReport,
  getReport,
  getAllReports,
} from 'server/reports';
import { user38257001 as testUser } from './core/users';
import { generateOtherReportData } from '../core/reports';

const sinonChai = require('sinon-chai');
const chai = require('chai');

chai.use(sinonChai);
const expect = chai.expect;
const sandbox = sinon.sandbox.create();

export default describe('Server API: Reports', () => {
  beforeEach(() => {
    sandbox.stub(Connection.prototype, 'call');
  });

  afterEach(() => {
    sandbox.restore();
  });

  describe('#createReport', () => {
    it('should create a new report', (done) => {
      const testReport = generateOtherReportData(testUser.uid);

      const expectedResult = { uid: '12345678' };

      Connection.prototype.call.callsFake((onSuccess) => {
        onSuccess(expectedResult);
      });

      createReport(testReport).then((data) => {
        expect(Connection.prototype.call).to.have.been.calledOnce;
        const connectionCallData = Connection.prototype.call.thisValues[0];
        expect(connectionCallData.method).to.equal('post');
        expect(connectionCallData.url).to.equal('/reports');
        expect(connectionCallData.config.data).to.deep.equal(testReport);
        expect(data).to.equal(expectedResult);
        done();
      }).catch(done);
    });
  });
  describe('#modifyReport', () => {
    it('should modify an existing report.', (done) => {
      const testReport = generateOtherReportData(testUser.uid);
      const testReportUid = '123kl4j123srfa3';

      Connection.prototype.call.callsFake((onSuccess) => {
        onSuccess(testReport);
      });

      modifyReport(testReportUid, testReport).then((data) => {
        expect(Connection.prototype.call).to.have.been.calledOnce;
        const connectionCallData = Connection.prototype.call.thisValues[0];
        expect(connectionCallData.method).to.equal('put');
        expect(connectionCallData.url).to.equal('/reports');
        expect(connectionCallData.config.data).to.deep.equal(testReport);
        expect(connectionCallData.config.params.uid).to.equal(testReportUid);
        expect(data).to.equal(testReport);
        done();
      }).catch(done);
    });
  });
  describe('#removeReport', () => {
    it('should remove an existing report.', (done) => {
      const testReportUid = '123kl4j123srfa3';

      Connection.prototype.call.callsFake((onSuccess) => {
        onSuccess();
      });

      removeReport(testReportUid).then(() => {
        expect(Connection.prototype.call).to.have.been.calledOnce;
        const connectionCallData = Connection.prototype.call.thisValues[0];
        expect(connectionCallData.method).to.equal('delete');
        expect(connectionCallData.url).to.equal('/reports');
        expect(connectionCallData.config.params.uid).to.equal(testReportUid);
        done();
      }).catch(done);
    });
  });
  describe('#getReport', () => {
    it('should return an existing report by UID.', (done) => {
      const testReport = generateOtherReportData(testUser.uid);
      const testReportUid = '123kl4j123srfa3';

      Connection.prototype.call.callsFake((onSuccess) => {
        onSuccess(testReport);
      });

      getReport(testReportUid).then((data) => {
        expect(Connection.prototype.call).to.have.been.calledOnce;
        const connectionCallData = Connection.prototype.call.thisValues[0];
        expect(connectionCallData.method).to.equal('get');
        expect(connectionCallData.url).to.equal('/reports');
        expect(connectionCallData.config.params.uid).to.equal(testReportUid);
        expect(data).to.equal(testReport);
        done();
      }).catch(done);
    });
  });
  describe('#getAllReports', () => {
    it('should return all existing reports.', (done) => {
      const testReports = {
        id1: generateOtherReportData(testUser.uid),
        id2: generateOtherReportData(testUser.uid),
        id3: generateOtherReportData(testUser.uid),
      };

      Connection.prototype.call.callsFake((onSuccess) => {
        onSuccess(testReports);
      });

      getAllReports().then((list) => {
        expect(Connection.prototype.call).to.have.been.calledOnce;
        const connectionCallData = Connection.prototype.call.thisValues[0];
        expect(connectionCallData.method).to.equal('get');
        expect(connectionCallData.url).to.equal('/reports');
        expect(connectionCallData.endpoint).to.equal('all');
        expect(list).to.deep.equal(testReports);
        done();
      }).catch(done);
    });
  });
});
