import React from 'react';
import ReactDOM from 'react-dom';

import 'bootstrap/dist/css/bootstrap.min.css';
import './scss/index.scss';

import { Provider } from 'react-redux';
import createStore from './redux/store';

import App from './components/App';

import * as serviceWorker from './serviceWorker';


const store = createStore();

ReactDOM.render(
    <Provider store={store}>
        <App/>
    </Provider>,
    document.getElementById('root')
);

serviceWorker.unregister();
