import React, { Component } from 'react'
import { withRouter, Link } from 'react-router-dom'
import { connect } from 'react-redux'
import { Badge, Container, Table } from 'reactstrap'
import { redirect } from '../../../constants/redirect'
import * as ROUTES from '../../../constants/routes'

class Teams extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <Container>
        <h1>My teams</h1>
        <Table hover>
          <thead>
            <tr>
              <th>Team name</th>
              <th>Students in team</th>
              <th>Belongs to</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th>Name</th>
              <td>Mark, Mark, Mark</td>
              <td>Course</td>
              <td>
                <Badge color="success">Approved</Badge>
              </td>
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
          </tbody>
        </Table>
      </Container>
    )
  }
}

const mapStateToProps = state => {
  return state
}

export default withRouter(connect(mapStateToProps)(Teams))
