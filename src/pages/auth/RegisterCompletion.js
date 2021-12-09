import React, {Component} from 'react'
import {withRouter} from 'react-router-dom'
import {connect} from 'react-redux'
import {
  Alert,
  Button,
  Col,
  Collapse,
  Container,
  Form,
  FormFeedback,
  FormGroup,
  Input,
  Label,
  Row,
} from 'reactstrap'
import {emailValidator, textValidator} from '../../functions/validators'
import {authHeader, getUser, getUserID, logout, setUserProfile,} from '../../components/Auth'
import {BACKEND_URL} from '../../configuration/api'

class RegisterCompletion extends Component {
  constructor(props) {
    super(props)
    this.handleSubmit = this.handleSubmit.bind(this)
    this.validation = this.validation.bind(this)
    this.handleInputChange = this.handleInputChange.bind(this)
    this.handleToggleNickException = this.handleToggleNickException.bind(this)
    this.checkEmailExisting = this.checkEmailExisting.bind(this)
    this.removeAccount = this.removeAccount.bind(this)
    this.state = {
      user: { ...getUser(), description: '' },
      errors: {},
      be_error: null,
      success: false,
    }
  }

  componentDidMount() {
    document.getElementsByClassName('main-nav')[0].style.opacity = 0
    document.addEventListener('keyup', event => {
      if (event.keyCode === 13) {
        event.preventDefault()
        this.checkEmailExisting()
      }
    })
  }

  handleInputChange(event) {
    const { target } = event
    const value = target.type === 'checkbox' ? target.checked : target.value
    const { name } = target
    const { user } = this.state
    user[name] = value
    this.setState({ user })
  }

  validation() {
    const { errors, user } = this.state
    if (user === null) {
      return false
    }
    errors.firstName = textValidator(user.firstName, 3, 20)
    errors.lastName = textValidator(user.lastName, 3, 20)
    if (user.useNickName) {
      errors.nickname = textValidator(user.nickname, 5, 20)
    } else {
      errors.nickname = null
    }
    this.setState({ errors })
    const result = (
      errors.firstName.result &&
      errors.lastName.result &&
      errors.email.result &&
      (errors.nickname === null || errors.nickname.result === true)
    )
    if(result) {
      this.handleSubmit()
    }
  }

  handleSubmit() {
    const { user } = this.state
    const updatedAttrs = [
      'firstName', 'lastName', 'description', 'email',
      'nickname', 'useNickName', 'nickNameTeamException', 'allowContact', 'publicProfile', 'showBadges', 'showCourses'
    ]
    const body = {}
    for (let i = 0; i < updatedAttrs.length; i++) {
      body[updatedAttrs[i]] = user[updatedAttrs[i]]
    }

    fetch(`${BACKEND_URL}/data/user/${getUserID()}`, {
      method: 'PATCH',
      headers: authHeader(),
      mode: 'cors',
      credentials: 'omit',
      body: JSON.stringify(body),
    })
      .then(response => {
        if (!response.ok) throw new Error(response)
        else return response.json()
      })
      .then(data => {
        setUserProfile(body)
        document.getElementsByClassName('main-nav')[0].style.opacity = 1
        this.props.history.push('/dashboard')
      })

  }

  checkEmailExisting() {
    const { user, errors } = this.state
    errors.email = emailValidator(user.email)
    if (errors.email && errors.email.result) {
      fetch(`${BACKEND_URL}/data/user?email=${user.email}`, {
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
          if(data['@graph'] && data['@graph'].length > 0) {
            errors.email = { result: false, msg: 'Sorry, but email is already taken!' }
            this.setState({ errors })
            return false
          }
          return this.validation()
        })
    }
    this.setState({ errors })
    return false
  }

  handleToggleNickException() {
    const { user } = this.state
    user.nickNameTeamException = !user.nickNameTeamException
    this.setState({ user })
  }

  removeAccount() {
    fetch(`${BACKEND_URL}/data/user/${getUserID()}`, {
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
        logout()
        document.getElementsByClassName('main-nav')[0].style.opacity = 1
        this.props.history.push('/')
      })
  }

