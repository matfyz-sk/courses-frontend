import { SET_USER, SET_USER_ADMIN, SET_SIGNED_IN } from '../types'

const initialState = {
  isAdmin: false,
  isSignedIn: true,
  user: null,
}

export default function userReducer(state = initialState, action) {
  switch (action.type) {
    case SET_USER:
      return {
        ...state,
        user: action.item.value,
      }
    case SET_USER_ADMIN:
      return {
        ...state,
        isAdmin: action.isAdmin,
      }
    case SET_SIGNED_IN:
      return {
        ...state,
        isSignedIn: action.isSignedIn,
      }
    default:
      return state
  }
}
