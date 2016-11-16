import React from 'react'
import { Link } from 'react-router'

class Login extends React.Component {
    render() {
        return (
            <div>
                <h2>Login</h2>
                <form>
                    Username<br/>
                    <input type="text" name="username"/>
                    <br/>
                    Password<br/>
                    <input type="text" name="password"/>
                </form>
            </div>
        )
    }
}

module.exports = Login
