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
            name='studentID'
            type='text'
            placeholder='Do not include R'
            value={this.state.studentID}
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
          <FormField label='Email'>
            <input
              name='email'
              type='email'
              value={this.state.email}
              onChange={this.handleInputChange}/>
          </FormField>
          <Paragraph>
            Your password should use at least 8 characters. It should
            contain only ASCII text, with at least one uppercase, one
            lowercase, one number, and one special character.
          </Paragraph>
          <FormField label='Password'>
            <input
              name='password'
              type='password'
              value={this.state.password}
              onChange={this.handleInputChange}/>
          </FormField>
          <FormField
            label='Confirm Password'
            error={this.state.passErr}>
            <input
              name='confirmPass'
              type='password'
              value={this.state.confirmPass}
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
