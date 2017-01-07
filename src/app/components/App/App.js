import React from 'react';
import NavBarContainer from '../NavBar/NavBarContainer.js';

class App extends React.Component {
    render() {
        return (
            <div>
                <NavBarContainer/>
                {this.props.children}
            </div>
        );
    }
}

export default App;
