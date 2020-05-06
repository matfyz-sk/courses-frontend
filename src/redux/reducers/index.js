import quizReducers from './quizReducers'
import assignmentsReducers from './assignmentsReducers'
import userReducer from './userReducer'
import authReducer from './authReducer'
import navReducer from './navigationReducer'
import courseInstanceReducer from './courseInstanceReducer'
import privilegesReducer from './privilegesReducer'
import teamReducers from './teamReducers'
import courseMigrationReducer from './courseMigrationReducer'
import teacherNavReducer from './teacherNavReducer'

export default {
  ...quizReducers,
  ...assignmentsReducers,
  userReducer,
  authReducer,
  navReducer,
  courseInstanceReducer,
  courseMigrationReducer,
  privilegesReducer,
  ...teamReducers,
  teacherNavReducer,
}
