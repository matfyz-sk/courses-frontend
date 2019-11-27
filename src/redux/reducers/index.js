import quizExampleReducers from './quizExampleReducers';
import assignmentsReducers from './assignmentsReducers';
import userReducer from './userReducer';

export default {
  ...quizExampleReducers,
  ...assignmentsReducers,
  userReducer
}
