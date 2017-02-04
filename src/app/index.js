import React from 'react';
import { render } from 'react-dom';

import 'styles/grommet.scss';

import App from './App.js';

const element = document.getElementById('app');
render(<App />, element);
