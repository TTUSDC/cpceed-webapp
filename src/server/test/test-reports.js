var expect = require("chai").expect;

require('../server.js')

describe('reports', function(){
  describe('#createReport(newReport)', function(){
    it('should create a new event report.', function(done) {
      var newEventReport = {
        type: "event",
        student: "1234567",
        event: "9876543321"
      }
      server.createReport(newEventReport).then(function(uid) {
        expect(server.dummyData.reports[uid]).to.equal(newEventReport);
        done();
      }).catch(function(reason){
        done(reason)
      })

    })
  })
})
