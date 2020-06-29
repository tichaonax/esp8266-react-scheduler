import React from 'react';
import {Provider} from 'react-redux';
import { render } from 'react-dom';
import { Router } from 'react-router';

import history from './history';
import {store} from "./project/automation/redux/store";

import App from './App';

render((
  <Provider store={store}>
    <Router history={history}>
      <App/>
    </Router>
  </Provider>
), document.getElementById("root"))
