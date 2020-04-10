import quizReducers from './quizReducers'
import assignmentsReducers from './assignmentsReducers'
import userReducer from './userReducer'
import coursesReducer from './coursesReducer'

export default {
  ...quizReducers,
  ...assignmentsReducers,
  userReducer,
  coursesReducer,
}
