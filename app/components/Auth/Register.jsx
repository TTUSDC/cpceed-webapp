import React from 'react';
import PropTypes from 'prop-types';
import update from 'immutability-helper';

import Form from 'grommet/components/Form';
import FormField from 'grommet/components/FormField';
import Select from 'grommet/components/Select';
import Paragraph from 'grommet/components/Paragraph';
import Footer from 'grommet/components/Footer';
import Button from 'grommet/components/Button';

import { AuthStates } from 'redux/actions.js';
import logger from 'logger.js';
import { checkEmail, checkPass, checkConfirm } from './verify.js';

class Register extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
      confirmPass: '',
      name: '',
      role: 'student',
      err: {
        emailErr: '',
        passErr: '',
        confirmErr: '',
      },
    };

    this.handlePasswordChange = this.handlePasswordChange.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleSelectChange = this.handleSelectChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleFocus = this.handleFocus.bind(this);
    this.inputChecking = this.inputChecking.bind(this);
  }

  handlePasswordChange(event) {
    this.setState({
      password: event.target.value,
      confirmPass: '',
      err: update(this.state.err, {
        confirmErr: { $set: '' },
      }),
    });
  }

  handleInputChange(event) {
    const target = event.target;
    const value = target.value;
    const name = target.name;

    this.setState({
      [name]: value,
    });
  }

  handleSelectChange(event) {
    const name = event.target.name;
    const option = event.option;

    this.setState({
      [name]: option,
    });
  }

  handleSubmit(event) {
    // This prevents a '?' from being appended to the URL
    event.preventDefault();

    this.props.handleRegister({
      email: this.state.email,
      password: this.state.password,
      name: this.state.name,
      role: this.state.role,
    });
  }

  handleFocus(event) {
    const name = event.target.name;

    switch (name) {
      case 'email':
        if (this.state.err.emailErr !== '') {
          this.setState({
            err: update(this.state.err, {
              emailErr: { $set: '' },
            }),
          });
        }

        break;
      case 'password':
        if (this.state.err.passErr !== '') {
          this.setState({
            err: update(this.state.err, {
              passErr: { $set: '' },
            }),
          });
        }

        break;
      case 'confirmPass':
        if (this.state.err.confirmErr !== '') {
          this.setState({
            err: update(this.state.err, {
              confirmErr: { $set: '' },
            }),
          });
        }

        break;
      default:
        logger.error(`Create an onFocus handler for ${name}`);
    }
  }

  inputChecking(event) {
    const name = event.target.name;
    let value = null;

    switch (name) {
      case 'email':
        value = checkEmail(this.state.email);

        this.setState({
          err: update(this.state.err, {
            emailErr: { $set: value },
          }),
        });

        break;
      case 'password':
        value = checkPass(this.state.password);

        this.setState({
          err: update(this.state.err, {
            passErr: { $set: value },
          }),
        });

        break;
      case 'confirmPass':
        value = checkConfirm(this.state.password, this.state.confirmPass);

        this.setState({
          err: update(this.state.err, {
            confirmErr: { $set: value },
          }),
        });

        break;
      default:
        logger.error(`Create an onBlur handler for ${name}`);
    }
  }

  render() {
    // Turn AuthStates from actions.js into array for Select
    const authArray = [];
    Object.keys(AuthStates).forEach((key) => {
      if (AuthStates[key] !== 'guest') {
        authArray.push(AuthStates[key]);
      }
    });

    let errMessage = null;
    if (this.props.regErr !== '') {
      errMessage = (
        <span style={{ color: 'red' }}>{this.props.regErr}</span>
      );
    }

    let passHandleSubmit = this.handleSubmit;
    Object.keys(this.state.err).forEach((key) => {
      if (this.state.err[key] !== '') {
        passHandleSubmit = null;
      }
    });
    if (this.props.waiting === true) {
      passHandleSubmit = null;
    }

    return (
      <Form
        pad='medium'
        plain={false}
        onSubmit={passHandleSubmit}
      >
        <fieldset>
          <FormField label='Role'>
            <Select
              name='role'
              options={authArray}
              value={this.state.role}
              onChange={this.handleSelectChange}
            />
          </FormField>
          <FormField
            label='Email'
            error={this.state.err.emailErr}
          >
            <input
              name='email'
              type='email'
              value={this.state.email}
              onBlur={this.inputChecking}
              onFocus={this.handleFocus}
              onChange={this.handleInputChange}
            />
          </FormField>
          <Paragraph margin='none'>
            Your password should use at least 8 characters. It should
            contain only ASCII text, with at least one uppercase, one
            lowercase, one number, and one special character.
          </Paragraph>
          <FormField
            label='Password'
            error={this.state.err.passErr}
          >
            <input
              name='password'
              type='password'
              value={this.state.password}
              onBlur={this.inputChecking}
              onFocus={this.handleFocus}
              onChange={this.handlePasswordChange}
            />
          </FormField>
          <FormField
            label='Confirm Password'
            error={this.state.err.confirmErr}
          >
            <input
              name='confirmPass'
              type='password'
              value={this.state.confirmPass}
              onBlur={this.inputChecking}
              onFocus={this.handleFocus}
              onChange={this.handleInputChange}
            />
          </FormField>
          <FormField label='Screen Name'>
            <input
              name='name'
              type='text'
              value={this.state.name}
              onChange={this.handleInputChange}
            />
          </FormField>
          {errMessage}
        </fieldset>
        <Footer size='small'>
          <Button
            label='Register'
            type='submit'
            primary
            onClick={passHandleSubmit}
          />
        </Footer>
      </Form>
    );
  }
}

Register.propTypes = {
  handleRegister: PropTypes.func.isRequired,
  regErr: PropTypes.string.isRequired,
  waiting: PropTypes.bool.isRequired,
};

export default Register;
