import { SET_COURSE } from '../types'

const initialState = {
  course: {},
}

export default function coursesReducer(state = initialState, action) {
  switch (action.type) {
    case SET_COURSE:
      return {
        ...state,
        course: action.course,
      }
    default:
      return state
  }
}
