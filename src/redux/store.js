import { applyMiddleware, combineReducers, compose, createStore } from 'redux';
import ReduxThunk from 'redux-thunk';

import userReducer from './reducers/userReducer';
import exampleReducer from './reducers/exampleReducer';




const reducers = combineReducers({
    userReducer,
    exampleReducer,
  });

const enhancers = compose(
  applyMiddleware(ReduxThunk)
);


export default () => createStore(reducers, {}, enhancers);
