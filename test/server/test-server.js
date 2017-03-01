var expect = require("chai").expect;
var dummyData = require('./dummy-data.js')


require('../../src/server/server.js')

describe('server', function() {
  describe('#login(email, password)', function() {
    it('should login as an admin.', function(done) {
        var admin = dummyData.users["QveDEhTHWSgVbnL4NXrdD6rSvns1"];
        server.login(admin.email, dummyData.auth[admin.email]).then(function(data) {
          expect(data).to.equal(admin);
          done();
        }).catch(function(reason) {
          done(reason);
        })
      }),
      it('should fail logging in as admin.', function(done) {
        server.login("patty.lastname@ttu.edu", "invalidpassword")
          .then(function(data) {
            done("Should not have logged in");
          },function(reason) {
            expect(reason).to.equal(server.errorMessages.invalidLogin)
            done();
          }).catch(function(reason) {
            done(reason);
          })
      })
  }),
  describe('#getLoggedInUser()', function(){
    var user = dummyData.users["hMXRXnHKQdbGmX9bwaZntRaJER03"];
    it('should logout user to and then return null since no user is logged in.', function(done){
      server.logout();
      var loggedInUser = server.getLoggedInUser();
      expect(loggedInUser).to.be.null;
      done();
    }),
    it('should get logged in user.', function(done){
      server.login(user.email, dummyData.auth[user.email]).then(function(data) {
        var loggedInUser = server.getLoggedInUser();
        expect(loggedInUser).to.equal(user);
        done();
      }).catch(function(reason) {
        done(reason);
      })
    })
  })
})
