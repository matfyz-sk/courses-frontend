import quizReducers from './quizReducers'
import assignmentsReducers from './assignmentsReducers'
import userReducer from './userReducer'
import authReducer from './authReducer'
import navReducer from './navigationReducer'
import courseInstanceReducer from './courseInstanceReducer'
import privilegesReducer from './privilegesReducer'

export default {
  ...quizReducers,
  ...assignmentsReducers,
  userReducer,
  authReducer,
  navReducer,
  courseInstanceReducer,
  privilegesReducer,
}
