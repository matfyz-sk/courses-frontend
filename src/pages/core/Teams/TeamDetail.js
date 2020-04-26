import React, { Component } from 'react'
import {
  Col,
  Row,
  Table,
  Badge,
  ListGroup,
  ListGroupItem,
  Collapse,
  Container,
  Button,
  Label,
  Input,
  FormGroup,
  Alert,
} from 'reactstrap'
import { Link, withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import { store } from '../../../index'
import { fetchTeam, fetchTeamInstance } from '../../../redux/actions'
import * as ROUTES from '../../../constants/routes'
import { formatDate, idFromURL } from '../../../functions/global'
import { authHeader, getUser, getUserID } from '../../../components/Auth'
import { BACKEND_URL } from '../../../configuration/api'
import { redirect } from '../../../constants/redirect'

class TeamsDetail extends Component {
  constructor(props) {
    super(props)
    this.handleOpen = this.handleOpen.bind(this)
    this.handleCreateTeam = this.handleCreateTeam.bind(this)
    this.handleInputChange = this.handleInputChange.bind(this)
    this.appendUserToTeam = this.appendUserToTeam.bind(this)
    this.state = {
      isOpen: [false, false],
      course_id: this.props.match.params.course_id ?? null,
      team_id: this.props.match.params.team_id ?? null,
      teamInstance_id: this.props.match.params.teamInstance_id ?? null,
      canCreate: false,
      form: {
        name: '',
      },
      error: null,
    }
  }

  componentDidMount() {
    const { team_id, teamInstance_id } = this.state
    store.dispatch(fetchTeam(team_id))
    if (!teamInstance_id) {
      this.setState({ canCreate: true })
    } else {
      store.dispatch(fetchTeamInstance(teamInstance_id))
    }
  }

  handleOpen(index) {
    const { isOpen } = this.state
    const is_opened = this.state.isOpen[index]
    for (let i = 0; i < isOpen.length; i++) {
      isOpen[i] = false
    }
    if (!is_opened) {
      isOpen[index] = true
    }
    this.setState({ isOpen })
  }

  handleInputChange(event) {
    const { value } = event.target
    const { form } = this.state
    if (value.length <= 30) {
      form.name = value
      this.setState({ form })
    }
  }

  handleCreateTeam() {
    const { form, canCreate, course_id, team_id } = this.state
    const { team } = this.props.teamReducer
    if (!canCreate) {
      this.setState({
        error: 'You cannot create team!',
      })
    } else if (form.name.length < 3) {
      this.setState({
        error: 'Team name must contain from 3 to 30 characters.',
      })
    } else {
      const post = {
        name: form.name,
        instanceOf: team['@id'],
        approved: false,
        notApprovedDescription: '',
      }
      fetch(`${BACKEND_URL}/data/teamInstance`, {
        method: 'POST',
        headers: authHeader(),
        mode: 'cors',
        credentials: 'omit',
        body: JSON.stringify(post),
      })
        .then(response => {
          if (!response.ok) throw new Error(response)
          else return response.json()
        })
        .then(data => {
          if (data.status) {
            const { iri } = data.resource
            const teamInstance_id = idFromURL(iri)
            this.props.history.push(
              redirect(ROUTES.COURSE_TEAMS_DETAIL, [
                { key: 'course_id', value: course_id },
                { key: 'team_id', value: team_id },
                { key: 'teamInstance_id', value: teamInstance_id },
              ])
            )
            this.appendUserToTeam(getUserID(), iri)
          } else {
            this.setState({
              error:
                'Error has occured during saving process. Please, try again.',
            })
          }
        })
    }
  }

  appendUserToTeam(user_id, teamInstance_id) {
    fetch(`${BACKEND_URL}/data/user/${user_id}`, {
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
        if (data && data['@graph'].length > 0) {
          const user = data['@graph'][0]
          const members = user.memberOf.map(item => item['@id'])
          if (members.includes(teamInstance_id)) {
            this.setState({ error: 'User is already in this team.' })
            return
          }
          else {
            members.push(teamInstance_id)
          }
          const post = {
            memberOf: members,
          }
          fetch(`${BACKEND_URL}/data/user/${user_id}`, {
            method: 'PATCH',
            headers: authHeader(),
            mode: 'cors',
            credentials: 'omit',
            body: JSON.stringify(post),
          })
            .then(response => {
              if (!response.ok) throw new Error(response)
              else return response.json()
            })
            .then(data2 => {
              console.log(data2)
            })
        }
        else {
          this.setState({ error: 'User not found.' })
        }
      })
  }

  render() {
    const { isOpen, canCreate, form, error } = this.state
    const { team } = this.props.teamReducer
    const { teamInstance } = this.props.teamInstanceReducer
    let { users } = this.props.teamInstanceReducer

    const render_members = []

    if (users) {
      for (let i = 0; i < users.length; i++) {
        render_members.push(
          <tr key={`users-${i}`}>
            <th scope="row">
              {`${users[i].firstName} ${users[i].lastName} (${
                teamInstance && teamInstance.createdBy === users[i]['@id']
                  ? 'owner'
                  : ''
              }`}
            </th>
            <td>
              <Link to="/courses/detail/students/detail">DETAIL</Link>
            </td>
          </tr>
        )
      }
    }

    let renderCreateForm = null
    if (canCreate) {
      renderCreateForm = (
        <div className="mb-3">
          <FormGroup>
            <Label for="team-name">What is name of your team? *</Label>
            <Input
              type="text"
              name="name"
              id="name"
              placeholder="e.g. Hard workers"
              style={{ maxWidth: 'initial' }}
              value={form.name}
              max={30}
              onChange={this.handleInputChange}
              autoComplete="off"
            />
          </FormGroup>
          <Button color="success" onClick={this.handleCreateTeam}>
            Create team
          </Button>
        </div>
      )
    }

    return (
      <Container>
        <Row>
          <Col xs={12}>
            <h1>{canCreate ? 'New team ' : (teamInstance ? `Team ${teamInstance.name}` : '')}</h1>
            <h2>{team ? `for group ${team.name}` : null}</h2>
          </Col>
        </Row>
        <Row>
          <Col xs={12} sm={6} className="mt-4" key="members">
            {error ? <Alert color="danger">{error}</Alert> : ''}
            {renderCreateForm}
            <Table hover>
              <thead>
                <tr>
                  <th>Name</th>
                  <th> </th>
                </tr>
              </thead>
              <tbody>{render_members}</tbody>
            </Table>
          </Col>
          <Col xs={12} sm={6} className="mt-5" key="data">
            <Table borderless size="sm">
              <thead>
                <tr colSpan="2">
                  <th>Team criteria</th>
                </tr>
              </thead>
              <tbody>
                <tr key="dateFrom">
                  <td>Date from</td>
                  <td>{team ? formatDate(team.dateFrom) : '-'}</td>
                </tr>
                <tr key="dateTo">
                  <td>Date to</td>
                  <td>{team ? formatDate(team.dateTo) : '-'}</td>
                </tr>
                <tr key="range">
                  <td>Range</td>
                  <td>
                    {team
                      ? `${team.minUsers} - ${team.maxUsers} students`
                      : null}
                  </td>
                </tr>
              </tbody>
            </Table>

            <p>
              <b>Points</b>
            </p>
            <ListGroup>
              <ListGroupItem action onClick={() => this.handleOpen(0)}>
                <Row>
                  <Col xs={9} className="p-0">
                    Programming
                  </Col>
                  <Col xs={2} className="p-0">
                    24 / 30
                  </Col>
                  <Col xs={1} className="p-0 text-right">
                    <i className="fa fa-chevron-down" />
                  </Col>
                </Row>
                <Collapse isOpen={isOpen[0]} className="mt-2">
                  <Row>
                    <Col xs={8} className="p-0 pl-3">
                      Patrik Hudák 1
                    </Col>
                    <Col xs={2} className="p-0">
                      7 / 10
                    </Col>
                    <Col xs={2} className="p-0 text-right">
                      <Badge>Change</Badge>
                    </Col>
                  </Row>
                  <Row>
                    <Col xs={8} className="p-0 pl-3">
                      Patrik Hudák 2
                    </Col>
                    <Col xs={2} className="p-0">
                      10 / 10
                    </Col>
                    <Col xs={2} className="p-0 text-right">
                      <Badge>Change</Badge>
                    </Col>
                  </Row>
                  <Row>
                    <Col xs={8} className="p-0 pl-3">
                      Patrik Hudák 3
                    </Col>
                    <Col xs={2} className="p-0">
                      7 / 10
                    </Col>
                    <Col xs={2} className="p-0 text-right">
                      <Badge>Change</Badge>
                    </Col>
                  </Row>
                </Collapse>
              </ListGroupItem>
              <ListGroupItem action onClick={() => this.handleOpen(1)}>
                <Row>
                  <Col xs={9} className="p-0">
                    Diagrams
                  </Col>
                  <Col xs={2} className="p-0">
                    24 / 30
                  </Col>
                  <Col xs={1} className="p-0 text-right">
                    <i className="fa fa-chevron-down" />
                  </Col>
                </Row>
                <Collapse isOpen={isOpen[1]} className="mt-2">
                  <Row>
                    <Col xs={8} className="p-0 pl-3">
                      Patrik Hudák 1
                    </Col>
                    <Col xs={2} className="p-0">
                      7 / 10
                    </Col>
                    <Col xs={2} className="p-0 text-right">
                      <Badge>Change</Badge>
                    </Col>
                  </Row>
                  <Row>
                    <Col xs={8} className="p-0 pl-3">
                      Patrik Hudák 2
                    </Col>
                    <Col xs={2} className="p-0">
                      10 / 10
                    </Col>
                    <Col xs={2} className="p-0 text-right">
                      <Badge>Change</Badge>
                    </Col>
                  </Row>
                  <Row>
                    <Col xs={8} className="p-0 pl-3">
                      Patrik Hudák 3
                    </Col>
                    <Col xs={2} className="p-0">
                      7 / 10
                    </Col>
                    <Col xs={2} className="p-0 text-right">
                      <Badge>Change</Badge>
                    </Col>
                  </Row>
                </Collapse>
              </ListGroupItem>
            </ListGroup>
          </Col>
        </Row>
      </Container>
    )
  }
}

const mapStateToProps = state => {
  return state
}

export default withRouter(connect(mapStateToProps)(TeamsDetail))
