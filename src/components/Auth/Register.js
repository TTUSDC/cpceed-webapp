import React from 'react';

import Form from 'grommet/components/Form';
import FormField from 'grommet/components/FormField';
import Select from 'grommet/components/Select';
import Footer from 'grommet/components/Footer';
import Button from 'grommet/components/Button';

import { AuthStates } from 'redux/actions.js';

class Register extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
      confirmPass: '',
      passErr: '',
      firstName: '',
      lastName: '',
      studentID: '',
      stuIDErr: '',
      role: 'student'
    };

    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleSelectChange = this.handleSelectChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleInputChange(event, key) {
    this.setState({
      [key]: event.target.value
    });
  }

  handleSelectChange(event) {
    this.setState({
      role: event.option
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

  componentDidUpdate() {
    if(this.state.password !== this.state.confirmPass) {
      if(this.state.passErr === '') {
        this.setState({
          passErr: 'Please enter a matching password.'
        });
      }
    } else {
      if(this.state.passErr !== '') {
        this.setState({
          passErr: ''
        });
      }
    }

    if(this.state.studentID.length !== 8) {
      if(this.state.stuIDErr === '') {
        this.setState({
          stuIDErr: 'Please use 8 numbers.'
        });
      }
    } else {
      if(this.state.stuIDErr !== '') {
        this.setState({
          stuIDErr: ''
        });
      }
    }
  }

  render() {
    var studentIDField = null;
    if(this.state.role === 'student') {
      studentIDField = (
        <FormField
          label='Student ID'
          error={this.state.stuIDErr}>
          <input
            type='text'
            placeholder='Do not include R'
            value={this.state.studentID}
            onChange={(event) => {
              this.handleInputChange(event, 'studentID');
            }}/>
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
        plain={false}>
        <fieldset>
          <FormField label='Role'>
            <Select
              options={authArray}
              value={this.state.role}
              onChange={(event) => {
                this.handleSelectChange(event);
              }}/>
          </FormField>
          {studentIDField}
          <FormField label='First Name'>
            <input
              type='text'
              value={this.state.firstName}
              onChange={(event) => {
                this.handleInputChange(event, 'firstName');
              }}/>
          </FormField>
          <FormField label='Last Name'>
            <input
              type='text'
              value={this.state.lastName}
              onChange={(event) => {
                this.handleInputChange(event, 'lastName');
              }}/>
          </FormField>
          <FormField label='Email'>
            <input
              type='email'
              value={this.state.email}
              onChange={(event) => {
                this.handleInputChange(event, 'email');
              }}/>
          </FormField>
          <FormField label='Password'>
            <input
              type='password'
              value={this.state.password}
              onChange={(event) => {
                this.handleInputChange(event, 'password');
              }}/>
          </FormField>
          <FormField
            label='Confirm Password'
            error={this.state.passErr}>
            <input
              type='password'
              value={this.state.confirmPass}
              onChange={(event) => {
                this.handleInputChange(event, 'confirmPass');
              }}/>
          </FormField>
          {errMessage}
        </fieldset>
        <Footer size='small'>
          <Button
            label='Register'
            type='submit'
            primary={true}
            onClick={(event) => {
              this.handleSubmit(event);
            }}/>
        </Footer>
      </Form>
    );
  }
}

export default Register;
