import React from 'react';

import { AuthStates } from 'redux/actions.js';
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

const requiredState = AuthStates.STUDENT;

export default RequireAuth(Activity, requiredState);
