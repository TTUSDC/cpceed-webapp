import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import sinon from 'sinon';

import Profile from 'routes/Settings/routes/Profile/components/Profile.jsx';

describe('Profile.jsx', () => {
  it('Handles input changes', () => {
    const wrapper = shallow(<Profile />);
    const event = {
      target: {
        value: 'temp',
        name: 'name',
      },
    };

    wrapper.instance().handleInputChange(event);
    expect(wrapper.state().name).to.equal('temp');
  });

  it('Calls handleSubmit when button is pressed', () => {
    const handleSubmit = sinon.spy();
    const wrapper = shallow(<Profile handleSubmit={handleSubmit} name="temp1" />);
    const event = {
      preventDefault: () => {},
    };

    wrapper.setState({
      name: 'temp2',
    });

    wrapper.find({ label: 'Change Information' }).simulate('click', event);
    expect(handleSubmit.calledOnce).to.equal(true);
  });

  it('Displays server errors', () => {
    const proErr = 'Message';
    const wrapper = shallow(<Profile proErr={proErr} />);

    expect(wrapper.contains(<span style={{ color: 'red' }}>{proErr}</span>))
      .to.equal(true);
  });

  it('Disables button while waiting for server', () => {
    const waiting = true;
    const handleSubmit = sinon.spy();
    const wrapper = shallow(
      <Profile
        handleSubmit={handleSubmit}
        waiting={waiting}
      />
    );

    wrapper.find({ label: 'Change Information' }).simulate('click');
    expect(handleSubmit.calledOnce).to.equal(false);
  });
});
