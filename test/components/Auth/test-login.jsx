import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import sinon from 'sinon';

import Login from 'components/Auth/Login.jsx';

describe('Login.jsx', () => {
  let props;

  beforeEach(() => {
    props = {
      handleLogin: () => {},
      logErr: '',
      waiting: false,
    };
  });

  it('Handles input changes', () => {
    const wrapper = shallow(<Login {...props} />);
    const event = {
      target: {
        value: 'test@ttu.edu',
        name: 'email',
      },
    };

    wrapper.instance().handleInputChange(event);
    expect(wrapper.state().email).to.equal('test@ttu.edu');
  });

  it('Displays server errors', () => {
    props.logErr = 'Message';
    const wrapper = shallow(<Login {...props} />);

    expect(wrapper.contains(
      <span style={{ color: 'red' }}>{props.logErr}</span>),
    ).to.equal(true);
  });

  it('Disables submit while waiting for server', () => {
    props.handleLogin = sinon.spy();
    props.waiting = true;
    const wrapper = shallow(<Login {...props} />);

    wrapper.find({ label: 'Login' }).simulate('click');
    expect(props.handleLogin.calledOnce).to.equal(false);
  });

  it('Calls handleLogin when submit is pressed', () => {
    props.handleLogin = sinon.spy();
    const wrapper = shallow(<Login {...props} />);
    const event = {
      preventDefault: () => {},
    };

    wrapper.find({ label: 'Login' }).simulate('click', event);
    expect(props.handleLogin.calledOnce).to.equal(true);
  });
});
