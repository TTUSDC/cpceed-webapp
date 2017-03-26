import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import sinon from 'sinon';

import Account from 'routes/Settings/routes/Account/components/Account';

export default describe("Account.js", () => {
  it("Handles password changes", () => {
    const wrapper = shallow(<Account />);
    const password = 'test';
    const event = {
      target: {
        value: password
      }
    };

    wrapper.setState({
      confirmPass: 'temp',
      err: {
        confirmErr: 'temp'
      }
    });

    wrapper.instance().handlePasswordChange(event);
    expect(wrapper.state().password).to.equal(password);
    expect(wrapper.state().confirm).to.equal('');
    expect(wrapper.state().err.confirm).to.equal('');
  });

  it("Handles input changes", () => {
    const wrapper = shallow(<Account />);
    const event = {
      target: {
        value: 'test@ttu.edu',
        name: 'email'
      }
    };

    wrapper.instance().handleInputChange(event);
    expect(wrapper.state().email).to.equal('test@ttu.edu');
  });

  it("Calls handlePassword when button is pressed", () => {
    const handlePassword = sinon.spy();
    const wrapper = shallow(<Account handlePassword={handlePassword} />);
    const event = {
      preventDefault: () => {}
    };

    wrapper.find({label: 'Change Password'}).simulate('click', event);
    expect(handlePassword.calledOnce).to.equal(true);
  });

  it("Calls handleEmail when button is pressed", () => {
    const handleEmail = sinon.spy();
    const wrapper = shallow(<Account handleEmail={handleEmail} />);
    const event = {
      preventDefault: () => {}
    };

    wrapper.find({label: 'Change Email'}).simulate('click', event);
    expect(handleEmail.calledOnce).to.equal(true);
  });

  it("Checks password onBlur, removes errors onFocus", () => {
    const wrapper = shallow(<Account />);
    const input = wrapper.find({name: 'password'});
    const event = {
      target: {
        name: 'password'
      }
    };

    wrapper.setState({
      password: 'å'
    });

    input.simulate('blur', event);
    expect(wrapper.state().err.password).to.not.equal('');

    input.simulate('focus', event);
    expect(wrapper.state().err.password).to.equal('');
  });

  it("Checks password confirmation onBlur, removes errors onFocus", () => {
    const wrapper = shallow(<Account />);
    const input = wrapper.find({name: 'confirm'});
    const event = {
      target: {
        name: 'confirm'
      }
    };

    wrapper.setState({
      password: 'test',
      confirm: 'asdf'
    });

    input.simulate('blur', event);
    expect(wrapper.state().err.confirm).to.not.equal('');

    input.simulate('focus', event);
    expect(wrapper.state().err.confirm).to.equal('');
  });

  it("Checks email onBlur, removes errors onFocus", () => {
    const wrapper = shallow(<Account />);
    const input = wrapper.find({name: 'email'});
    const event = {
      target: {
        name: 'email'
      }
    };

    wrapper.setState({
      email: 'test@test.com'
    });

    input.simulate('blur', event);
    expect(wrapper.state().err.email).to.not.equal('');

    input.simulate('focus', event);
    expect(wrapper.state().err.email).to.equal('');
  });

  it("Displays password server errors", () => {
    const err = {
      password: 'Message',
      email: ''
    };
    const wrapper = shallow(<Account err={err} />);

    expect(wrapper.contains(
      <span style={{color: 'red'}}>{err.password}</span>)
    ).to.equal(true);
  });

  it("Disables password button while waiting for server", () => {
    const waiting = {
      email: false,
      password: true
    };
    const handlePassword = sinon.spy();
    const wrapper = shallow(
      <Account
        handlePassword={handlePassword}
        waiting={waiting} />
    );

    wrapper.find({label: 'Change Password'}).simulate('click');
    expect(handlePassword.calledOnce).to.equal(false);
  });

  it("Displays email server errors", () => {
    const err = {
      password: '',
      email: 'Message'
    };
    const wrapper = shallow(<Account err={err} />);

    expect(wrapper.contains(
      <span style={{color: 'red'}}>{err.email}</span>)
    ).to.equal(true);
  });

  it("Disables email button while waiting for server", () => {
    const waiting = {
      email: true,
      password: false
    };
    const handleEmail = sinon.spy();
    const wrapper = shallow(
      <Account
        handleEmail={handleEmail}
        waiting={waiting} />
    );

    wrapper.find({label: 'Change Email'}).simulate('click');
    expect(handleEmail.calledOnce).to.equal(false);
  });
});
