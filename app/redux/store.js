import { createStore } from 'redux';

import cpceedApp from 'redux/reducers.js';

// store holds the redux store that allows app-wide state to be shared
const store = createStore(cpceedApp);

export default store;
