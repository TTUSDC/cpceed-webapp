import React from 'react';

import Form from 'grommet/components/Form';
import FormField from 'grommet/components/FormField';
import Footer from 'grommet/components/Footer';
import Button from 'grommet/components/Button';

class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: ''
    };

    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleInputChange(event, key) {
    this.setState({
      [key]: event.target.value
    });
  }

  handleSubmit(event) {
    // This prevents a '?' from being appended to the URL
    event.preventDefault();
    this.props.handleLogin(this.state.email, this.state.password);
  }

  render() {
    return (
      <Form
        pad='small'
        plain={true}>
        <fieldset>
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
        </fieldset>
        <Footer>
          <Button
            label='Login'
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

export default Login;
