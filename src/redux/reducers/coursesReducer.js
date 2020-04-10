import { SET_COURSE, SET_COURSES } from '../types'

const initialState = {
  course: {},
  courses: [],
}

export default function coursesReducer(state = initialState, action) {
  switch (action.type) {
    case SET_COURSE:
      return {
        ...state,
        course: action.course,
      }
    case SET_COURSES:
      return {
        ...state,
        courses: action.courses,
      }
    default:
      return state
  }
}
