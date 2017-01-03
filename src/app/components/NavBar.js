import React from 'react'
import { withRouter } from 'react-router'
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
                        {/* Navigate by pushing changes to router */}
                        <Button label='Register' onClick={() => {
                            this.props.router.push('/register/');
                        }}/>
                        <Button label='Login' onClick={() => {
                            this.props.router.push('/login/');
                        }}/>
                    </Navigation>
                </AppBar>
                {this.props.children}
            </div>
        );
    }
}

export default withRouter(Nav);
