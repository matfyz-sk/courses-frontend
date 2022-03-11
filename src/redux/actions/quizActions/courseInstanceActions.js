import axios from 'axios'

import { API_URL } from '../../../configuration/api'
import { SET_TOPICS_DATA } from '../../types'

export const getTopics = (id, joins, token) => {
  return dispatch => {
    return axios
      .get(
        `${ API_URL }/topic/${ id }${
          joins && joins.length
            ? `?_join=${ joins.map(join => join).join() }`
            : ``
        }`,
        {
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: token,
          },
        }
      )
      .then(({data}) => {
        dispatch({type: SET_TOPICS_DATA, data})
      })
      .catch(error => console.log(error))
  }
}

export const getAgents = (courseInstanceId, token) => {
  return dispatch => {
    return axios
      .get(`${ API_URL }/user${ `?studentOf=${ courseInstanceId }` }`, {
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: token,
        },
      })
      .then(({data}) => {
        dispatch({type: SET_TOPICS_DATA, data})
      })
      .catch(error => console.log(error))
  }
}
