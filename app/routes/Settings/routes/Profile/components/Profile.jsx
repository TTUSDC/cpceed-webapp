import React from 'react';
import PropTypes from 'prop-types';

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
      name: this.props.name,
    };

    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleInputChange(event) {
    const target = event.target;
    const value = target.value;
    const name = target.name;

    this.setState({
      [name]: value,
    });
  }

  handleSubmit(event) {
    // This prevents a '?' from being appended to the URL
    event.preventDefault();

    if (this.props.name !== this.state.name) {
      this.props.handleSubmit({
        name: this.state.name,
      });
    }
  }

  render() {
    let errMessage = null;
    if (this.props.proErr !== '') {
      errMessage = (
        <span style={{ color: 'red' }}>{this.props.proErr}</span>
      );
    }

    let passHandleSubmit = this.handleSubmit;
    if (this.props.waiting === true) {
      passHandleSubmit = null;
    }

    return (
      <Box
        flex
        align='center'
        size={{ width: 'full' }}
      >
        <Heading tag='h2'>
          Personal Information
        </Heading>
        <Form
          pad='medium'
          plain={false}
          onSubmit={passHandleSubmit}
        >
          <fieldset>
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
              label='Change Information'
              type='submit'
              primary
              onClick={passHandleSubmit}
            />
          </Footer>
        </Form>
      </Box>
    );
  }
}

Profile.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  proErr: PropTypes.string.isRequired,
  waiting: PropTypes.bool.isRequired,
  name: PropTypes.string.isRequired,
};

export default Profile;
