import React from 'react';

import RequireAuth from 'components/Auth/RequireAuth.jsx';

class Activity extends React.Component {
  render() {
    return (
      <div>
        <h2>Activity</h2>
      </div>
    );
  }
}

/*
  Defining the permissions required to access this component. This is a
  JavaScript object, so it consists of comma separated key-value pairs.
  The permissions defined here must already be defined in
  `src/redux/actions.js`. But you do not have to use all permissions
  defined in `actions.js`, just a subset that fits your situation.
*/
const requiredState = {
  viewActivity: true,
};

// The permissions object is passed as the second argument to RequireAuth
export default RequireAuth(Activity, requiredState);
