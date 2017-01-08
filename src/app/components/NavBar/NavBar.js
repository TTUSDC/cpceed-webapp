import React from 'react';
import AppBar from 'react-toolbox/lib/app_bar';
import Navigation from 'react-toolbox/lib/navigation';
import Button from 'react-toolbox/lib/button';
import theme from './NavBar.scss';
import AuthContainer from '../Auth/AuthContainer.js';

class NavBar extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            auth: false
        };

        this.renderAuth = this.renderAuth.bind(this);
        this.authFinished = this.authFinished.bind(this);
    }

    renderAuth() {
        this.setState({
            auth: true
        });
    }

    authFinished() {
        this.setState({
            auth: false
        });
    }

    render() {
        var authView = null;
        if(this.state.auth === true) {
            authView = (
                <AuthContainer
                    authFinished={this.authFinished}
                    authCancelled={this.authFinished} />
            );
        }

        return (
            <div>
                <AppBar theme={theme}>
                    <Navigation type='horizontal'>
                        <Button label='Events' onClick={() => {
                            this.props.navigate('events/');
                        }}/>
                        <Button label='Activity' onClick={() => {
                            this.props.navigate('activity/');
                        }}/>
                        <Button label='Sign In' onClick={() => {
                            this.renderAuth();
                        }}/>
                    </Navigation>
                </AppBar>
                {authView}
            </div>
        );
    }
}

export default NavBar;
