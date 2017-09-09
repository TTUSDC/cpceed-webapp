import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import sinon from 'sinon';

import Profile from 'routes/Settings/routes/Profile/components/Profile.jsx';

describe('Profile.jsx', () => {
  let props;

  beforeEach(() => {
    props = {
      handleSubmit: () => {},
      name: '',
      proErr: '',
      waiting: false,
    };
  });

  it('Handles input changes', () => {
    const wrapper = shallow(<Profile {...props} />);
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
    props.handleSubmit = sinon.spy();
    props.name = 'temp1';
    const wrapper = shallow(<Profile {...props} />);
    const event = {
      preventDefault: () => {},
    };

    wrapper.setState({
      name: 'temp2',
    });

    wrapper.find({ label: 'Change Information' }).simulate('click', event);
    expect(props.handleSubmit.calledOnce).to.equal(true);
  });

  it('Displays server errors', () => {
    props.proErr = 'Message';
    const wrapper = shallow(<Profile {...props} />);

    expect(wrapper.contains(<span style={{ color: 'red' }}>{props.proErr}</span>))
      .to.equal(true);
  });

  it('Disables button while waiting for server', () => {
    props.waiting = true;
    props.handleSubmit = sinon.spy();
    const wrapper = shallow(<Profile {...props} />);

    wrapper.find({ label: 'Change Information' }).simulate('click');
    expect(props.handleSubmit.calledOnce).to.equal(false);
  });
});
