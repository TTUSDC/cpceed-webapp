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

export default RequireAuth(Activity);
