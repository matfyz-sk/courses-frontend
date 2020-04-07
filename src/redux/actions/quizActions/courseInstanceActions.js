import axios from 'axios'

import apiConfig from '../../../configuration/api'
import { SET_COURSE_INSTANCE_DATA, SET_TOPICS_DATA } from '../../types'

export const getCourseInstance = (id, joins, token) => {
  return dispatch => {
    return axios
      .get(
        `${apiConfig.API_URL}/courseInstance/${id}${
          joins && joins.length
            ? `?_join=${joins.map(join => join).join()}`
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
      .then(({ data }) => {
        dispatch({ type: SET_COURSE_INSTANCE_DATA, data })
      })
      .catch(error => console.log(error))
  }
}

export const getTopics = (id, joins, token) => {
  return dispatch => {
    return axios
      .get(
        `${apiConfig.API_URL}/topic/${id}${
          joins && joins.length
            ? `?_join=${joins.map(join => join).join()}`
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
      .then(({ data }) => {
        dispatch({ type: SET_TOPICS_DATA, data })
      })
      .catch(error => console.log(error))
  }
}

export const getAgents = (courseInstanceId, token) => {
  return dispatch => {
    return axios
      .get(`${apiConfig.API_URL}/user${`?studentOf=${courseInstanceId}`}`, {
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: token,
        },
      })
      .then(({ data }) => {
        dispatch({ type: SET_TOPICS_DATA, data })
      })
      .catch(error => console.log(error))
  }
}
