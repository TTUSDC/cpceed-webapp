var expect = require("chai").expect;

require('../../src/server/server.js')

describe('events', function() {
  var testEvent = {
    "datetime": "2017:05:20:09:00",
    "location": "United Supermarkets Arena",
    "title": "Graduation",
    "description": "TTU Commencement for the College of Engineering"
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
  }),

  describe('#modifyEvent(uid, updatedEvent)', function(){
    it('should modify a created event.', function(done){
      expect(testEventUid).to.not.be.undefined;
      testEvent.title = "Commencement";
      server.modifyEvent(testEventUid, testEvent).then(function(){
        expect(server.dummyData.events[testEventUid]).to.equal(testEvent);
        done();
      }).catch(function(reason){
        done(reason);
      })
    })
  }),

  describe('#getEventByUid(uid)', function(){
    it('should return the created event.', function(done){
      expect(testEventUid).to.not.be.undefined;
      server.getEventByUid(testEventUid).then(function(event){
        expect(event).to.be.equal(server.dummyData.events[testEventUid])
        done();
      }).catch(function(reason){
        done(reason);
      })
    })
  }),

  describe('#getAllEvents()', function(){
    it('should return all events.', function(done){
      server.getAllEvents().then(function(events){
        expect(events).to.equal(server.dummyData.events);
        done();
      }).catch(function(reason){
        done(reason)
      })
    })
  })

  describe('#deleteEvent(uid)', function(){
    it('should delete the created event.', function(done){
      expect(testEventUid).to.not.be.undefined;
      server.deleteEvent(testEventUid).then(function(){
        expect(server.dummyData.events[testEventUid]).to.be.undefined;
        done();
      }).catch(function(reason){
        done(reason);
      })
    })
  })
})
