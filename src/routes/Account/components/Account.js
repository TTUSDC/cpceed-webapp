import React from 'react';

import Tabs from 'grommet/components/Tabs';
import Tab from 'grommet/components/Tab';

import RequireAuth from 'components/Auth/RequireAuth.js';
import ProfileContainer from './ProfileContainer.js';
import SecurityContainer from './SecurityContainer.js';

class Account extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      index: 0
    };

    this.handleTabChange = this.handleTabChange.bind(this);
  }

  handleTabChange(newIndex) {
    this.setState({
      index: newIndex
    });
  }

  render() {
    return (
      <Tabs
        activeIndex={this.state.index}
        justify='center'
        responsive={false}
        onActive={(event) => {
          this.handleTabChange(event);
        }}>
        <Tab title='Profile'>
          <ProfileContainer />
        </Tab>
        <Tab title='Security'>
          <SecurityContainer />
        </Tab>
      </Tabs>
    );
  }
}

const requiredState = {
  viewAccount: true
};

// The permissions object is passed as the second argument to RequireAuth
export default RequireAuth(Account, requiredState);
