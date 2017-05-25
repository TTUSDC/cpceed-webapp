import * as tokenManager from 'server/core/tokenmanager';

const expect = require('chai').expect;

const testToken = 'eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImFsZXhhbmRlckBjbGluZXMuY29tIiwicm9sZSI6IlN0dWRlbnQiLCJpc0FwcHJvdmVkIjpmYWxzZSwiaWF0IjoxNDk1NjYyNzY4fQ.SQToghIxuiszjQ0kB0L5WAKfvlMrRK4lkuLeT08Y9QMJDAvqaiGGVq4dzlqL1oXedHWt_-xihReyChbABiFskQ';

export default describe('Server API: Core/tokenmanager', () => {
  beforeEach(() => {
    localStorage.removeItem(tokenManager.tokenKey);
  });

  describe('initial state', () => {
    it('should not have a sessiontoken in localstorage', () => {
      expect(localStorage.getItem(tokenManager.tokenKey)).to.be.null;
    });
  });

  describe('#saveToken', () => {
    it('should save the sessiontoken in localstorage', () => {
      tokenManager.saveToken(testToken);
      expect(localStorage.getItem(tokenManager.tokenKey)).to.equal(testToken);
    });
  });

  describe('#getToken', () => {
    it('should return the saved token', () => {
      localStorage.setItem(tokenManager.tokenKey, testToken);
      expect(tokenManager.getToken()).to.equal(testToken);
    });
    it('should return null', () => {
      expect(tokenManager.getToken()).to.be.null;
    });
  });

  describe('#decode', () => {
    it('should decode the token', () => {
      const result = tokenManager.decode(testToken);
      expect(result.email).to.equal('alexander@clines.com');
      expect(result.role).to.equal('Student');
      expect(result.isApproved).to.be.false;
    });
  });
});
