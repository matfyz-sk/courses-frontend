import React, { useState } from 'react'
import { getUser } from '../../../components/Auth'
import Page404 from '../../errors/Page404'
import { isVisibleUser } from '../../../components/Auth/userFunction'
import { useGetUserStudentOfQuery } from 'services/user'
import { useGetCourseWithInstructorQuery } from 'services/course'

const withPublic = Component => props => {
  const { user_id } = props.match.params
  const { privilegesReducer } = props
  const { data, isSuccess, isError} = useGetUserStudentOfQuery(user_id)
  const { data: coursesQueryData, isSuccess: coursesQueryIsSuccess} = useGetCourseWithInstructorQuery(user_id)
  const [user, setUser] = useState(null)
  const [status, setStatus] = useState(200)
  const [role, setRole] = useState({ color: 'light', name: 'User' })
  const [courses, setCourses] = useState([])
  const [instruct, setInstruct] = useState([])
  const isMyProfile = getUser() && getUser().id === user_id

  if(isSuccess && user === null) {
    saveUser(data[0])
  } else if (isError) {
    setStatus(404)
  }

  function saveUser(userData) {
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
      saveCourses(userData)
    } else {
      setStatus(404)
    }
  }

  function saveCourses(userData) {
    if(coursesQueryIsSuccess && coursesQueryData.length > 0) {
      setRole({ color: 'primary', name: 'Instructor' })
      if (
        userData.publicProfile ||
        userData.showCourses ||
        isMyProfile ||
        (getUser() && getUser().isSuperAdmin)
      ) {
        setInstruct(coursesQueryData)
      }
    }
  }

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
