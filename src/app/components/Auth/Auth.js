import React from 'react';
import { Tab, Tabs } from 'react-toolbox/lib/tabs';
import Input from 'react-toolbox/lib/input';
import Button from 'react-toolbox/lib/button';
import styles from './Auth.css';

class Auth extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            index: 0,
            email: '',
            password: ''
        };

        this.handleTabChange = this.handleTabChange.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
    }

    handleTabChange(newIndex) {
        this.setState({
            index: newIndex
        });
    }

    handleInputChange(event, key) {
        this.setState({
            [key]: event
        });
    }

    render() {
        var login = (
            <div>
                <h2>Login</h2>
                <Input
                    type="text"
                    label="Email"
                    value={this.state.email}
                    onChange={(event) => {
                        this.handleInputChange(event, 'email');
                    }}/>
                <Input
                    type="text"
                    label="Password"
                    value={this.state.password}
                    onChange={(event) => {
                        this.handleInputChange(event, 'password');
                    }}/>
                <Button label='Login' onClick={() => {
                    this.props.handleLogin(this.state.email, this.state.password);
                }}/>
            </div>
        );

        var register = (
            <div>
                <h2>Register</h2>
                <Input
                    type="text"
                    label="Email"
                    value={this.state.email}
                    onChange={(event) => {
                        this.handleInputChange(event, 'email');
                    }}/>
                <Input
                    type="text"
                    label="Password"
                    value={this.state.password}
                    onChange={(event) => {
                        this.handleInputChange(event, 'password');
                    }}/>
                <Button label='Register' onClick={() => {
                    this.props.handleRegister(this.state.email, this.state.password);
                }}/>
            </div>
        );

        return (
            <div className={styles.authBackground}>
                <div className={styles.authMain}>
                    <div className={styles.auth}>
                        <Tabs index={this.state.index} onChange={(event) => {
                            this.handleTabChange(event);
                        }}>
                            <Tab label="Login">
                                {login}
                            </Tab>
                            <Tab label="Register">
                                {register}
                            </Tab>
                        </Tabs>
                    </div>
                    <Button
                        label="Cancel"
                        className={styles.authCancelButton}
                        onClick={() => {
                            this.props.authCancelled();
                        }}/>
                </div>
            </div>
        );
    }
}

export default Auth;
