import {
  SET_COURSE_MIGRATION_STATE,
  SET_COURSE_MIGRATION_STARTDATE,
  SET_COURSE_MIGRATION_ENDDATE,
  SET_COURSE_MIGRATION_INSTRUCTORS,
  SET_COURSE_MIGRATION_CHECKED_EVENTS,
  SET_COURSE_MIGRATION_ALL_EVENTS,
} from '../types'

const initialState = {
  initialized: false,
  course: [],
  startDate: new Date(),
  endDate: new Date(),
  name: '',
  description: '',
  instructors: [],
  allEvents: [],
  checkedEvents: [],
  assignments: [],
  quizzes: [],
}

export default function courseMigrationReducer(state = initialState, action) {
  switch (action.type) {
    case SET_COURSE_MIGRATION_STATE:
      return {
        ...action.item,
      }
    case SET_COURSE_MIGRATION_STARTDATE:
      return {
        ...state,
        startDate: action.item,
      }
    case SET_COURSE_MIGRATION_ENDDATE:
      return {
        ...state,
        endDate: action.item,
      }
    case SET_COURSE_MIGRATION_INSTRUCTORS:
      return {
        ...state,
        instructors: action.item,
      }
    case SET_COURSE_MIGRATION_CHECKED_EVENTS:
      return {
        ...state,
        checkedEvents: action.item,
      }
    case SET_COURSE_MIGRATION_ALL_EVENTS:
      return {
        ...state,
        allEvents: action.item,
      }
    default:
      return state
  }
}
