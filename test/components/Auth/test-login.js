import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import sinon from 'sinon';

import Login from 'components/Auth/Login.js';

export default describe("Login.js", () => {
  it("Handles input changes", () => {
    const wrapper = shallow(<Login />);
    const event = {
      target: {
        value: 'test@ttu.edu',
        name: 'email'
      }
    };

    wrapper.instance().handleInputChange(event);
    expect(wrapper.state().email).to.equal('test@ttu.edu');
  });

  it("Displays server errors", () => {
    const logErr = 'Message';
    const wrapper = shallow(<Login logErr={logErr} />);

    expect(wrapper.contains(
      <span style={{color: 'red'}}>{logErr}</span>)
    ).to.equal(true);
  });

  it("Disables submit while waiting for server", () => {
    const handleLogin = sinon.spy();
    const wrapper = shallow(
      <Login
        handleLogin={handleLogin}
        waiting={true} />
    );

    wrapper.find({label: 'Login'}).simulate('click');
    expect(handleLogin.calledOnce).to.equal(false);
  });

  it("Calls handleLogin when submit is pressed", () => {
    const handleLogin = sinon.spy();
    const wrapper = shallow(<Login handleLogin={handleLogin} />);
    const event = {
      preventDefault: () => {}
    };

    wrapper.find({label: 'Login'}).simulate('click', event);
    expect(handleLogin.calledOnce).to.equal(true);
  });
});
