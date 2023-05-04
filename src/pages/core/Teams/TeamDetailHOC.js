import React from 'react'
import Page404 from '../../errors/Page404'
import { useGetTeamInstanceWithUsersQuery } from "services/team"
import { useGetTeamQuery } from 'services/teamGraph'

const withTeamHandler = Component => props => {
  const {privilegesReducer, courseInstanceReducer} = props
  if(
    courseInstanceReducer.courseInstance !== null &&
    privilegesReducer.inCourseInstance === 'visitor'
  ) {
    return <Page404/>
  }
  
  const {team_id, course_id} = props.match.params
  const create = !team_id
  const is_member = false
  const {
    data: teamData,
    isSuccess: teamIsSuccess
  } = useGetTeamQuery({id: team_id})
  const {
    data: usersData,
    isSuccess: usersIsSuccess
  } = useGetTeamInstanceWithUsersQuery(team_id)


  let team = {}
  if (!create && teamIsSuccess && teamData) {
    team = teamData[0]
  }
  let users = []
  if (!create && usersIsSuccess && usersData) {
    users = usersData
  }

  if(!teamIsSuccess || !usersIsSuccess) {
    return <Page404/>
  }

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

export default withTeamHandler
