import React, { Component } from 'react'
import { withRouter, Link } from 'react-router-dom'
import { connect } from 'react-redux'
import { Badge, Container, Table } from 'reactstrap'
import { redirect } from '../../../constants/redirect'
import * as ROUTES from '../../../constants/routes'
import { authHeader, getUserInCourseType } from '../../../components/Auth'
import { BACKEND_URL } from '../../../configuration/api'
import { setCourseInstance } from '../../../redux/actions'
import { formatDate } from '../../../functions/global'

class TeamInstance extends Component {
  constructor(props) {
    super(props)
    this.state = {
      course_id: this.props.match.params.course_id ?? null,
      team_id: this.props.match.params.team_id ?? null,
      userInCourse: null,
      teams: null,
    }
  }

  componentDidMount() {
    const userInCourse = getUserInCourseType(this.state.course_id)
    fetch(`${BACKEND_URL}/data/teamInstance`, {
      method: 'GET',
      headers: authHeader(),
      mode: 'cors',
      credentials: 'omit',
    })
      .then(response => {
        if (!response.ok) throw new Error(response)
        else return response.json()
      })
      .then(data => {
        if (data['@graph'].length > 0) {
          const teams = data['@graph']
          this.setState({ teams })
        }
      })
    this.setState({ userInCourse })
  }

  render() {
    const { teams, course_id, team_id } = this.state
    const render_teams = []
    if (teams) {
      for (let i = 0; i < teams.length; i++) {
        const team = teams[i]
        render_teams.push(
          <tr key={`team-${i}`}>
            <th>{team.name}</th>
            <td>
              <Badge color="success">Approved</Badge>
            </td>
            <td>{formatDate(team.createdAt)}</td>
            <td>
              <Link
                to={redirect(ROUTES.COURSE_TEAMS_DETAIL, [
                  {
                    key: 'course_id',
                    value: this.props.match.params.course_id,
                  },
                  { key: 'team_id', value: 552 },
                ])}
              >
                Detail
              </Link>
            </td>
          </tr>
        )
      }
    }

    return (
      <Container>
        <h1>
          Team instances :
          {this.state.userInCourse}
        </h1>
        <Link
          to={redirect(ROUTES.COURSE_TEAM_INSTANCE_CREATE, [
            { key: 'course_id', value: course_id },
            { key: 'team_id', value: team_id },
          ])}
        >
          Create team instance
        </Link>
        <Table hover>
          <thead>
            <tr>
              <th>Team name</th>
              <th>Status</th>
              <th>Created at</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>{render_teams}</tbody>
        </Table>
      </Container>
    )
  }
}

const mapStateToProps = state => {
  return state
}

export default withRouter(connect(mapStateToProps)(TeamInstance))
