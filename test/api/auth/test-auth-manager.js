const authManager = require('api/auth/auth-manager');

describe('authManager', () => {
  describe('#verify', () => {
    it('should verify the session', (done) => {
      const req = { user: {} };
      const res = {};
      const next = sinon.spy();

      authManager.verify(req, res, next);

      expect(next).to.have.been.calledOnce;
      done();
    });
  });
});
