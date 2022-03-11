import { TEAM_ACTIONS } from '../../types'

const initialState = {
  teamInstance: null,
  users: [],
}

export default function teamInstanceReducer(state = initialState, action) {
  switch(action.type) {
    case TEAM_ACTIONS.SET_TEAM_INSTANCE:
      return {
        ...state,
        teamInstance: action.item,
      }
    case TEAM_ACTIONS.SET_TEAM_INSTANCE_USERS:
      return {
        ...state,
        users: action.item,
      }
    case TEAM_ACTIONS.DESTROY_TEAM_INSTANCE:
      return {
        ...state,
        teamInstance: null,
      }
    default:
      return state
  }
}
