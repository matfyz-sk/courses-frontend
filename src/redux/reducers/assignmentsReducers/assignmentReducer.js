import { SET_ASSIGNMENT, SET_REVIEW_PROGRESS } from '../../types'

const initialState = {
  assignment: {},
  assignmentLoaded: false,
  inProgress: 'nic',
}

export default function assignmentsAssignmentReducer(
  state = initialState,
  action
) {
  switch (action.type) {
    case SET_ASSIGNMENT: {
      return {
        ...state,
        assignment: action.assignment,
        assignmentLoaded: true,
      }
    }
    case SET_REVIEW_PROGRESS: {
      return { ...state, inProgress: true }
    }
    case 'LOGOUT': {
      return initialState
    }
    default: {
      return state
    }
  }
}
