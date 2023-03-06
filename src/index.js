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
import { ApolloProvider } from '@apollo/client';
import { ApolloClient, InMemoryCache} from '@apollo/client/core';

// eslint-disable-next-line no-underscore-dangle
const initialState = window.__INITIAL_STATE__;
export const store = createStore(reducers, initialState);

const client = new ApolloClient({    uri: "http://localhost:3010/graphql",    cache: new InMemoryCache()})

ReactDOM.render(
  <ApolloProvider client={client}>
    <Provider store={store}>
      <Router />
    </Provider>
  </ApolloProvider>,
  document.getElementById('root')
);

serviceWorker.unregister();
