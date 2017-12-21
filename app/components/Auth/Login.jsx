import React from 'react';
import PropTypes from 'prop-types';

import Form from 'grommet/components/Form';
import FormField from 'grommet/components/FormField';
import Footer from 'grommet/components/Footer';
import Button from 'grommet/components/Button';

class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
    };

    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleInputChange(event) {
    const target = event.target;
    const value = target.value;
    const name = target.name;

    this.setState({
      [name]: value,
    });
  }

  handleSubmit(event) {
    // This prevents a '?' from being appended to the URL
    event.preventDefault();
    this.props.handleLogin(this.state.email, this.state.password);
  }

  render() {
    let errMessage = null;
    if (this.props.logErr !== '') {
      errMessage = (
        <span style={{ color: 'red' }}>{this.props.logErr}</span>
      );
    }

    let passHandleSubmit = this.handleSubmit;
    if (this.props.waiting === true) {
      passHandleSubmit = null;
    }

    return (
      <Form
        pad='medium'
        plain={false}
        onSubmit={this.handleSubmit}
      >
        <fieldset>
          <FormField label='Email'>
            <input
              name='email'
              type='email'
              value={this.state.email}
              onChange={this.handleInputChange}
            />
          </FormField>
          <FormField label='Password'>
            <input
              name='password'
              type='password'
              value={this.state.password}
              onChange={this.handleInputChange}
            />
          </FormField>
          {errMessage}
        </fieldset>
        <Footer size='small'>
          <Button
            label='Login'
            type='submit'
            primary
            onClick={passHandleSubmit}
          />
        </Footer>
      </Form>
    );
  }
}

Login.propTypes = {
  handleLogin: PropTypes.func.isRequired,
  logErr: PropTypes.string.isRequired,
  waiting: PropTypes.bool.isRequired,
};

export default Login;
