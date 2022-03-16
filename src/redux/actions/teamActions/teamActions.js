import { TEAM_ACTIONS } from '../../types'
import { authHeader } from '../../../components/Auth'
import { BACKEND_URL } from "../../../constants";

export const setTeam = item => ({
  type: TEAM_ACTIONS.SET_TEAM,
  item,
})

export const destroyTeam = {
  type: TEAM_ACTIONS.DESTROY_TEAM,
}

export const fetchTeam = team_id => {
  return dispatch => {
    fetch(`${BACKEND_URL}/data/team?id=${team_id}`, {
      method: 'GET',
      headers: authHeader(),
      mode: 'cors',
      credentials: 'omit',
    })
      .then(response => {
        if (!response.ok) throw new Error(response)
        else return response.json()
      })
      .then(data => {
        if (data['@graph'].length > 0) {
          const team = data['@graph'][0]
          dispatch(setTeam(team))
        }
      })
  }
}
