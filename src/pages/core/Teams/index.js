import React from 'react'
import { Link, withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import { Container, Table } from 'reactstrap'
import { redirect } from '../../../constants/redirect'
import * as ROUTES from '../../../constants/routes'
import { formatDate, idFromURL } from '../../../functions/global';
import { useGetTeamQuery } from "services/teamGraph"
import { getFullID, getShortID } from 'helperFunctions'

function Teams(props) {
  const courseId = props.match.params.course_id ?? null
  const {data, isSuccess} = useGetTeamQuery({order: true})
  let teams = null
  if (isSuccess && data) {
    teams = data
  }

  const render_teams = []
  if(teams) {
    for(let i = 0; i < teams.length; i++) {
      const team = teams[i]
      const team_id = idFromURL(team['_id'])
      const courseInstanceId = getShortID(team.courseInstance['_id'])
      if(courseId === courseInstanceId) {
        render_teams.push(
          <tr key={ `team-${ i }` }>
            <th>{ team.name }</th>
            <td>{ formatDate(team.createdAt.millis) }</td>
            <td>
              <Link
                key={ `team-${ i }-edit` }
                className="btn btn-dark btn-sm ml-1"
                to={ redirect(ROUTES.COURSE_TEAM_DETAIL, [
                  {
                    key: 'course_id',
                    value: props.match.params.course_id,
                  },
                  {key: 'team_id', value: team_id},
                ]) }
              >
                Detail
              </Link>
            </td>
          </tr>
        )
      }
    }
  }

  return (
    <Container>
      <h1>
        Teams
      </h1>
      <Link
        to={ redirect(ROUTES.COURSE_TEAM_CREATE, [
          {key: 'course_id', value: courseId},
        ]) }
        className="btn btn-success mb-2"
      >
        Create new team
      </Link>
      <Table hover>
        <thead>
        <tr>
          <th>Team name</th>
          <th>Created at</th>
          <th/>
        </tr>
        </thead>
        <tbody>{ render_teams }</tbody>
      </Table>
    </Container>
  )
}

const mapStateToProps = state => {
  return state
}

export default withRouter(connect(mapStateToProps)(Teams))
