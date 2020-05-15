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
  Form,
} from 'reactstrap'
import { Link, withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import * as ROUTES from '../../../constants/routes'
import { authHeader, getUser, getUserID } from '../../../components/Auth'
import { BACKEND_URL } from '../../../configuration/api'
import { redirect } from '../../../constants/redirect'
import withTeamHandler from './TeamDetailHOC'
import { getShortID } from '../../../helperFunctions'
import {isVisibleUser, showUserName} from '../../../components/Auth/userFunction';

class TeamsDetail extends Component {
  constructor(props) {
    super(props)
    this.handleOpen = this.handleOpen.bind(this)
    this.handleCreateTeam = this.handleCreateTeam.bind(this)
    this.handleInputChange = this.handleInputChange.bind(this)
    this.appendUserToTeam = this.appendUserToTeam.bind(this)
    this.searchFetch = this.searchFetch.bind(this)
    this.searchUser = this.searchUser.bind(this)
    this.state = {
      isOpen: [false, false],
      form: {
        name: '',
      },
      search: '',
      error: null,
    }
  }

  handleOpen(index) {
    const { isOpen } = this.state
    const is_opened = isOpen[index]
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
    const { form } = this.state
    const { create, courseInstanceReducer } = this.props
    const course = courseInstanceReducer.courseInstance
    if (!create) {
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
        courseInstance: course['@id'],
      }
      fetch(`${BACKEND_URL}/data/team`, {
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
            this.appendUserToTeam(iri, getUser().fullURI, true)
          } else {
            this.setState({
              error:
                'Error has occured during saving process. Please, try again.',
            })
          }
        })
    }
  }

  appendUserToTeam(iri, user, approved = false, fillRequest = true) {
    const { course_id, history } = this.props
    const post = {
      approved,
      instanceOf: iri,
      hasUser: user,
      requestFrom: fillRequest ? getUser().fullURI : null,
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
          history.push(
            redirect(ROUTES.COURSE_TEAM_DETAIL, [
              { key: 'course_id', value: course_id },
              { key: 'team_id', value: getShortID(iri) },
            ])
          )
        } else {
          this.setState({
            error:
              'Error has occured during saving process. Please, try again.',
          })
        }
      })
  }

  searchUser() {
    const { search } = this.state
    const params = ['email', 'nickname']
    const i = 0
    if (search.length < 3) {
      this.setState({ error: 'Minimal string length is 3' })
      return
    }
    if (
      search.toLowerCase() === getUser().email.toLowerCase() ||
      search.toLowerCase() === getUser().nickname.toLowerCase()
    ) {
      this.setState({ error: 'You cannot add yourself!' })
      return
    }
    this.searchFetch(params, i, search)
  }

  searchFetch(params, i, search) {
    const { course_id } = this.props
    if (i < params.length) {
      fetch(
        `${BACKEND_URL}/data/user?${params[i]}=${search}&studentOf=${course_id}`,
        {
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
            const { team } = this.props
            this.appendUserToTeam(team['@id'], data['@graph'][0]['@id'])
            return true
          }
          return this.searchFetch(params, i + 1, search)
        })
    } else {
      this.setState({ error: 'User was not found!' })
    }
    return false
  }

  approveMember(user) {
    const { history, course_id, team } = this.props
    fetch(`${BACKEND_URL}/data/teamInstance/${getShortID(user['@id'])}`, {
      method: 'PATCH',
      headers: authHeader(),
      mode: 'cors',
      credentials: 'omit',
      body: JSON.stringify({ approved: true }),
    })
      .then(response => {
        if (!response.ok) throw new Error(response)
        else return response.json()
      })
      .then(data => {
        if (data.status) {
          history.push(
            redirect(ROUTES.COURSE_TEAM_DETAIL, [
              { key: 'course_id', value: course_id },
              { key: 'team_id', value: getShortID(team['@id']) },
            ])
          )
        }
      })
  }

  removeMember(user) {
    const { users } = this.props
    if (users.length === 1 || !this.verifyRemoveUser(users, user)) {
      this.removeTeam()
    } else {
      this.fetchRemoveUser(user)
    }
  }

  verifyRemoveUser(users, user) {
    let count = 0
    if (!user.approved) {
      return true
    }
    for (let i = 0; i < users.length; i++) {
      if (users[i].approved) {
        count += 1
      }
    }
    if (count - 1 === 0) {
      return false
    }
    return true
  }

  removeTeam() {
    const { history, course_id, team, users } = this.props
    for (let i = 0; i < users.length; i++) {
      this.fetchRemoveUser(users[i], false)
    }
    fetch(`${BACKEND_URL}/data/team/${getShortID(team['@id'])}`, {
      method: 'DELETE',
      headers: authHeader(),
      mode: 'cors',
      credentials: 'omit',
    })
      .then(response => {
        if (!response.ok) throw new Error(response)
        else return response.json()
      })
      .then(data => {
        if (data.status) {
          history.push(
            redirect(ROUTES.COURSE_TEAMS, [
              { key: 'course_id', value: course_id },
            ])
          )
        }
      })
  }

  fetchRemoveUser(user, rerender = true) {
    const { history, course_id, team } = this.props
    fetch(`${BACKEND_URL}/data/teamInstance/${getShortID(user['@id'])}`, {
      method: 'DELETE',
      headers: authHeader(),
      mode: 'cors',
      credentials: 'omit',
    })
      .then(response => {
        if (!response.ok) throw new Error(response)
        else return response.json()
      })
      .then(data => {
        if (data.status) {
          if (rerender) {
            history.push(
              redirect(ROUTES.COURSE_TEAM_DETAIL, [
                { key: 'course_id', value: course_id },
                { key: 'team_id', value: getShortID(team['@id']) },
              ])
            )
          }
        }
      })
  }

  render() {
    const { isOpen, form, error } = this.state
    const { team, users, create, privileges, isAdmin, privilegesReducer } = this.props

    const render_members = []
    let canEdit = false
    let isMember = false
    if (users) {
      for (let i = 0; i < users.length; i++) {
        if (getShortID(users[i].hasUser[0]['@id']) === getUserID()) {
          isMember = true
        }
        if (
          users[i].approved &&
          getShortID(users[i].hasUser[0]['@id']) === getUserID()
        ) {
          canEdit = true
        }
      }
      for (let i = 0; i < users.length; i++) {
        const user = users[i].hasUser[0]
        const action = []
        if (canEdit || isAdmin) {
          action.push(
            <Button
              color="danger"
              size="sm"
              title="Remove from team"
              onClick={() => this.removeMember(users[i])}
              key={`remove-${i}`}
            >
              &#215;
            </Button>
          )
        }
        if ((canEdit || isAdmin) && !users[i].approved) {
          action.push(
            <Button
              color="success"
              onClick={() => this.approveMember(users[i])}
              size="sm"
              className="ml-1"
              title="Approve member"
              key={`approve-${i}`}
            >
              &#10003;
            </Button>
          )
        }
        render_members.push(
          <tr key={`users-${i}`}>
            <th scope="row">{showUserName(user, privilegesReducer)}</th>
            <td>
              <h5>
                <Badge color={users[i].approved ? 'success' : 'danger'}>
                  {users[i].approved ? 'approved' : 'not approved'}
                </Badge>
              </h5>
            </td>
            <td>{action}</td>
            <td>
              {isVisibleUser(users[i].hasUser[0]) ? (
                <Link
                  to={redirect(ROUTES.PUBLIC_PROFILE, [
                    {
                      key: 'user_id',
                      value: getShortID(users[i].hasUser[0]['@id']),
                    },
                  ])}
                >
                  DETAIL
                </Link>
              ) : null}
            </td>
          </tr>
        )
      }
    }

    let renderCreateForm = null
    if (create) {
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
            {canEdit || isAdmin ? (
              <Button
                color="danger"
                size="sm"
                className="float-right"
                onClick={() => this.removeTeam()}
              >
                Remove team
              </Button>
            ) : null}
            <h1>{create ? 'New team' : `Team ${team.name}`}</h1>
          </Col>
        </Row>
        <Row>
          <Col xs={12} sm={6} className="mt-4" key="members">
            {error ? <Alert color="danger">{error}</Alert> : ''}
            {renderCreateForm}
            <Table hover responsive>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Status</th>
                  <th> </th>
                  <th> </th>
                </tr>
              </thead>
              <tbody>{render_members}</tbody>
            </Table>
            {canEdit || isAdmin ? (
              <Form className="mt-5">
                <Input
                  type="text"
                  name="insert_request"
                  id="insert_request"
                  placeholder="email or nickName"
                  onChange={e => this.setState({ search: e.target.value })}
                />
                <Button
                  type="button"
                  className="mt-3"
                  onClick={this.searchUser}
                >
                  Send request
                </Button>
              </Form>
            ) : !isMember ? (
              <Button
                type="button"
                className="mt-3"
                onClick={() =>
                  this.appendUserToTeam(
                    team['@id'],
                    getUser().fullURI,
                    false,
                    false
                  )
                }
              >
                Ask for join
              </Button>
            ) : null}
          </Col>

          <Col xs={12} sm={6} className="mt-3" key="data">
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

export default withRouter(
  connect(mapStateToProps)(withTeamHandler(TeamsDetail))
)
