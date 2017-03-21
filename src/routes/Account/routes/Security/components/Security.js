import React, {PropTypes} from 'react';
import update from 'immutability-helper';

import Form from 'grommet/components/Form';
import FormField from 'grommet/components/FormField';
import Paragraph from 'grommet/components/Paragraph';
import Footer from 'grommet/components/Footer';
import Button from 'grommet/components/Button';

import {checkPass, checkConfirm} from 'components/Auth/verify.js';
import logger from 'logger/logger.js';

class Security extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      password: '',
      confirm: '',
      err: {
        password: '',
        confirm: ''
      }
    };

    this.handlePasswordChange = this.handlePasswordChange.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleFocus = this.handleFocus.bind(this);
    this.inputChecking = this.inputChecking.bind(this);
  }

  handlePasswordChange(event) {
    this.setState({
      password: event.target.value,
      confirm: '',
      err: update(this.state.err, {
        confirm: {$set: ''}
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

  handleSubmit(event) {
    // This prevents a '?' from being appended to the URL
    event.preventDefault();
    this.props.handleSubmit(this.state.password);
  }

  handleFocus(event) {
    const name = event.target.name;

    switch(name) {
      case "password":
        if(this.state.err.password !== '') {
          this.setState({
            err: update(this.state.err, {
              password: {$set: ''}
            })
          });
        }

        break;
      case "confirm":
        if(this.state.err.confirm !== '') {
          this.setState({
            err: update(this.state.err, {
              confirm: {$set: ''}
            })
          });
        }

        break;
      default:
        logger.error('Create an onFocus handler in Security.js for ' + name);

        break;
    };
  }

  inputChecking(event) {
    const name = event.target.name;
    var value = null;

    switch(name) {
      case "password":
        value = checkPass(this.state.password);

        this.setState({
          err: update(this.state.err, {
            password: {$set: value}
          })
        });

        break;
      case "confirm":
        value = checkConfirm(this.state.password, this.state.confirm);

        this.setState({
          err: update(this.state.err, {
            confirm: {$set: value}
          })
        });

        break;
      default:
        logger.error('Create an onBlur handler in Security.js for ' + name);

        break;
    };
  }

  render() {
    var errMessage = null;
    if(this.props.secErr !== '') {
      errMessage = (
        <span style={{color: 'red'}}>{this.props.secErr}</span>
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
          <Paragraph>
            Your password should use at least 8 characters. It should
            contain only ASCII text, with at least one uppercase, one
            lowercase, one number, and one special character.
          </Paragraph>
          <FormField
            label='Password'
            error={this.state.err.password}>
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
            error={this.state.err.confirm}>
            <input
              name='confirm'
              type='password'
              value={this.state.confirm}
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

Security.propTypes = {
  handleSubmit: PropTypes.func,
  secErr: PropTypes.string,
  waiting: PropTypes.bool
};

Security.defaultProps = {
  secErr: '',
  waiting: false
};

export default Security;
