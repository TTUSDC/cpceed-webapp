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
import { checkEmail, checkPass, checkConfirm, checkID } from './verify.js';

class Register extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
      confirmPass: '',
      firstName: '',
      lastName: '',
      studentID: '',
      role: 'student',
      err: {
        emailErr: '',
        passErr: '',
        confirmErr: '',
        stuIDErr: '',
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
      studentID: '',
      err: update(this.state.err, {
        stuIDErr: { $set: '' },
      }),
    });
  }

  handleSubmit(event) {
    // This prevents a '?' from being appended to the URL
    event.preventDefault();

    const data = {
      email: this.state.email,
      password: this.state.password,
      firstName: this.state.firstName,
      lastName: this.state.lastName,
      role: this.state.role,
    };

    if (data.role === AuthStates.STUDENT) {
      data.studentId = this.state.studentID;
    }

    this.props.handleRegister(data);
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
      case 'studentID':
        if (this.state.err.stuIDErr !== '') {
          this.setState({
            err: update(this.state.err, {
              stuIDErr: { $set: '' },
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
      case 'studentID':
        value = checkID(this.state.studentID);

        this.setState({
          err: update(this.state.err, {
            stuIDErr: { $set: value },
          }),
        });

        break;
      default:
        logger.error(`Create an onBlur handler for ${name}`);
    }
  }

  render() {
    let studentIDdesc = null;
    let studentIDField = null;
    if (this.state.role === 'student') {
      studentIDdesc = (
        <Paragraph margin='none'>
          Don{'\''}t include the R before your student ID number.
        </Paragraph>
      );
      studentIDField = (
        <FormField
          label='Student ID'
          error={this.state.err.stuIDErr}
        >
          <input
            name='studentID'
            type='text'
            value={this.state.studentID}
            onBlur={this.inputChecking}
            onFocus={this.handleFocus}
            onChange={this.handleInputChange}
          />
        </FormField>
      );
    }

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
          {studentIDdesc}
          {studentIDField}
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
          <FormField label='First Name'>
            <input
              name='firstName'
              type='text'
              value={this.state.firstName}
              onChange={this.handleInputChange}
            />
          </FormField>
          <FormField label='Last Name'>
            <input
              name='lastName'
              type='text'
              value={this.state.lastName}
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
