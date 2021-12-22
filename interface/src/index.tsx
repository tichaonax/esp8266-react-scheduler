import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';

import { BrowserRouter } from 'react-router-dom';
import { store } from "./project/automation/redux/store";
import { setProxy } from './project/automation/redux/actions/proxy';

import App from './App';
import { RemoteUtils } from './project/automation/utils/remoteUtils';

store.dispatch(setProxy(RemoteUtils.getProxy()));

ReactDOM.render((
  <Provider store={store}>
    <React.StrictMode>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </React.StrictMode>
  </Provider>),document.getElementById('root')
);
