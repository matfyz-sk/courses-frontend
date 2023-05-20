import { applyMiddleware, combineReducers, compose, createStore } from 'redux'
import ReduxThunk from 'redux-thunk'

import allReducers from './reducers'
import { userApi } from 'services/user'
import { courseApi } from 'services/course'
import { eventApi } from 'services/event'
import { resultApi } from 'services/result'
import { teamApi } from 'services/team'
import { documentsApi } from 'services/documents'
import { authApi } from 'services/auth'
import { assignmentApi } from 'services/assignments'
import { assignmentGraphApi } from 'services/assignmentsGraph'
import { teamGraphApi } from 'services/teamGraph'
import { courseTmpApi } from 'services/courseTmp'

const reducers = combineReducers({
  ...allReducers,
  [userApi.reducerPath]: userApi.reducer,
  [courseApi.reducerPath]: courseApi.reducer,
  [eventApi.reducerPath]: eventApi.reducer,
  [resultApi.reducerPath]: resultApi.reducer,
  [teamApi.reducerPath]: teamApi.reducer,
  [documentsApi.reducerPath]: documentsApi.reducer,
  [authApi.reducerPath]: authApi.reducer,
  [assignmentApi.reducerPath]: assignmentApi.reducer,
  [assignmentGraphApi.reducerPath]: assignmentGraphApi.reducer,
  [teamGraphApi.reducerPath]: teamGraphApi.reducer,
  [courseTmpApi.reducerPath]: courseTmpApi.reducer,
})

const composeEnhancers =
  typeof window === 'object' && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
    ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({
        trace: true,
        traceLimit: 25,
        // Specify extension’s options like name, actionsBlacklist, actionsCreators, serialize...
      })
    : compose

const enhancers = composeEnhancers(compose(
  applyMiddleware(
    ReduxThunk, 
    userApi.middleware, 
    courseApi.middleware, 
    eventApi.middleware, 
    resultApi.middleware,
    teamApi.middleware,
    documentsApi.middleware,
    authApi.middleware,
    assignmentApi.middleware,
    assignmentGraphApi.middleware,
    teamGraphApi.middleware,
    courseTmpApi.middleware,
  )
))

export default () => createStore(reducers, {}, enhancers)
