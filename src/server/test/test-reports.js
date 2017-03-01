var expect = require("chai").expect;
var dummyData = require('./dummy-data.js')

require('../server.js')

describe('reports', function(){
  describe('#create(newReport)', function(){
    it('should create a new event report.', function(done) {
      var newEventReport = {
        type: "event",
        student: "1234567",
        event: "9876543321"
      }
      var newEventUid = server.createReport(newEventReport);
      expect(dummyData.reports[newEventUid]).to.equal(newEventReport);
      done();
    })
  })
})
