import React from 'react';

import Form from 'grommet/components/Form';
import FormField from 'grommet/components/FormField';
import Select from 'grommet/components/Select';
import Paragraph from 'grommet/components/Paragraph';
import Footer from 'grommet/components/Footer';
import Button from 'grommet/components/Button';

import { AuthStates } from 'redux/actions.js';

class Register extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      emailErr: '',
      password: '',
      passErr: '',
      confirmPass: '',
      confirmErr: '',
      firstName: '',
      lastName: '',
      studentID: '',
      stuIDErr: '',
      role: 'student'
    };

    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleSelectChange = this.handleSelectChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.inputChecking = this.inputChecking.bind(this);
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
      [name]: option
    });
  }

  handleSubmit(event) {
    // This prevents a '?' from being appended to the URL
    event.preventDefault();

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

  inputChecking(event) {
    const name = event.target.name;

    switch(name) {
      case "email":
        if(/@ttu.edu$/.test(this.state.email) !== true) {
          this.setState({
            emailErr: 'Please use a TTU email address.'
          });
        } else {
          if(this.state.emailErr !== '') {
            this.setState({
              emailErr: ''
            });
          }
        }

        break;
      case "password":
        if(/^[\x00-\x7F]+$/.test(this.state.password) !== true) {
          // ASCII only
          this.setState({
            passErr: 'Please use only ASCII characters.'
          });
        } else if(this.state.password.length < 8) {
          // 8 characters long
          this.setState({
            passErr: 'Please use at least 8 characters.'
          });
        } else if(/[A-Z]/.test(this.state.password) !== true) {
          // 1 uppercase
          this.setState({
            passErr: 'Please use at least one uppercase letter.'
          });
        } else if(/[a-z]/.test(this.state.password) !== true) {
          // 1 lowercase
          this.setState({
            passErr: 'Please use at least one lowercase letter.'
          });
        } else if(/[0-9]/.test(this.state.password) !== true) {
          // 1 number
          this.setState({
            passErr: 'Please use at least one number.'
          });
        } else if(/[^A-Za-z0-9]/.test(this.state.password) !== true) {
          // 1 special character
          this.setState({
            passErr: 'Please use at least one special character.'
          });
        } else {
          if(this.state.passErr !== '') {
            this.setState({
              passErr: ''
            });
          }
        }

        break;
      case "confirmPass":
        if(this.state.password !== this.state.confirmPass) {
          this.setState({
            confirmErr: 'Please enter a matching password.'
          });
        } else {
          if(this.state.confirmErr !== '') {
            this.setState({
              confirmErr: ''
            });
          }
        }

        break;
      case "studentID":
        if(/^[0-9]{8}$/.test(this.state.studentID) !== true) {
          this.setState({
            stuIDErr: 'Please use 8 numbers.'
          });
        } else {
          if(this.state.stuIDErr !== '') {
            this.setState({
              stuIDErr: ''
            });
          }
        }

        break;
      default:
        console.log("Create an input checking case for " + name);

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
          error={this.state.stuIDErr}>
          <input
            name='studentID'
            type='text'
            value={this.state.studentID}
            onBlur={this.inputChecking}
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

    return (
      <Form
        pad='medium'
        plain={false}
        onSubmit={this.handleSubmit}>
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
            error={this.state.emailErr}>
            <input
              name='email'
              type='email'
              value={this.state.email}
              onBlur={this.inputChecking}
              onChange={this.handleInputChange}/>
          </FormField>
          <Paragraph>
            Your password should use at least 8 characters. It should
            contain only ASCII text, with at least one uppercase, one
            lowercase, one number, and one special character.
          </Paragraph>
          <FormField
            label='Password'
            error={this.state.passErr}>
            <input
              name='password'
              type='password'
              value={this.state.password}
              onBlur={this.inputChecking}
              onChange={this.handleInputChange}/>
          </FormField>
          <FormField
            label='Confirm Password'
            error={this.state.confirmErr}>
            <input
              name='confirmPass'
              type='password'
              value={this.state.confirmPass}
              onBlur={this.inputChecking}
              onChange={this.handleInputChange}/>
          </FormField>
          {errMessage}
        </fieldset>
        <Footer size='small'>
          <Button
            label='Register'
            type='submit'
            primary={true}
            onClick={this.handleSubmit}/>
        </Footer>
      </Form>
    );
  }
}

export default Register;
