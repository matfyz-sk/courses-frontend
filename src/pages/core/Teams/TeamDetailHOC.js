import React, { useEffect, useState } from 'react'
import Page404 from '../../errors/Page404'
import { BACKEND_URL } from '../../../configuration/api'
import { authHeader } from '../../../components/Auth'

const withTeamHandler = Component => props => {
  const {privilegesReducer, courseInstanceReducer} = props
  if(
    courseInstanceReducer.courseInstance !== null &&
    privilegesReducer.inCourseInstance === 'visitor'
  ) {
    return <Page404/>
  }
  const [ team, setTeam ] = useState({})
  const [ users, setUsers ] = useState([])
  const [ resp, setResp ] = useState(200)

  const {team_id, course_id} = props.match.params
  const create = !team_id
  const is_member = false

  const fetchUsers = () => {
    fetch(
      `${ BACKEND_URL }/data/teamInstance?instanceOf=${ team_id }&_join=hasUser`,
      {
        method: 'GET',
        headers: authHeader(),
        mode: 'cors',
        credentials: 'omit',
      }
    )
      .then(response => {
        if(!response.ok) throw new Error(response)
        else return response.json()
      })
      .then(data => {
        if(data['@graph'].length > 0) {
          setUsers(data['@graph'])
        }
      })
  }
  const fetchData = () => {
    fetch(`${ BACKEND_URL }/data/team/${ team_id }`, {
      method: 'GET',
      headers: authHeader(),
      mode: 'cors',
      credentials: 'omit',
    })
      .then(response => {
        if(!response.ok) {
          setResp(404)
        }
        return response.json()
      })
      .then(data => {
        if(data['@graph'] && data['@graph'].length > 0) {
          setTeam(data['@graph'][0])
          fetchUsers()
        } else {
          setResp(404)
        }
      })
  }
  if(!create) {
    useEffect(() => {
      fetchData()
    }, [])
  }

  if(resp === 200) {
    return (
      <Component
        { ...props }
        create={ create && !is_member }
        team={ team }
        users={ users }
        isAdmin={ privilegesReducer.inCourseInstance !== 'student' }
        course_id={ course_id }
        privileges={
          privilegesReducer.inGlobal === 'admin'
            ? 'instructor'
            : privilegesReducer.inCourseInstance
        }
      />
    )
  }
  if(resp === 404) {
    return <Page404/>
  }
  return null
}

export default withTeamHandler
