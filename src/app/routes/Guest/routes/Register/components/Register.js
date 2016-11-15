import React from 'react'
import { Link } from 'react-router'

class Register extends React.Component {
    render() {
        return (
            <div>
                <form>
                    Username:<br><input type="text" name="username"/></br>
                    Password:<br><input type="text" name="password"/></br>
                </form>
            </div>
        )
    }
}

module.exports = Register
