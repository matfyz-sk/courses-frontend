import { SET_ASIGNMENTS_STUDENT_TEAMS } from '../../types'

const initialState = {
  teams:[],
  teamsLoaded: false,
};

export default function assignmentsTestFileReducer(state = initialState, action) {
  switch (action.type) {
    case SET_ASIGNMENTS_STUDENT_TEAMS:{
      return {
        ...state,
        teams: action.teams,
        teamsLoaded:true
      };
    }
    default:{
      return state;
    }
  }
}
