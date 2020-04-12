import axios from 'axios'
import {
  SET_USER_ADMIN,
  SET_SIGNED_IN,
  SET_USER,
} from '../types'
import apiConfig from '../../configuration/api'

export const setUser = user => {
  return dispatch => {
    dispatch({ type: SET_USER, user })
  }
}

export const setUserAdmin = isAdmin => {
  return dispatch => {
    dispatch({ type: SET_USER_ADMIN, isAdmin })
  }
}

export const setSignedInUser = isSignedIn => {
  return dispatch => {
    dispatch({ type: SET_SIGNED_IN, isSignedIn })
  }
}

export const fetchUser = (token, userId) => {
  return dispatch => {
    return axios
      .get(`${apiConfig.API_URL}/user/${userId}`, {
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: token,
        },
      })
      .then(({ data }) => {
        if (
          data &&
          data['@graph'] &&
          data['@graph'].length &&
          data['@graph'].length > 0
        ) {
          const user = data['@graph'].map(userData => {
            return {
              id: userData['@id'].substring(userData['@id'].length - 5),
              name: userData.name,
              enrolled: userData.studentOf,
              requested: userData.requests,
              instructorOf: userData.instructorOf,
              admin: false,
              firstName: userData.firstName,
              lastName: userData.lastName,
              nickname: userData.nickname,
            }
          })[0]
          dispatch({ type: SET_USER, user })
        }
      })
      .catch(error => console.log(error))
  }
}
