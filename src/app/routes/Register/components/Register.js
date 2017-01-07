import React from 'react';
import Input from 'react-toolbox/lib/input';
import Button from 'react-toolbox/lib/button';

class Register extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            email: '',
            password: ''
        };

        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(event, key) {
        this.setState({
            [key]: event
        });
    }

    render() {
        return (
            <div>
                <h2>Register</h2>
                <Input
                    type="text"
                    label="Email"
                    value={this.state.email}
                    onChange={(event) => {
                        this.handleChange(event, 'email')
                    }}/>
                <Input
                    type="text"
                    label="Password"
                    value={this.state.password}
                    onChange={(event) => {
                        this.handleChange(event, 'password')
                    }}/>
                <Button label='Submit' onClick={() => {
                    this.props.handleSubmit(this.state.email, this.state.password);
                }}/>
            </div>
        )
    }
}

export default Register;
