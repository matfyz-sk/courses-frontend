import { applyMiddleware, combineReducers, compose, createStore } from 'redux'
import ReduxThunk from 'redux-thunk'

import allReducers from './reducers'
import { userApi } from 'services/user'


const reducers = combineReducers({
  ...allReducers,
  [userApi.reducerPath]: userApi.reducer,
})

const composeEnhancers =
  typeof window === 'object' && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
    ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({
        trace: true,
        traceLimit: 25,
        // Specify extension’s options like name, actionsBlacklist, actionsCreators, serialize...
      })
    : compose

const enhancers = composeEnhancers(compose(applyMiddleware(ReduxThunk, userApi.middleware)))

export default () => createStore(reducers, {}, enhancers)
