import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';

import Auth from 'components/Auth/Auth.js';

export default describe("Auth.js", () => {
  it("Changes tabs", () => {
    var authTest = shallow(<Auth />);
    authTest.instance().handleTabChange(1);
    expect(authTest.state().index).to.equal(1);
  });
});
