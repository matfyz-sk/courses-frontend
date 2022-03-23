import { SET_ASSIGNMENT, SET_REVIEW_PROGRESS } from '../../types'

export const assignmentsLoadAssignment = () => {
  return dispatch => {
    dispatch({ type: SET_ASSIGNMENT, assignment: {} })
  }
}

export const setReviewProgress = () => {
  return dispatch => {
    dispatch({ type: SET_REVIEW_PROGRESS })
  }
}
