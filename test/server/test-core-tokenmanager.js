import * as tokenManager from 'server/core/tokenmanager';
import { testToken1 as testToken } from './core/tokens';

const expect = require('chai').expect;

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
      tokenManager.saveToken(testToken.token);
      expect(localStorage.getItem(tokenManager.tokenKey)).to.equal(testToken.token);
    });
  });

  describe('#getToken', () => {
    it('should return the saved token', () => {
      localStorage.setItem(tokenManager.tokenKey, testToken.token);
      expect(tokenManager.getToken()).to.equal(testToken.token);
    });
    it('should return null', () => {
      expect(tokenManager.getToken()).to.be.null;
    });
  });

  describe('#removeToken', () => {
    it('should remove the token', () => {
      localStorage.setItem(tokenManager.tokenKey, testToken.token);
      tokenManager.removeToken();
      expect(localStorage.getItem(tokenManager.tokenKey)).to.be.null;
    });
  });

  describe('#decode', () => {
    it('should decode the token', () => {
      const result = tokenManager.decode(testToken.token);
      expect(result.email).to.equal(testToken.email);
      expect(result.role).to.equal(testToken.role);
      expect(result.isApproved).to.equal(testToken.isApproved);
      expect(result.id).to.equal(testToken.id);
    });
  });
});
