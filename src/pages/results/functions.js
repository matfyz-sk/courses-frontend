import { BACKEND_URL } from '../../configuration/api'
import { authHeader } from '../../components/Auth'
import { getShortID } from '../../helperFunctions'

export const getUsersInCourse = course_id => {
  return fetch(`${BACKEND_URL}/data/user?studentOf=${course_id}`, {
    method: 'GET',
    headers: authHeader(),
    mode: 'cors',
    credentials: 'omit',
  }).then(response => {
    return response.json()
  })
}

export const getResultsUsersInType = type_id => {
  return fetch(
    `${BACKEND_URL}/data/result?type=${type_id}&_join=hasUser,awardedBy`,
    {
      method: 'GET',
      headers: authHeader(),
      mode: 'cors',
      credentials: 'omit',
    }
  ).then(response => {
    return response.json()
  })
}

export const createUserResult = (
  courseInstance,
  hasUser,
  awardedBy,
  type,
  points,
  description = '',
  reference = ''
) => {
  const post = {
    courseInstance,
    hasUser,
    awardedBy,
    type,
    points,
    description,
    reference,
  }
  return fetch(`${BACKEND_URL}/data/result`, {
    method: 'POST',
    headers: authHeader(),
    mode: 'cors',
    credentials: 'omit',
    body: JSON.stringify(post),
  })
    .then(response => {
      return response.json()
    })
    .then(data => {
      if (data.status) {
        return fetch(`${BACKEND_URL}/data/result/${getShortID(data.resource.iri)}`, {
            method: 'PATCH',
            headers: authHeader(),
            mode: 'cors',
            credentials: 'omit',
            body: JSON.stringify({ type }),
          }
        ).then(response => {
          return response.json()
        })
      }
    })
}

export const updateUserResult = data => {
  const { points, description, reference } = data
  const post = { points, description, reference }
  return fetch(`${BACKEND_URL}/data/result/${getShortID(data['@id'])}`, {
    method: 'PATCH',
    headers: authHeader(),
    mode: 'cors',
    credentials: 'omit',
    body: JSON.stringify(post),
  }).then(response => {
    return response.json()
  })
}
