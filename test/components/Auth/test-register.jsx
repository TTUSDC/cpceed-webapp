import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import sinon from 'sinon';

import Register from 'components/Auth/Register.jsx';

export default describe('Register.jsx', () => {
  let props;

  beforeEach(() => {
    props = {
      handleRegister: () => {},
      regErr: '',
      waiting: false,
    };
  });

  it('Handles password changes', () => {
    const wrapper = shallow(<Register {...props} />);
    const password = 'test';
    const event = {
      target: {
        value: password,
      },
    };

    wrapper.setState({
      confirmPass: 'temp',
      err: {
        confirmErr: 'temp',
      },
    });

    wrapper.instance().handlePasswordChange(event);
    expect(wrapper.state().password).to.equal(password);
    expect(wrapper.state().confirmPass).to.equal('');
    expect(wrapper.state().err.confirmErr).to.equal('');
  });

  it('Handles input changes', () => {
    const wrapper = shallow(<Register {...props} />);
    const event = {
      target: {
        value: 'test@ttu.edu',
        name: 'email',
      },
    };

    wrapper.instance().handleInputChange(event);
    expect(wrapper.state().email).to.equal('test@ttu.edu');
  });

  it('Handles selection changes', () => {
    const wrapper = shallow(<Register {...props} />);
    const option = 'admin';
    const event = {
      target: {
        name: 'role',
      },
      option,
    };

    wrapper.setState({
      err: {
        stuIDErr: 'temp',
      },
    });

    wrapper.instance().handleSelectChange(event);
    expect(wrapper.state().role).to.equal(option);
  });

  it('Calls handleRegister when submit is pressed', () => {
    props.handleRegister = sinon.spy();
    const wrapper = shallow(<Register {...props} />);
    const event = {
      preventDefault: () => {},
    };

    wrapper.find({ label: 'Register' }).simulate('click', event);
    expect(props.handleRegister.calledOnce).to.equal(true);
  });

  it('Checks password onBlur, removes errors onFocus', () => {
    const wrapper = shallow(<Register {...props} />);
    const passInput = wrapper.find({ name: 'password' });
    const event = {
      target: {
        name: 'password',
      },
    };

    wrapper.setState({
      password: 'å',
    });

    passInput.simulate('blur', event);
    expect(wrapper.state().err.passErr).to
      .equal('Please use only ASCII characters.');

    wrapper.setState({
      password: 'asdf',
    });

    passInput.simulate('blur', event);
    expect(wrapper.state().err.passErr).to
      .equal('Please use at least 8 characters.');

    wrapper.setState({
      password: 'asdfasdf',
    });

    passInput.simulate('blur', event);
    expect(wrapper.state().err.passErr).to
      .equal('Please use at least one uppercase letter.');

    wrapper.setState({
      password: 'ASDFASDF',
    });

    passInput.simulate('blur', event);
    expect(wrapper.state().err.passErr).to
      .equal('Please use at least one lowercase letter.');

    wrapper.setState({
      password: 'asdfaSdf',
    });

    passInput.simulate('blur', event);
    expect(wrapper.state().err.passErr).to
      .equal('Please use at least one number.');

    wrapper.setState({
      password: 'asdfaS3f',
    });

    passInput.simulate('blur', event);
    expect(wrapper.state().err.passErr).to
      .equal('Please use at least one special character.');

    passInput.simulate('focus', event);
    expect(wrapper.state().err.passErr).to.equal('');

    wrapper.setState({
      password: 'asdfaS3_',
    });

    passInput.simulate('blur', event);
    expect(wrapper.state().err.passErr).to
      .equal('');
  });

  it('Checks email onBlur, removes errors onFocus', () => {
    const wrapper = shallow(<Register {...props} />);
    const input = wrapper.find({ name: 'email' });
    const event = {
      target: {
        name: 'email',
      },
    };

    wrapper.setState({
      email: 'test@test.com',
    });

    input.simulate('blur', event);
    expect(wrapper.state().err.emailErr).to
      .equal('Please use a TTU email address.');

    input.simulate('focus', event);
    expect(wrapper.state().err.emailErr).to.equal('');

    wrapper.setState({
      email: 'test@ttu.edu',
    });

    input.simulate('blur', event);
    expect(wrapper.state().err.emailErr).to
      .equal('');
  });

  it('Checks password confirmation onBlur, removes errors onFocus', () => {
    const wrapper = shallow(<Register {...props} />);
    const input = wrapper.find({ name: 'confirmPass' });
    const event = {
      target: {
        name: 'confirmPass',
      },
    };

    wrapper.setState({
      password: 'test',
      confirmPass: 'asdf',
    });

    input.simulate('blur', event);
    expect(wrapper.state().err.confirmErr).to
      .equal('Please enter a matching password.');

    input.simulate('focus', event);
    expect(wrapper.state().err.confirmErr).to.equal('');

    wrapper.setState({
      password: 'test',
      confirmPass: 'test',
    });

    input.simulate('blur', event);
    expect(wrapper.state().err.confirmErr).to
      .equal('');
  });

  it('Displays server errors', () => {
    props.regErr = 'Message';
    const wrapper = shallow(<Register {...props} />);

    expect(wrapper.contains(
      <span style={{ color: 'red' }}>{props.regErr}</span>),
    ).to.equal(true);
  });

  it('Disables submit while waiting for server', () => {
    props.handleRegister = sinon.spy();
    props.waiting = true;
    const wrapper = shallow(<Register {...props} />);

    wrapper.find({ label: 'Register' }).simulate('click');
    expect(props.handleRegister.calledOnce).to.equal(false);
  });
});
