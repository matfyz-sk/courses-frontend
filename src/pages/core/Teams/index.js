import React, { Component } from 'react'
import { withRouter, Link } from 'react-router-dom'
import { connect } from 'react-redux'
import { Badge, Container, Table } from 'reactstrap'
import { redirect } from '../../../constants/redirect'
import * as ROUTES from '../../../constants/routes'
import { authHeader } from '../../../components/Auth'
import { BACKEND_URL } from '../../../configuration/api'
import {dateCompare, formatDate, idFromURL} from '../../../functions/global';

class Teams extends Component {
  constructor(props) {
    super(props)
    this.state = {
      course_id: this.props.match.params.course_id ?? null,
      teams: null,
    }
  }

  componentDidMount() {
    fetch(`${BACKEND_URL}/data/team?courseInstance=${this.state.course_id}&_join=createdBy`, {
        method: 'GET',
        headers: authHeader(),
        mode: 'cors',
        credentials: 'omit',
      }
    )
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
  }

  render() {
    const { teams, course_id } = this.state
    const privileges = this.props.privilegesReducer
    const render_teams = []
    if (teams) {
      for (let i = 0; i < teams.length; i++) {
        const team = teams[i]
        const team_id = idFromURL(team['@id'])
        render_teams.push(
          <tr
            key={`team-${i}`}
            className={
              dateCompare(team.dateFrom, '<>', new Date(), team.dateTo)
                ? ''
                : 'text-muted'
            }
          >
            <th>{team.name}</th>
            <td>{`${team.minUsers} - ${team.maxUsers}`}</td>
            <td>
              {`${formatDate(team.dateFrom)} - ${formatDate(team.dateTo)}`}
            </td>
            <td>createdBy</td>
            <td>{formatDate(team.createdAt)}</td>
            <td>
              {privileges.inCourseInstance !== 'student' ? (
                <Link
                  key={`team-${i}-edit`}
                  className="btn btn-dark btn-sm ml-1"
                  to={redirect(ROUTES.COURSE_TEAM_EDIT, [
                    {
                      key: 'course_id',
                      value: this.props.match.params.course_id,
                    },
                    { key: 'team_id', value: team_id },
                  ])}
                >
                  Edit
                </Link>
              ) : null}
              <Link
                key={`team-${i}-detail`}
                className="btn btn-dark btn-sm ml-1"
                to={redirect(ROUTES.COURSE_TEAM_INSTANCE, [
                  {
                    key: 'course_id',
                    value: this.props.match.params.course_id,
                  },
                  { key: 'team_id', value: team_id },
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
          Teams
        </h1>
        {privileges.inCourseInstance !== 'student' ? (
          <Link
            to={redirect(ROUTES.COURSE_TEAM_CREATE, [
              { key: 'course_id', value: course_id },
            ])}
          >
            Create new team group
          </Link>
        ) : null}
        <Table hover>
          <thead>
            <tr>
              <th>Team name</th>
              <th>Users limit</th>
              <th>Registration range</th>
              <th>Creator</th>
              <th>Created at</th>
              <th></th>
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

export default withRouter(connect(mapStateToProps)(Teams))
