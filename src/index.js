import React from 'react';
import ReactDOM from 'react-dom';
import Navigation from './navigation';
import {BrowserRouter, Route} from 'react-router-dom';
import * as serviceWorker from './serviceWorker';
import 'bootstrap/dist/css/bootstrap.min.css';
import './scss/index.scss';
import loadIcons from './icons';
loadIcons();
ReactDOM.render(
  <BrowserRouter>
    <div>
      <Route path='/' component={Navigation} />
    </div>
  </BrowserRouter>, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
