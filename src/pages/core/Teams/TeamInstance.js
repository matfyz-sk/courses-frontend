import React, { Component } from 'react'
import { withRouter, Link } from 'react-router-dom'
import { connect } from 'react-redux'
import {Badge, Button, Container, Table} from 'reactstrap';
import { redirect } from '../../../constants/redirect'
import * as ROUTES from '../../../constants/routes'
import {authHeader, getUserID} from '../../../components/Auth';
import { BACKEND_URL } from '../../../configuration/api'
import { dateCompare, formatDate, idFromURL } from '../../../functions/global'
import { store } from '../../../index'
import { fetchTeam } from '../../../redux/actions/teamActions'

function isMemberOfTeam(membership, teamInstance_id) {
  for (let i = 0; i < membership.length; i++) {
    if (membership[i].instanceOf === teamInstance_id) {
      return 1
    }
  }
  return 0
}

class TeamInstance extends Component {
  constructor(props) {
    super(props)
    this.state = {
      course_id: this.props.match.params.course_id ?? null,
      team_id: this.props.match.params.team_id ?? null,
      teamInstances: null,
      user: null,
    }
  }

  componentDidMount() {
    const { team_id } = this.state
    store.dispatch(fetchTeam(team_id))
    fetch(`${BACKEND_URL}/data/teamInstance?instanceOf=${team_id}`, {
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
          this.setState({ teamInstances: data['@graph'] })
        }
      })

    fetch(`${BACKEND_URL}/data/user/${getUserID()}?_join=memberOf`, {
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
          this.setState({ user: data['@graph'][0] })
        }
      })
  }

  render() {
    const { teamInstances, course_id, team_id, user } = this.state
    const isStudent = this.props.privilegesReducer.inCourseInstance === 'student'
    const { team } = this.props.teamReducer
    const render_teams = []
    let isMemberOfOne = 0
    if (teamInstances && user) {
      for (let i = 0; i < teamInstances.length; i++) {
        const teamInstance = teamInstances[i]
        isMemberOfOne += isMemberOfTeam(user.memberOf, teamInstance.instanceOf[0]['@id'])
        render_teams.push(
          <tr key={`team-${i}`}>
            <th>{teamInstance.name}</th>
            <td>
              <Badge color={teamInstance.approved ? 'success' : 'danger'}>
                {teamInstance.approved ? 'Approved' : 'Not approved'}
              </Badge>
            </td>
            <td>{formatDate(teamInstance.createdAt)}</td>
            <td>
              <Link
                to={redirect(ROUTES.COURSE_TEAMS_DETAIL, [
                  {
                    key: 'course_id',
                    value: this.props.match.params.course_id,
                  },
                  { key: 'team_id', value: team_id },
                  {
                    key: 'teamInstance_id',
                    value: idFromURL(teamInstance['@id']),
                  },
                ])}
              >
                Detail
              </Link>
              {idFromURL(teamInstance.createdBy) === getUserID() &&
              !teamInstance.approved ? (
                <Button color="danger" size="sm" className="ml-2">
                  Delete
                </Button>
              ) : null}
              {!isStudent && !teamInstance.approved ? (
                <Button color="success" size="sm" className="ml-2">
                  Approve
                </Button>
              ) : null}
            </td>
          </tr>
        )
      }
    }

    return (
      <Container>
        <h1>Team instances</h1>
        {team &&
        dateCompare(team.dateFrom, '<>', new Date(), team.dateTo) &&
        this.props.privilegesReducer.inCourseInstance === 'student' &&
        isMemberOfOne === 0 ? (
          <Link
            to={redirect(ROUTES.COURSE_TEAM_INSTANCE_CREATE, [
              { key: 'course_id', value: course_id },
              { key: 'team_id', value: team_id },
            ])}
          >
            Create team instance
          </Link>
        ) : null}
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
