import {
  SET_TEACHER_NAV,
  UNSET_TEACHER_NAV,
  SET_TEACHER_NAV_CURRENT,
} from '../types'

const initialState = {
  menu: [],
  current: null,
}

export default function teacherNavReducer(state = initialState, action) {
  switch (action.type) {
    case SET_TEACHER_NAV:
      return {
        ...state,
        menu: action.item,
      }
    case SET_TEACHER_NAV_CURRENT:
      return {
        ...state,
        current: action.item,
      }
    case UNSET_TEACHER_NAV:
      return {
        ...state,
        menu: [],
        current: null,
      }
    default:
      return state
  }
}
