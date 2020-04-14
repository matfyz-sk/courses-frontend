import quizReducers from './quizReducers';
import assignmentsReducers from './assignmentsReducers';
import userReducer from './userReducer';
import coursesReducer from './coursesReducer';
import authReducer from './authReducer';
import navReducer from './navigationReducer';

export default {
  ...quizReducers,
  ...assignmentsReducers,
  userReducer,
  coursesReducer,
  authReducer,
  navReducer,
};
