import React from 'react';
import ReactDOM from 'react-dom';

class Test extends React.Component {
  render() {
    return (
      <div>
        <h1>Testing...Testing...</h1>
      </div>
    );
  }
}

const app = document.getElementById('app');
ReactDOM.render(<Test />, app);
