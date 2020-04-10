import { applyMiddleware, combineReducers, compose, createStore } from 'redux'
import ReduxThunk from 'redux-thunk'

import allReducers from './reducers'

const reducers = combineReducers({
  ...allReducers,
})

const enhancers = compose(applyMiddleware(ReduxThunk))

export default () => createStore(reducers, {}, enhancers)
