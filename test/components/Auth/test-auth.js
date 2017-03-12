import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';

import Auth from 'components/Auth/Auth.js';

const authTest = () => {
  describe("Auth.js", () => {
    it("Changes tabs", () => {
      var authTest = shallow(<Auth />);
      authTest.instance().handleTabChange(1);
      expect(authTest.state().index).to.equal(1);
    });
  });
}

export default authTest;
