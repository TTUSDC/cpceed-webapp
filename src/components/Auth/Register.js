import React, { PropTypes } from 'react';
import update from 'immutability-helper';

import Form from 'grommet/components/Form';
import FormField from 'grommet/components/FormField';
import Select from 'grommet/components/Select';
import Paragraph from 'grommet/components/Paragraph';
import Footer from 'grommet/components/Footer';
import Button from 'grommet/components/Button';

import { AuthStates } from 'redux/actions.js';
import logger from 'logger/logger.js';

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
        stuIDErr: ''
      }
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
        confirmErr: {$set: ''}
      })
    });
  }

  handleInputChange(event) {
    const target = event.target;
    const value = target.value;
    const name = target.name;

    this.setState({
      [name]: value
    });
  }

  handleSelectChange(event) {
    const name = event.target.name;
    const option = event.option;

    this.setState({
      [name]: option,
      studentID: '',
      err: update(this.state.err, {
        stuIDErr: {$set: ''}
      })
    });
  }

  handleSubmit(event) {
    // This prevents a '?' from being appended to the URL
    event.preventDefault();

    var err = [false, '', '', ''];
    if(this.state.email === '') {
      err[1] = 'Please enter an email';
      err[0] = true;
    }

    if(this.state.password === '') {
      err[2] = 'Please enter a password';
      err[0] = true;
    }

    if(this.state.studentID === '') {
      err[3] = 'Please enter a student ID';
      err[0] = true;
    }

    if(err[0] === true) {
      this.setState({
        err: update(this.state.err, {
          emailErr: {$set: err[1]},
          passErr: {$set: err[2]},
          stuIDErr: {$set: err[3]}
        })
      });
    } else {
      var data = {
        email: this.state.email,
        password: this.state.password,
        firstName: this.state.firstName,
        lastName: this.state.lastName,
        studentID: this.state.studentID,
        role: this.state.role
      };

      this.props.handleRegister(data);
    }
  }

  handleFocus(event) {
    const name = event.target.name;

    switch(name) {
      case "email":
        if(this.state.err.emailErr !== '') {
          this.setState({
            err: update(this.state.err, {
              emailErr: {$set: ''}
            })
          });
        }

        break;
      case "password":
        if(this.state.err.passErr !== '') {
          this.setState({
            err: update(this.state.err, {
              passErr: {$set: ''}
            })
          });
        }

        break;
      case "confirmPass":
        if(this.state.err.confirmErr !== '') {
          this.setState({
            err: update(this.state.err, {
              confirmErr: {$set: ''}
            })
          });
        }

        break;
      case "studentID":
        if(this.state.err.stuIDErr !== '') {
          this.setState({
            err: update(this.state.err, {
              stuIDErr: {$set: ''}
            })
          });
        }

        break;
      default:
        logger.error('Create an onFocus handler for ' + name);

        break;
    };
  }

  inputChecking(event) {
    const name = event.target.name;

    switch(name) {
      case "email":
        if(/@ttu.edu$/.test(this.state.email) !== true) {
          this.setState({
            err: update(this.state.err, {
              emailErr: {$set: 'Please use a TTU email address.'}
            })
          });
        }

        break;
      case "password":
        if(/^[\x00-\x7F]+$/.test(this.state.password) !== true) {
          // ASCII only
          this.setState({
            err: update(this.state.err, {
              passErr: {$set: 'Please use only ASCII characters.'}
            })
          });
        } else if(this.state.password.length < 8) {
          // 8 characters long
          this.setState({
            err: update(this.state.err, {
              passErr: {$set: 'Please use at least 8 characters.'}
            })
          });
        } else if(/[A-Z]/.test(this.state.password) !== true) {
          // 1 uppercase
          this.setState({
            err: update(this.state.err, {
              passErr: {$set: 'Please use at least one uppercase letter.'}
            })
          });
        } else if(/[a-z]/.test(this.state.password) !== true) {
          // 1 lowercase
          this.setState({
            err: update(this.state.err, {
              passErr: {$set: 'Please use at least one lowercase letter.'}
            })
          });
        } else if(/[0-9]/.test(this.state.password) !== true) {
          // 1 number
          this.setState({
            err: update(this.state.err, {
              passErr: {$set: 'Please use at least one number.'}
            })
          });
        } else if(/[^A-Za-z0-9]/.test(this.state.password) !== true) {
          // 1 special character
          this.setState({
            err: update(this.state.err, {
              passErr: {$set: 'Please use at least one special character.'}
            })
          });
        }

        break;
      case "confirmPass":
        if(this.state.password !== this.state.confirmPass) {
          this.setState({
            err: update(this.state.err, {
              confirmErr: {$set: 'Please enter a matching password.'}
            })
          });
        }

        break;
      case "studentID":
        if(/^[0-9]{8}$/.test(this.state.studentID) !== true) {
          this.setState({
            err: update(this.state.err, {
              stuIDErr: {$set: 'Please use 8 numbers.'}
            })
          });
        }

        break;
      default:
        logger.error('Create an onBlur handler for ' + name);

        break;
    };
  }

  render() {
    var studentIDdesc = null;
    var studentIDField = null;
    if(this.state.role === 'student') {
      studentIDdesc = (
        <Paragraph>
          Don't include the R before your student ID number.
        </Paragraph>
      );
      studentIDField = (
        <FormField
          label='Student ID'
          error={this.state.err.stuIDErr}>
          <input
            name='studentID'
            type='text'
            value={this.state.studentID}
            onBlur={this.inputChecking}
            onFocus={this.handleFocus}
            onChange={this.handleInputChange}/>
        </FormField>
      );
    }

    // Turn AuthStates from actions.js into array for Select
    var authArray = [];
    for(var key in AuthStates) {
      if(AuthStates[key] !== 'guest') {
        authArray.push(AuthStates[key]);
      }
    }

    var errMessage = null;
    if(this.props.regErr !== '') {
      errMessage = (
        <span style={{color: 'red'}}>{this.props.regErr}</span>
      );
    }

    var passHandleSubmit = this.handleSubmit;
    for(var key in this.state.err) {
      if(this.state.err[key] !== '') {
        passHandleSubmit = null;
      }
    }
    if(this.props.waiting === true) {
      passHandleSubmit = null;
    }

    return (
      <Form
        pad='medium'
        plain={false}
        onSubmit={passHandleSubmit}>
        <fieldset>
          <FormField label='Role'>
            <Select
              name='role'
              options={authArray}
              value={this.state.role}
              onChange={this.handleSelectChange}/>
          </FormField>
          {studentIDdesc}
          {studentIDField}
          <FormField label='First Name'>
            <input
              name='firstName'
              type='text'
              value={this.state.firstName}
              onChange={this.handleInputChange}/>
          </FormField>
          <FormField label='Last Name'>
            <input
              name='lastName'
              type='text'
              value={this.state.lastName}
              onChange={this.handleInputChange}/>
          </FormField>
          <FormField
            label='Email'
            error={this.state.err.emailErr}>
            <input
              name='email'
              type='email'
              value={this.state.email}
              onBlur={this.inputChecking}
              onFocus={this.handleFocus}
              onChange={this.handleInputChange}/>
          </FormField>
          <Paragraph>
            Your password should use at least 8 characters. It should
            contain only ASCII text, with at least one uppercase, one
            lowercase, one number, and one special character.
          </Paragraph>
          <FormField
            label='Password'
            error={this.state.err.passErr}>
            <input
              name='password'
              type='password'
              value={this.state.password}
              onBlur={this.inputChecking}
              onFocus={this.handleFocus}
              onChange={this.handlePasswordChange}/>
          </FormField>
          <FormField
            label='Confirm Password'
            error={this.state.err.confirmErr}>
            <input
              name='confirmPass'
              type='password'
              value={this.state.confirmPass}
              onBlur={this.inputChecking}
              onFocus={this.handleFocus}
              onChange={this.handleInputChange}/>
          </FormField>
          {errMessage}
        </fieldset>
        <Footer size='small'>
          <Button
            label='Register'
            type='submit'
            primary={true}
            onClick={passHandleSubmit}/>
        </Footer>
      </Form>
    );
  }
}

Register.propTypes = {
  handleRegister: PropTypes.func,
  regErr: PropTypes.string,
  waiting: PropTypes.bool
};

Register.defaultProps = {
  regErr: '',
  waiting: false
};

export default Register;
