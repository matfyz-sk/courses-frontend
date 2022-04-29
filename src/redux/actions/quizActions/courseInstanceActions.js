import axios from 'axios'

import { SET_TOPICS_DATA } from '../../types'
import { API_URL } from "../../../constants";

export const getTopics = (id, joins, token) => {
  return dispatch => {
    return axios
      .get(
        `${ API_URL }topic/${ id }${
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
      .get(`${ API_URL }user${ `?studentOf=${ courseInstanceId }` }`, {
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
