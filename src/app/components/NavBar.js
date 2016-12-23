import React from 'react';
import { Link } from 'react-router';
import styles from './NavBar.scss';

class Nav extends React.Component {
    render() {
        return (
            <div className={styles.test}>
                <h1>Navigation Bar</h1>
                <ul>
                    <li><Link to="/login/">Login</Link></li>
                    <li><Link to="/register/">Register</Link></li>
                </ul>
                {this.props.children}
            </div>
        );
    }
}

module.exports = Nav;
