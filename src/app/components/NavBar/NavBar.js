import React from 'react';
import AppBar from 'react-toolbox/lib/app_bar';
import Navigation from 'react-toolbox/lib/navigation';
import Button from 'react-toolbox/lib/button';
import theme from './NavBar.scss';

class NavBar extends React.Component {
    render() {
        return (
            <AppBar theme={theme}>
                <Navigation type='horizontal'>
                    <Button label='Register' onClick={() => {
                        this.props.navigate('register/');
                    }}/>
                    <Button label='Login' onClick={() => {
                        this.props.navigate('login/');
                    }}/>
                </Navigation>
            </AppBar>
        );
    }
}

export default NavBar;
