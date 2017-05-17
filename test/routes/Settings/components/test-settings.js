import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import sinon from 'sinon';

import { Settings } from 'routes/Settings/components/Settings.js';

export default describe("Settings.js", () => {
  it("Pushes to the router", () => {
    const push = sinon.spy();
    const router = {
      push: push
    };

    const wrapper = shallow(<Settings router={router} />);

    wrapper.find({label: 'Profile'}).simulate('click');
    expect(push.calledOnce).to.equal(true);
  });
});
