import quizReducers from './quizReducers'
import assignmentsReducers from './assignmentsReducers'
import userReducer from './userReducer'

export default {
  ...quizReducers,
  ...assignmentsReducers,
  userReducer,
}
