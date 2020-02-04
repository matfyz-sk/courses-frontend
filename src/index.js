import React from 'react';
import ReactDOM from 'react-dom';

import 'bootstrap/dist/css/bootstrap.min.css';
import './scss/index.scss';

import { Provider } from 'react-redux';
import createStore from './redux/store';

import App from './components/App';
import Firebase, { FirebaseContext } from './components/Firebase';

import * as serviceWorker from './serviceWorker';


const store = createStore();

ReactDOM.render(
    <FirebaseContext.Provider value={new Firebase()}>
        <Provider store={store}>
            <App/>
        </Provider>
    </FirebaseContext.Provider>,
    document.getElementById('root')
);

serviceWorker.unregister();
