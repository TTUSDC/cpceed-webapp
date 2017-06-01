import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import sinon from 'sinon';

import { Settings } from 'routes/Settings/components/Settings.jsx';

export default describe('Settings.jsx', () => {
  it('Pushes to the router', () => {
    const push = sinon.spy();
    const history = {
      push,
    };

    const wrapper = shallow(<Settings history={history} />);

    wrapper.find({ label: 'Profile' }).simulate('click');
    expect(push.calledOnce).to.equal(true);
  });
});
