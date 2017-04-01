const request = require('supertest');
const expect = require('chai').expect;
const mockery = require('mockery');

describe('Testing express server', () => {
  let server;
  beforeEach(() => { server = require('../src/server.js'); });

  afterEach(() => { server.close(); });

  describe('/endpoint VERB', () => {
    it('should do something', (done) => {
      // Test here
      const value = true;
      expect(value).to.be.true;
      done();
    });
  });
});
