import { AUTH_ACTIONS } from '../types/authTypes';

const initialState = {
  user: null,
  _token: null,
};

export default function authReducer(state = initialState, action) {
  switch(action.type) {
    case AUTH_ACTIONS.SET_TOKEN:
      return {
        ...state,
        _token: action.item.value,
      };
    case AUTH_ACTIONS.SET_USER:
      return {
        ...state,
        user: action.item.value,
      };
    case AUTH_ACTIONS.LOGOUT:
      return initialState;
    default:
      return state;
  }
}
