import React, { useEffect, useState } from 'react'
import { authHeader, getUser } from '../../../components/Auth'
import Page404 from '../../errors/Page404'
import { isVisibleUser } from '../../../components/Auth/userFunction'
import { BACKEND_URL } from "../../../constants";

const withPublic = Component => props => {
  const { user_id } = props.match.params
  const { privilegesReducer } = props
  const [user, setUser] = useState(null)
  const [status, setStatus] = useState(200)
  const [role, setRole] = useState({ color: 'light', name: 'User' })
  const [courses, setCourses] = useState([])
  const [instruct, setInstruct] = useState([])
  const isMyProfile = getUser() && getUser().id === user_id

  function fetchCourses(userData) {
    fetch(`${BACKEND_URL}/data/courseInstance?hasInstructor=${user_id}`, {
      method: 'GET',
      headers: authHeader(),
      mode: 'cors',
      credentials: 'omit',
    })
      .then(response => {
        return response.json()
      })
      .then(data => {
        if (data['@graph'] && data['@graph'].length > 0) {
          setRole({ color: 'primary', name: 'Instructor' })
          if (
            userData.publicProfile ||
            userData.showCourses ||
            isMyProfile ||
            (getUser() && getUser().isSuperAdmin)
          ) {
            setInstruct(data['@graph'])
          }
        }
      })
  }

  function fetchUser() {
    fetch(`${BACKEND_URL}/data/user/${user_id}?_join=studentOf`, {
      method: 'GET',
      headers: authHeader(),
      mode: 'cors',
      credentials: 'omit',
    })
      .then(response => {
        return response.json()
      })
      .then(data => {
        if (data['@graph'] && data['@graph'].length > 0) {
          const userData = data['@graph'][0]
          if (isVisibleUser(userData)) {
            setUser(userData)
            if (userData.isSuperAdmin) {
              setRole({ color: 'warning', name: 'Administrator' })
            } else if (userData.studentOf.length > 0) {
              setRole({ color: 'secondary', name: 'Student' })
              if (
                userData.publicProfile ||
                userData.showCourses ||
                isMyProfile ||
                (getUser() && getUser().isSuperAdmin)
              ) {
                setCourses(userData.studentOf)
              }
            }
            fetchCourses(userData)
          } else {
            setStatus(404)
          }
        } else {
          setStatus(404)
        }
      })
  }

  useEffect(() => {
    fetchUser()
  }, [])

  if (status === 404) {
    return <Page404 />
  }
  if (user) {
    return (
      <Component
        user={user}
        user_id={user_id}
        privileges={privilegesReducer}
        role={role}
        allowContact={user.publicProfile || user.allowContact || isMyProfile || (getUser() && getUser().isSuperAdmin)}
        showCourses={user.publicProfile || user.showCourses || isMyProfile || (getUser() && getUser().isSuperAdmin)}
        showBadges={user.publicProfile || user.showBadges || isMyProfile || (getUser() && getUser().isSuperAdmin)}
        courses={courses}
        instruct={instruct}
        {...props}
      />
    )
  }
  return null
}

export default withPublic
