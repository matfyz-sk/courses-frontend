import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import createStore from './redux/store';
import * as serviceWorker from './serviceWorker';
import Router from "./Router";
import 'bootstrap/dist/css/bootstrap.min.css';
import './scss/index.scss';
import reducers from './redux/reducers/index';
const initialState = window.__INITIAL_STATE__;
export const store = createStore(reducers, initialState);

ReactDOM.render(
      <Provider store={store}>
          <Router/>
      </Provider>
    , document.getElementById('root'));
serviceWorker.unregister();
