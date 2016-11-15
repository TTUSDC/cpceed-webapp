import React from 'react'
import { Link } from 'react-router'

class Nav extends React.Component {
    render() {
        return (
            <div>
                <h1>Guest</h1>
                <ul>
                  <li><Link to="Guest/Login/">Login</Link></li>
                  <li><Link to="Guest/Register/">Register</Link></li>
                </ul>
            </div>
        )
    }
}

module.exports = Nav
