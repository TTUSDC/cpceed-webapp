import React from 'react';

import Layer from 'grommet/components/Layer';
import Tabs from 'grommet/components/Tabs';
import Tab from 'grommet/components/Tab';
import Form from 'grommet/components/Form';
import FormField from 'grommet/components/FormField';
import TextInput from 'grommet/components/TextInput';
import Select from 'grommet/components/Select';
import Footer from 'grommet/components/Footer';
import Button from 'grommet/components/Button';

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
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleTabChange(newIndex) {
        this.setState({
            index: newIndex
        });
    }

    handleInputChange(event, key) {
        this.setState({
            [key]: event.target.value
        });
    }

    handleSubmit(event, key) {
        event.preventDefault();

        if(key === 'login') {
            this.props.handleLogin(this.state.email, this.state.password);
        } else {
            this.props.handleRegister(this.state.email, this.state.password);
        }
    }

    render() {
        var login = (
            <Tab title='Login'>
                <Form
                    pad='small'
                    plain={true}
                    onSubmit={(event) => {
                        this.handleSubmit(event, 'login');
                    }}>
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
                                this.handleSubmit(event, 'login');
                            }}/>
                    </Footer>
                </Form>
            </Tab>
        );

        var register = (
            <Tab title='Register'>
                <Form
                    pad='small'
                    plain={true}
                    onSubmit={(event) => {
                        this.handleSubmit(event, 'register');
                    }}>
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
                            label='Register'
                            type='submit'
                            primary={true}
                            onClick={(event) => {
                                this.handleSubmit(event, 'register');
                            }}/>
                    </Footer>
                </Form>
            </Tab>
        );

        return (
            <Layer
                closer={true}
                flush={false}
                align='center'
                onClose={() => {
                    this.props.authCancelled();
                }}>
                <Tabs
                    activeIndex={this.state.index}
                    justify='center'
                    responsive={false}
                    onActive={(event) => {
                        this.handleTabChange(event);
                    }}>
                    {login}
                    {register}
                </Tabs>
            </Layer>
        );
    }
}

export default Auth;
