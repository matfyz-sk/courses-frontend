import { BACKEND_URL } from "../../constants";
import { authHeader } from '../../components/Auth'
import { getShortID } from '../../helperFunctions'

export const getUsersInCourse = course_id => {
  return fetch(`${ BACKEND_URL }/data/user?studentOf=${ course_id }`, {
    method: 'GET',
    headers: authHeader(),
    mode: 'cors',
    credentials: 'omit',
  }).then(response => {
    return response.json()
  })
}

export const getAllResultsInCourse = course_id => {
  return fetch(`${ BACKEND_URL }/data/result?courseInstance=${ course_id }`, {
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
    `${ BACKEND_URL }/data/result?type=${ type_id }&_join=hasUser,awardedBy`,
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

export const getUserResult = (id, type = false) => {
  return fetch(
    `${ BACKEND_URL }/data/result/${ id }?_join=hasUser,awardedBy${
      type ? ',type' : ''
    }`,
    {
      method: 'GET',
      headers: authHeader(),
      mode: 'cors',
      credentials: 'omit',
    }).then(response => {
    return response.json()
  })
}

export const getAllUserResults = user_id => {
  return fetch(
    `${ BACKEND_URL }/data/result?hasUser=${ user_id }&_join=awardedBy,type`,
    {
      method: 'GET',
      headers: authHeader(),
      mode: 'cors',
      credentials: 'omit',
    }).then(response => {
    return response.json()
  })
}

export const getUserInCourse = (course_id, user_id) => {
  return fetch(`${ BACKEND_URL }/data/user/${ user_id }?studentOf=${ course_id }`, {
    method: 'GET',
    headers: authHeader(),
    mode: 'cors',
    credentials: 'omit',
  }).then(response => {
    return response.json()
  })
}

export const getResultTypeDetail = type_id => {
  return fetch(
    `${ BACKEND_URL }/data/resultType/${ type_id }?_join=correctionFor`,
    {
      method: 'GET',
      headers: authHeader(),
      mode: 'cors',
      credentials: 'omit',
    }).then(response => {
    return response.json()
  })
}

export const getUserByTypeResult = (user_id, type_id) => {
  return fetch(
    `${ BACKEND_URL }/data/result?hasUser=${ user_id }&type=${ type_id }`,
    {
      method: 'GET',
      headers: authHeader(),
      mode: 'cors',
      credentials: 'omit',
    }).then(response => {
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
  return fetch(`${ BACKEND_URL }/data/result`, {
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
      if(data.status) {
        return fetch(`${ BACKEND_URL }/data/result/${ getShortID(data.resource.iri) }`, {
            method: 'PATCH',
            headers: authHeader(),
            mode: 'cors',
            credentials: 'omit',
            body: JSON.stringify({type}),
          }
        )
          .then(response => {
            return response.json()
          })
          .then(data2 => {
            return getUserResult(getShortID(data2.resource.iri))
          })
      }
    })
}

export const updateUserResult = data => {
  const {points, description, reference} = data
  const post = {points, description, reference}
  return fetch(`${ BACKEND_URL }/data/result/${ getShortID(data['@id']) }`, {
    method: 'PATCH',
    headers: authHeader(),
    mode: 'cors',
    credentials: 'omit',
    body: JSON.stringify(post),
  }).then(response => {
    return response.json()
  })
}

export const removeUserResult = result_id => {
  return fetch(`${ BACKEND_URL }/data/result/${ result_id }`, {
    method: 'DELETE',
    headers: authHeader(),
    mode: 'cors',
    credentials: 'omit',
  }).then(response => {
    return response.json()
  })
}
