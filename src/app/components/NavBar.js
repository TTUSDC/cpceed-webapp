import React from 'react'
import { Link, hashHistory } from 'react-router'
import styles from './NavBar.scss'
import AppBar from 'react-toolbox/lib/app_bar'
import Navigation from 'react-toolbox/lib/navigation'
import Button from 'react-toolbox/lib/button'

class Nav extends React.Component {
    render() {
        return (
            <div>
                <AppBar>
                    <Navigation type='horizontal'>
                        {/* Navigate by pushing changes to hashHistory */}
                        <Button label='Register' onClick={() => {
                            hashHistory.push('/register/');
                        }}/>
                        <Button label='Login' onClick={() => {
                            hashHistory.push('/login/');
                        }}/>
                    </Navigation>
                </AppBar>
                {this.props.children}
            </div>
        );
    }
}

module.exports = Nav;
