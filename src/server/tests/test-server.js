var expect = require("chai").expect;

require('../server.js')

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
  })
})
