import { TEAM_ACTIONS } from '../../types'

const initialState = {
  team: null,
}

export default function teamReducer(state = initialState, action) {
  switch (action.type) {
    case TEAM_ACTIONS.SET_TEAM:
      return {
        ...state,
        team: action.item,
      }
    case TEAM_ACTIONS.DESTROY_TEAM:
      return {
        ...state,
        team: null,
      }
    default:
      return state
  }
}
