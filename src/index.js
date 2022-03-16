import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import createStore from './redux/store';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-datepicker/dist/react-datepicker.css';
import './scss/index.scss';
import * as serviceWorker from './serviceWorker';
import reducers from './redux/reducers';
import Router from './router';

// eslint-disable-next-line no-underscore-dangle
const initialState = window.__INITIAL_STATE__;
export const store = createStore(reducers, initialState);

ReactDOM.render(
  <Provider store={store}>
    <Router />
  </Provider>,
  document.getElementById('root')
);

serviceWorker.unregister();
