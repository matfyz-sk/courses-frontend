import { TEAM_ACTIONS } from '../../types'
import { authHeader } from '../../../components/Auth'
import { BACKEND_URL } from "../../../constants";

export const setTeamInstance = item => ({
  type: TEAM_ACTIONS.SET_TEAM_INSTANCE,
  item,
})

export const setTeamInstanceUsers = item => ({
  type: TEAM_ACTIONS.SET_TEAM_INSTANCE_USERS,
  item,
})

export const destroyTeamInstance = {
  type: TEAM_ACTIONS.DESTROY_TEAM_INSTANCE,
}

export const fetchTeamInstance = teamInstance_id => {
  return dispatch => {
    fetch(`${BACKEND_URL}data/teamInstance/${teamInstance_id}`, {
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
          const teamInstance = data['@graph'][0]
          dispatch(setTeamInstance(teamInstance))
          fetch(`${BACKEND_URL}data/user?memberOf=${teamInstance_id}`, {
            method: 'GET',
            headers: authHeader(),
            mode: 'cors',
            credentials: 'omit',
          })
            .then(response => {
              if (!response.ok) throw new Error(response)
              else return response.json()
            })
            .then(data2 => {
              if (data2['@graph'].length > 0) {
                const users = data2['@graph']
                dispatch(setTeamInstanceUsers(users))
              }
            })
        }
      })
  }
}
