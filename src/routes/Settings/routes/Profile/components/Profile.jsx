import React from 'react';
import PropTypes from 'prop-types';
import update from 'immutability-helper';

import Box from 'grommet/components/Box';
import Heading from 'grommet/components/Heading';
import Form from 'grommet/components/Form';
import FormField from 'grommet/components/FormField';
import Footer from 'grommet/components/Footer';
import Button from 'grommet/components/Button';

class Profile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      firstName: this.props.firstName,
      lastName: this.props.lastName
    };

    this.handleInputChange = this.handleInputChange.bind(this);
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

  handleSubmit(event) {
    // This prevents a '?' from being appended to the URL
    event.preventDefault();
    var data = {};

    if(this.props.firstName !== this.state.firstName) {
      data.firstName = this.state.firstName;
    }

    if(this.props.lastName !== this.state.lastName) {
      data.lastName = this.state.lastName;
    }

    this.props.handleSubmit(data);
  }

  render() {
    var errMessage = null;
    if(this.props.proErr !== '') {
      errMessage = (
        <span style={{color: 'red'}}>{this.props.proErr}</span>
      );
    }

    var passHandleSubmit = this.handleSubmit;
    if(this.props.waiting === true) {
      passHandleSubmit = null;
    }

    return (
      <Box
        flex={true}
        align='center'
        size={{width: 'full'}}>
        <Heading tag='h2'>
          Personal Information
        </Heading>
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
            {errMessage}
          </fieldset>
          <Footer size='small'>
            <Button
              label='Change Information'
              type='submit'
              primary={true}
              onClick={passHandleSubmit}/>
          </Footer>
        </Form>
      </Box>
    );
  }
}

Profile.propTypes = {
  handleSubmit: PropTypes.func,
  proErr: PropTypes.string,
  waiting: PropTypes.bool,
  firstName: PropTypes.string,
  lastName: PropTypes.string
};

Profile.defaultProps = {
  proErr: '',
  waiting: false
};

export default Profile;
