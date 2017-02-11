import React from 'react';

import RequireAuth from 'components/Auth/RequireAuth.js';

class Activity extends React.Component {
    render() {
        return (
            <div>
                <h2>Activity</h2>
            </div>
        );
    }
}

// Defining the permissions required to access this component
const requiredState = {
    viewActivity: true
};

export default RequireAuth(Activity, requiredState);
