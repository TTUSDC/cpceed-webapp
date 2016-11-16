import React from 'react'
import { Link } from 'react-router'

class Nav extends React.Component {
    render() {
        return (
            <div>
                <h1>Navigation Bar</h1>
                <ul>
                  <li><Link to="/login/">Login</Link></li>
                  <li><Link to="/register/">Register</Link></li>
                </ul>
                {this.props.children}
            </div>
        )
    }
}

module.exports = Nav
