import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';

import Auth from 'components/Auth/Auth.jsx';

export default describe('Auth.jsx', () => {
  it('Changes tabs', () => {
    const authTest = shallow(<Auth authCancelled={() => {}} />);
    authTest.instance().handleTabChange(1);
    expect(authTest.state().index).to.equal(1);
  });
});
