import quizExampleReducers from './quizExampleReducers';
import assignmentsReducers from './assignmentsReducers';
import userReducer from './userReducer';
import {authReducer} from './authReducer';

export default {
  ...quizExampleReducers,
  ...assignmentsReducers,
  authReducer,
  userReducer
}
