var expect = require("chai").expect;

require('../../src/server/server.js')

describe('events', function() {
  var testEvent = {
    "datetime": "2017:05:20:09:00",
    "location": "United Supermarkets Arena",
    "title": "Graduation",
    "description": "TTU Commencemnt for the College of Engineering"
  }

  var testEventUid = undefined;

  describe('#createEvent(newEvent)', function(){
    it('should create a new event.', function(done){
      server.createEvent(testEvent).then(function(uid){
        expect(server.dummyData.events[uid]).to.equal(testEvent);
        testEventUid = uid;
        done();
      }).catch(function(reason){
        done(reason)
      })
    })
  })
})
