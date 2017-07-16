import React from 'react';
import { render } from 'react-dom';
import { AppContainer } from 'react-hot-loader';

// Ensures that Grommet styles are applied to the entire app
import 'styles/grommet.scss';
import App from './App.jsx';

render(
  <AppContainer>
    <App />
  </AppContainer>,
  document.getElementById('app'),
);

if (module.hot) {
  module.hot.accept('./App.jsx', () => {
    const NextApp = require('./App.jsx').default;
    render(
      <AppContainer>
        <NextApp />
      </AppContainer>,
      document.getElementById('app'),
    );
  });
}
