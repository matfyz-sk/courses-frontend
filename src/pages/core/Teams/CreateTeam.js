import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import {
  Alert,
  Button,
  Col,
  Container,
  Form,
  FormGroup,
  Input,
  Label,
  Row,
} from 'reactstrap'
import {
  authHeader,
  getUser,
} from '../../../components/Auth'
import { textValidator } from '../../../functions/validators'
import { BACKEND_URL } from '../../../configuration/api'

const INITIAL_FORM = {
  name: '',
  minUsers: 1,
  maxUsers: 5,
  dateFrom: undefined,
  dateTo: undefined,
  createdBy: null,
  createdAt: new Date(),
  courseInstance: null,
}

class CreateTeam extends Component {
  constructor(props) {
    super(props)
    this.handleInputChange = this.handleInputChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
    this.checkRange = this.checkRange.bind(this)
    this.checkDates = this.checkDates.bind(this)
    this.state = {
      course_id: this.props.match.params.course_id ?? null,
      team_id: this.props.match.params.team_id ?? null,
      userInCourse: null,
      form: { ...INITIAL_FORM },
      response: null,
    }
  }

  componentDidMount() {
    const { team_id } = this.state
    if (team_id !== null) {
      fetch(`${BACKEND_URL}/data/team/${team_id}`, {
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
          if(data['@graph'].length > 0) {
            const team = data['@graph'][0]
            this.setState({
              form: {
                name: team.name ?? '',
                minUsers: team.minUsers ?? 1,
                maxUsers: team.maxUsers ?? 5,
                dateFrom: team.dateFrom ?? undefined,
                dateTo: team.dateTo ?? undefined,
                courseInstance: team.courseInstance
                  ? team.courseInstance['@id']
                  : this.props.courseInstanceReducer.courseInstance['@id'],
              },
            })
          }
        })
    }
  }

  handleInputChange(event) {
    const { target } = event
    const value = target.type === 'checkbox' ? target.checked : target.value
    const { name } = target
    const { form } = this.state
    form[name] = value
    this.setState({ form })
  }

  checkRange(name, value) {
    const { form } = this.state
    if (value < 1) {
      form[name] = 1
    }
    if (value < form.minUsers) {
      form[name] = form.minUsers
    }
    this.setState({ form })
  }

  checkDates(name, value) {
    const { form } = this.state
    const _date1 = new Date(value)
    const _date2 = new Date(form.dateFrom)
    if (isNaN(_date1) || isNaN(_date2)) {
      return false
    }
    if (_date1.getTime() < _date2.getTime()) {
      form[name] = form.dateFrom
    }
    this.setState({ form })
  }

  handleSubmit() {
    const { form, team_id } = this.state
    this.checkRange('minUsers', form.minUsers)
    this.checkRange('maxUsers', form.maxUsers)
    this.checkDates('dateFrom', form.dateFrom)
    this.checkDates('dateTo', form.dateTo)
    let response = null
    if (form.name === '') {
      response = {
        type: 'danger',
        msg: 'Name cant be empty!',
      }
    }
    if (this.checkDates('dateFrom', form.dateFrom) === false) {
      response = {
        type: 'danger',
        msg: 'Dates has not valid!',
      }
    }
    if (response !== null) {
      this.setState({ response })
      return
    }
    form.courseInstance = this.props.courseInstanceReducer.courseInstance['@id']
    if (!team_id) {
      form.createdBy = getUser().fullURI
      form.createdAt = new Date()
    }

    fetch(`${BACKEND_URL}/data/team${team_id ? `/${team_id}` : ''}`, {
      method: team_id ? 'PATCH' : 'POST',
      headers: authHeader(),
      mode: 'cors',
      credentials: 'omit',
      body: JSON.stringify(this.state.form),
    })
      .then(response => {
        if (!response.ok) throw new Error(response)
        else return response.json()
      })
      .then(data => {
        if (data.status) {
          if (team_id) {
            this.setState({
              response: {
                type: 'success',
                msg: 'Record has been updated!',
              },
            })
          } else {
            this.setState({
              response: {
                type: 'success',
                msg: 'Record has been saved!',
              },
              form: { ...INITIAL_FORM },
            })
          }
        } else {
          this.setState({
            response: {
              type: 'danger',
              msg: 'Error has occurred! Please, try again!',
            },
          })
        }
      })
  }

  render() {
    const { form, response } = this.state
    return (
      <Container>
        <h1>Create new team group</h1>
        <Form>
          {response ? <Alert color={response.type}>{response.msg}</Alert> : ''}
          <Row form>
            <Col md={6} key="bi-1">
              <FormGroup>
                <Label for="team-name">Course name *</Label>
                <Input
                  type="text"
                  name="name"
                  id="team-name"
                  placeholder="e.g. Homework team"
                  value={form.name}
                  onChange={this.handleInputChange}
                  autoComplete="off"
                />
              </FormGroup>
            </Col>
          </Row>
          <Row form>
            <Col md={6} key="bi-1">
              <FormGroup>
                <Label for="minUsers">Minimum users *</Label>
                <Input
                  type="number"
                  name="minUsers"
                  id="minUsers"
                  placeholder="e.g. 1"
                  value={form.minUsers}
                  onChange={this.handleInputChange}
                  onBlur={e => this.checkRange(e.target.name, e.target.value)}
                  autoComplete="off"
                />
              </FormGroup>
            </Col>
          </Row>
          <Row form>
            <Col md={6} key="bi-1">
              <FormGroup>
                <Label for="maxUsers">Maximum users *</Label>
                <Input
                  type="number"
                  name="maxUsers"
                  id="maxUsers"
                  placeholder="e.g. 5"
                  value={form.maxUsers}
                  onChange={this.handleInputChange}
                  onBlur={e => this.checkRange(e.target.name, e.target.value)}
                  autoComplete="off"
                />
              </FormGroup>
            </Col>
          </Row>
          <Row form>
            <Col md={6} key="bi-1">
              <FormGroup>
                <Label for="dateFrom">Date to join from *</Label>
                <Input
                  type="date"
                  name="dateFrom"
                  id="dateFrom"
                  value={form.dateFrom}
                  onChange={this.handleInputChange}
                  onBlur={e => this.checkDates(e.target.name, e.target.value)}
                  autoComplete="off"
                />
              </FormGroup>
            </Col>
          </Row>
          <Row form>
            <Col md={6} key="bi-1">
              <FormGroup>
                <Label for="dateTo">Date to join to *</Label>
                <Input
                  type="date"
                  name="dateTo"
                  id="dateTo"
                  value={form.dateTo}
                  onChange={this.handleInputChange}
                  onBlur={e => this.checkDates(e.target.name, e.target.value)}
                  autoComplete="off"
                />
              </FormGroup>
            </Col>
          </Row>
          <Button onClick={() => this.handleSubmit()}>Submit</Button>
        </Form>
      </Container>
    )
  }
}

const mapStateToProps = state => {
  return state
}

export default withRouter(connect(mapStateToProps)(CreateTeam))
