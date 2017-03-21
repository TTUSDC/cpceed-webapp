import React from 'react';
import {withRouter} from 'react-router';

import Box from 'grommet/components/Box';
import Header from 'grommet/components/Header';
import Button from 'grommet/components/Button';

import RequireAuth from 'components/Auth/RequireAuth.js';

class Account extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      index: 0
    };

    this.handleTabChange = this.handleTabChange.bind(this);
    this.navigate = this.navigate.bind(this);
  }

  handleTabChange(newIndex) {
    this.setState({
      index: newIndex
    });
  }

  navigate(url) {
    this.props.router.push(url);
  }

  render() {
    return (
      <div>
        <Header fixed={false} size='medium'>
          <Box
            justify='center'
            flex={true}
            direction='row'
            responsive={false}
            pad={{between: "small"}}>
            <Button
              label='Profile'
              primary={false}
              onClick={() => {this.navigate('/account/profile')}}/>
            <Button
              label='Security'
              primary={false}
              onClick={() => {this.navigate('/account/security')}}/>
          </Box>
        </Header>
        <Box
          flex={true}
          align='center'
          size={{width: 'full'}}>
          {this.props.children}
        </Box>
      </div>
    );
  }
}

const requiredState = {
  viewAccount: true
};

// The permissions object is passed as the second argument to RequireAuth
export default withRouter(RequireAuth(Account, requiredState));
