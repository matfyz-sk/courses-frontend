import { SET_USER_ADMIN, SET_SIGNED_IN } from '../types'

const initialState = {
  isAdmin: false,
  isSignedIn: true,
};

export default function userReducer(state = initialState, action) {
  switch (action.type) {
    case SET_USER_ADMIN:
      return {
        ...state,
        isAdmin: action.isAdmin
      };
    case SET_SIGNED_IN:
      return {
        ...state,
        isSignedIn: action.isSignedIn
      };
    default:
      return state;
  }
}
