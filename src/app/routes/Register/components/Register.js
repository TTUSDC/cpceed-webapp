import React from 'react'

class Register extends React.Component {
    render() {
        return (
            <div>
                <h2>Register</h2>
                <form>
                    Name<br/>
                    <input type="text" name="name"/>
                    <br/>
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

export default Register;
