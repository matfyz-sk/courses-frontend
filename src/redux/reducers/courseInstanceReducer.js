import { SET_COURSE_INSTANCE } from '../types'

const initialState = {
  courseInstance: null,
}

export default function courseInstanceReducer(state = initialState, action) {
  switch (action.type) {
    case SET_COURSE_INSTANCE:
      return {
        ...state,
        courseInstance: action.item,
      }
    default:
      return state
  }
}