  render() {
    const { user, errors, be_error, success } = this.state
    return (
      <Container className="mb-5">
        <Row>
          <Col xs={12}>
            <h1>This account is new!</h1>
            <h2 className="mb-5">Fill your profile and set your privacy.</h2>
          </Col>
        </Row>
        <Alert color="warning" className="mb-3">
          If your <b>already have account in this system</b> and you <b>dont want to create new one</b>, remove this settings and go back to login!
          <br />
          <div className="text-sm-right text-center">
            <Button color="danger" className="mt-3" onClick={()=>this.removeAccount()}>Remove settings and go back</Button>
          </div>
        </Alert>
        {be_error ? <Alert color="danger">Error!{be_error}</Alert> : null}
        {success ? <Alert color="success">Profile has been updated!</Alert> : null}
        <Row>
          <Col sm={6} xs={12} key="col1">
            <h3>Basic information</h3>
            <p>Complete all required information to register your profile.</p>
            <Form>
              <Row form>
                <Col md={6} key="bi-1">
                  <FormGroup>
                    <Label for="firstName">Name *</Label>
                    <Input
                      type="text"
                      name="firstName"
                      id="firstName"
                      placeholder="My first name"
                      value={user ? user.firstName : ''}
                      onChange={this.handleInputChange}
                      autoComplete="firstName"
                      valid={
                        textValidator(user ? user.firstName : '', 3, 20).result
                      }
                      invalid={
                        errors && errors.firstName
                          ? errors.firstName.result !== true
                          : false
                      }
                    />
                    <FormFeedback tooltip>
                      {errors && errors.firstName ? errors.firstName.msg : ''}
                    </FormFeedback>
                  </FormGroup>
                </Col>
                <Col md={6} key="bi-2">
                  <FormGroup>
                    <Label for="lastName">Surname *</Label>
                    <Input
                      type="text"
                      name="lastName"
                      id="lastName"
                      placeholder="My last name"
                      value={user ? user.lastName : ''}
                      onChange={this.handleInputChange}
                      autoComplete="lastName"
                      valid={
                        textValidator(user ? user.lastName : '', 3, 20).result
                      }
                      invalid={
                        errors && errors.lastName
                          ? errors.lastName.result !== true
                          : false
                      }
                    />
                    <FormFeedback tooltip>
                      {errors && errors.lastName ? errors.lastName.msg : ''}
                    </FormFeedback>
                  </FormGroup>
                </Col>
              </Row>
              <Row form>
                <Col md={6}>
                  <FormGroup>
                    <Label for="email">Email *</Label>
                    <Input
                      type="email"
                      name="email"
                      id="email"
                      placeholder="name@domain.com"
                      value={user ? user.email : ''}
                      onChange={this.handleInputChange}
                      autoComplete="email"
                      valid={emailValidator(user ? user.email : '').result}
                      invalid={
                        errors && errors.email
                          ? errors.email.result !== true
                          : false
                      }
                    />
                    <FormFeedback tooltip>
                      {errors && errors.email ? errors.email.msg : ''}
                    </FormFeedback>
                  </FormGroup>
                </Col>
              </Row>
              <FormGroup>
                <Label for="description">About me</Label>
                <Input
                  type="textarea"
                  name="description"
                  id="description"
                  placeholder="I am ..."
                  rows={3}
                  value={user ? user.description : ''}
                  onChange={this.handleInputChange}
                  valid={
                    textValidator(user ? user.description : '', 0, 254).result
                  }
                />
              </FormGroup>
              <Button onClick={this.checkEmailExisting} className="mt-3" color="success">
                Create profile
              </Button>
            </Form>
          </Col>
          <Col sm={6} xs={12} key="col2">
            <h3>Privacy settings</h3>
            <p>This settings can be filled or changed later.</p>
            <Form>
              <FormGroup check>
                <Input
                  type="checkbox"
                  name="useNickName"
                  id="useNickName"
                  onChange={this.handleInputChange}
                  checked={user ? user.useNickName : false}
                />
                <Label for="useNickName" check>
                  I want to hide my name and use nickname
                </Label>
              </FormGroup>
              <Collapse isOpen={user ? user.useNickName : false}>
                <FormGroup>
                  <Label for="nickname">My nickname will be</Label>
                  <Input
                    type="text"
                    name="nickname"
                    id="nickname"
                    placeholder="TheBestStudentEver"
                    onChange={this.handleInputChange}
                    value={user ? user.nickname : ''}
                    valid={
                      textValidator(user ? user.nickname : '', 5, 20).result
                    }
                    invalid={
                      errors && errors.nickname
                        ? errors.nickname.result !== true
                        : false
                    }
                  />
                  <FormFeedback tooltip>
                    {errors && errors.nickname ? errors.nickname.msg : ''}
                  </FormFeedback>
                </FormGroup>
                <FormGroup check>
                  <Input
                    type="checkbox"
                    name="nickNameTeamException"
                    id="nickNameTeamException-teacher"
                    onChange={() => this.handleToggleNickException()}
                    checked={user ? !user.nickNameTeamException : false}
                  />
                  <Label for="nickNameTeamException-teacher" check>
                    Only teacher can see my real name
                  </Label>
                </FormGroup>
                <FormGroup check>
                  <Input
                    type="checkbox"
                    name="nickNameTeamException"
                    id="nickNameTeamException"
                    onChange={() => this.handleToggleNickException()}
                    checked={user ? user.nickNameTeamException : false}
                  />
                  <Label for="nickNameTeamException" check>
                    Only teacher <b>and my team members</b> can see my real name
                  </Label>
                </FormGroup>
              </Collapse>

              <FormGroup check>
                <Input
                  type="checkbox"
                  name="publicProfile"
                  id="publicProfile"
                  onChange={this.handleInputChange}
                  checked={user ? user.publicProfile : false}
                />
                <Label for="publicProfile" check>
                  My profile is public
                </Label>
              </FormGroup>
              <Collapse isOpen={user && !user.publicProfile}>
                <FormGroup check>
                  <Input
                    type="checkbox"
                    name="showCourses"
                    id="showCourses"
                    onChange={this.handleInputChange}
                    checked={user ? user.showCourses : false}
                  />
                  <Label for="showCourses">Show my courses</Label>
                </FormGroup>
                <FormGroup check>
                  <Input
                    type="checkbox"
                    name="showBadges"
                    id="showBadges"
                    onChange={this.handleInputChange}
                    checked={user ? user.showBadges : false}
                  />
                  <Label for="showBadges">Show my badges</Label>
                </FormGroup>
                <FormGroup check>
                  <Input
                    type="checkbox"
                    name="allowContact"
                    id="allowContact"
                    onChange={this.handleInputChange}
                    checked={user ? user.allowContact : false}
                  />
                  <Label for="allowContact">Allow contact me</Label>
                </FormGroup>
              </Collapse>
            </Form>
          </Col>
        </Row>
      </Container>
    )
  }
}

const mapStateToProps = state => {
  return state
}

export default withRouter(connect(mapStateToProps)(RegisterCompletion))
