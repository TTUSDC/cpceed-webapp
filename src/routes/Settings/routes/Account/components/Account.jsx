import React, { PropTypes } from 'react';
import update from 'immutability-helper';

import Box from 'grommet/components/Box';
import Form from 'grommet/components/Form';
import Heading from 'grommet/components/Heading';
import FormField from 'grommet/components/FormField';
import Paragraph from 'grommet/components/Paragraph';
import Footer from 'grommet/components/Footer';
import Button from 'grommet/components/Button';

import {
  checkPass,
  checkConfirm,
  checkEmail,
} from 'components/Auth/verify.js';
import logger from 'logger/logger.js';

class Account extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      password: '',
      confirm: '',
      old: '',
      email: this.props.user.email,
      err: {
        password: '',
        confirm: '',
        email: '',
      },
    };

    this.handlePasswordChange = this.handlePasswordChange.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handlePassword = this.handlePassword.bind(this);
    this.handleEmail = this.handleEmail.bind(this);
    this.handleFocus = this.handleFocus.bind(this);
    this.inputChecking = this.inputChecking.bind(this);
  }

  handlePasswordChange(event) {
    this.setState({
      password: event.target.value,
      confirm: '',
      err: update(this.state.err, {
        confirm: { $set: '' },
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

  handlePassword(event) {
    // This prevents a '?' from being appended to the URL
    event.preventDefault();
    this.props.handlePassword(this.state.password, this.state.old);
  }

  handleEmail(event) {
    event.preventDefault();
    this.props.handleEmail(this.state.email);
  }

  handleFocus(event) {
    const name = event.target.name;

    switch (name) {
      case 'password':
        if (this.state.err.password !== '') {
          this.setState({
            err: update(this.state.err, {
              password: { $set: '' },
            }),
          });
        }

        break;
      case 'confirm':
        if (this.state.err.confirm !== '') {
          this.setState({
            err: update(this.state.err, {
              confirm: { $set: '' },
            }),
          });
        }

        break;
      case 'email':
        if (this.state.err.email !== '') {
          this.setState({
            err: update(this.state.err, {
              email: { $set: '' },
            }),
          });
        }

        break;
      default:
        logger.error(`Create an onFocus handler in Account.js for ${name}`);
    }
  }

  inputChecking(event) {
    const name = event.target.name;
    let value = null;

    switch (name) {
      case 'password':
        value = checkPass(this.state.password);

        this.setState({
          err: update(this.state.err, {
            password: { $set: value },
          }),
        });

        break;
      case 'confirm':
        value = checkConfirm(this.state.password, this.state.confirm);

        this.setState({
          err: update(this.state.err, {
            confirm: { $set: value },
          }),
        });

        break;
      case 'email':
        value = checkEmail(this.state.email);

        this.setState({
          err: update(this.state.err, {
            email: { $set: value },
          }),
        });

        break;
      default:
        logger.error(`Create an onBlur handler in Account.js for ${name}`);
    }
  }

  render() {
    // Password conditional rendering

    let passwordMessage = null;
    if (this.props.err.password !== '') {
      passwordMessage = (
        <span style={{ color: 'red' }}>{this.props.err.password}</span>
      );
    }

    let passPassword = this.handlePassword;
    if (this.state.err.password !== '') {
      passPassword = null;
    } else if (this.state.err.confirm !== '') {
      passPassword = null;
    } else if (this.props.waiting.password === true) {
      passPassword = null;
    }

    // Email conditional rendering

    let emailMessage = null;
    if (this.props.err.email !== '') {
      emailMessage = (
        <span style={{ color: 'red' }}>{this.props.err.email}</span>
      );
    }

    let passEmail = this.handleEmail;
    if (this.state.err.email !== '') {
      passEmail = null;
    } else if (this.props.waiting.email === true) {
      passEmail = null;
    }

    return (
      <Box
        flex
        align='center'
        size={{ width: 'full' }}
      >
        <Heading tag='h2'>
          Change Password
        </Heading>
        <Form
          pad='medium'
          plain={false}
          onSubmit={passPassword}
        >
          <fieldset>
            <Paragraph margin='none'>
              Your password should use at least 8 characters. It should
              contain only ASCII text, with at least one uppercase, one
              lowercase, one number, and one special character.
            </Paragraph>
            <FormField
              label='Password'
              error={this.state.err.password}
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
              error={this.state.err.confirm}
            >
              <input
                name='confirm'
                type='password'
                value={this.state.confirm}
                onBlur={this.inputChecking}
                onFocus={this.handleFocus}
                onChange={this.handleInputChange}
              />
            </FormField>
            <FormField label='Old Password'>
              <input
                name='old'
                type='password'
                value={this.state.old}
                onChange={this.handleInputChange}
              />
            </FormField>
            {passwordMessage}
          </fieldset>
          <Footer size='small'>
            <Button
              label='Change Password'
              type='submit'
              primary
              onClick={passPassword}
            />
          </Footer>
        </Form>
        <Heading tag='h2'>
          Change Email
        </Heading>
        <Form
          pad='medium'
          plain={false}
          onSubmit={passEmail}
        >
          <fieldset>
            <Paragraph margin='none'>
              You use your email to login, so make sure to use your new one
              on your next visit.
            </Paragraph>
            <FormField
              label='Email'
              error={this.state.err.email}
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
            {emailMessage}
          </fieldset>
          <Footer size='small'>
            <Button
              label='Change Email'
              type='submit'
              primary
              onClick={passEmail}
            />
          </Footer>
        </Form>
      </Box>
    );
  }
}

Account.propTypes = {
  handlePassword: PropTypes.func.isRequired,
  handleEmail: PropTypes.func.isRequired,
  user: PropTypes.shape({
    email: PropTypes.string.isRequired,
  }).isRequired,
  err: PropTypes.shape({
    password: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
  }).isRequired,
  waiting: PropTypes.shape({
    password: PropTypes.bool.isRequired,
    email: PropTypes.bool.isRequired,
  }).isRequired,
};

export default Account;
