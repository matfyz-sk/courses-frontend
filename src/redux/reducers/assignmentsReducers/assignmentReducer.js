import { SET_ASSIGNMENT } from '../../types'

const initialState = {
  assignment: {},
  assignmentLoaded: false,
};

export default function assignmentsAssignmentReducer(state = initialState, action) {
  switch (action.type) {
    case SET_ASSIGNMENT:{
      return {
        ...state,
        assignment: action.assignment,
        assignmentLoaded: true
      };
    }
    case 'LOGOUT':{
      return initialState;
    }
    default:{
      return state;
    }
  }
}
