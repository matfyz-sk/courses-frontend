import {
  SET_COURSE_MIGRATION_ALL_EVENTS,
  SET_COURSE_MIGRATION_CHECKED_EVENTS,
  SET_COURSE_MIGRATION_ENDDATE,
  SET_COURSE_MIGRATION_INSTRUCTORS,
  SET_COURSE_MIGRATION_STARTDATE,
  SET_COURSE_MIGRATION_STATE,
} from '../types'

export const setCourseMigrationState = item => {
  return dispatch => {
    dispatch({type: SET_COURSE_MIGRATION_STATE, item})
  }
}


export const setCourseMigrationAllEvents = item => {
  return dispatch => {
    dispatch({type: SET_COURSE_MIGRATION_ALL_EVENTS, item})
  }
}


export const setCourseMigrationEvents = item => {
  return dispatch => {
    dispatch({type: SET_COURSE_MIGRATION_CHECKED_EVENTS, item})
  }
}

export const setCourseMigrationStartDate = item => {
  return dispatch => {
    dispatch({type: SET_COURSE_MIGRATION_STARTDATE, item})
  }
}

export const setCourseMigrationEndDate = item => {
  return dispatch => {
    dispatch({type: SET_COURSE_MIGRATION_ENDDATE, item})
  }
}

export const setCourseMigrationInstructors = item => {
  return dispatch => {
    dispatch({type: SET_COURSE_MIGRATION_INSTRUCTORS, item})
  }
}
