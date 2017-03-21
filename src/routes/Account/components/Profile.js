import React, { PropTypes } from 'react';
import update from 'immutability-helper';

import Form from 'grommet/components/Form';
import FormField from 'grommet/components/FormField';
import Footer from 'grommet/components/Footer';
import Button from 'grommet/components/Button';

import {checkEmail} from 'components/Auth/verify.js';
import logger from 'logger/logger.js';

class Profile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: this.props.email,
      firstName: this.props.firstName,
      lastName: this.props.lastName,
      err: {
        email: ''
      }
    };

    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleFocus = this.handleFocus.bind(this);
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

  handleSubmit(event) {
    // This prevents a '?' from being appended to the URL
    event.preventDefault();
    var data = {};

    if(this.props.email !== this.state.email) {
      data.email = this.state.email;
    }

    if(this.props.firstName !== this.state.firstName) {
      data.firstName = this.state.firstName;
    }

    if(this.props.lastName !== this.state.lastName) {
      data.lastName = this.state.lastName;
    }

    this.props.handleSubmit(data);
  }

  handleFocus(event) {
    const name = event.target.name;

    switch(name) {
      case "email":
        if(this.state.err.email !== '') {
          this.setState({
            err: update(this.state.err, {
              email: {$set: ''}
            })
          });
        }

        break;
      default:
        logger.error('Create an onFocus handler in Profile.js for ' + name);
    };
  }

  inputChecking(event) {
    const name = event.target.name;
    var value = null;

    switch(name) {
      case "email":
        value = checkEmail(this.state.email);

        this.setState({
          err: update(this.state.err, {
            email: {$set: value}
          })
        });

        break;
      default:
        logger.error('Create an onBlur handler in Profile.js for ' + name);
    };
  }

  render() {
    var errMessage = null;
    if(this.props.proErr !== '') {
      errMessage = (
        <span style={{color: 'red'}}>{this.props.proErr}</span>
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
            error={this.state.err.email}>
            <input
              name='email'
              type='email'
              value={this.state.email}
              onBlur={this.inputChecking}
              onFocus={this.handleFocus}
              onChange={this.handleInputChange}/>
          </FormField>
          {errMessage}
        </fieldset>
        <Footer size='small'>
          <Button
            label='Submit'
            type='submit'
            primary={true}
            onClick={passHandleSubmit}/>
        </Footer>
      </Form>
    );
  }
}

Profile.propTypes = {
  handleSubmit: PropTypes.func,
  proErr: PropTypes.string,
  waiting: PropTypes.bool,
  firstName: PropTypes.string,
  lastName: PropTypes.string,
  email: PropTypes.string
};

Profile.defaultProps = {
  proErr: '',
  waiting: false
};

export default Profile;
