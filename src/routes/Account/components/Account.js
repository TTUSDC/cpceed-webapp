import React from 'react';

import RequireAuth from 'components/Auth/RequireAuth.js';

class Account extends React.Component {
  render() {
    return (
      <div>
        <h2>Account</h2>
      </div>
    );
  }
}

const requiredState = {
  viewAccount: true
};

// The permissions object is passed as the second argument to RequireAuth
export default RequireAuth(Account, requiredState);
