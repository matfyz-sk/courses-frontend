import React, {useEffect, useState} from 'react';
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import { Alert, Button, Col, Collapse, Container, Form, FormFeedback, FormGroup, Input, Label, Row, } from 'reactstrap'
import { emailValidator, textValidator, } from '../../../functions/validators'
import { authHeader, getUserID, setUserProfile } from '../../../components/Auth';
import { BACKEND_URL } from "../../../constants";
import { useGetUserQuery, useUpdateUserMutation } from 'services/user'
 
function Profile(props) {
  const { data, isSuccess, isError, error } = useGetUserQuery(getUserID())
  const { updateUser, result } = useUpdateUserMutation()
  const [user, setUser] = useState(null)
  const [errors, setErrors] = useState({})
  const [success, setSuccess] = useState(false)

  if(isSuccess && user === null) {
    setUser(data)
  } else if (isError) {
    throw new Error(error)
  }

  // This does the same thing as componentDidMount
  useEffect(() => {
    document.addEventListener('keyup', event => {
      if(event.keyCode === 13) {
        event.preventDefault()
        handleSubmit()
      }
    })
  }, [])

  const handleInputChange = (event) => {
    const {target} = event
    const value = target.type === 'checkbox' ? target.checked : target.value
    const {name} = target
    let tmp_user = {...user}
    tmp_user[name] = value
    setUser(tmp_user)
  }

  const validation = () => {
    if(user === null) {
      return false
    }
    let new_errors = {...errors}
    new_errors.firstName = textValidator(user.firstName, 3, 20)
    new_errors.lastName = textValidator(user.lastName, 3, 20)
    new_errors.email = emailValidator(user.email)
    if(user.useNickName) {
      new_errors.nickname = textValidator(user.nickname, 5, 20)
    } else {
      new_errors.nickname = null
    }
    setErrors(new_errors)
    return (
      new_errors.firstName.result &&
      new_errors.lastName.result &&
      new_errors.email.result &&
      (new_errors.nickname === null || new_errors.nickname.result === true)
    )
  }

  const handleSubmit = () => {
    if(validation()) {
      const updatedAttrs = [
        'firstName', 'lastName', 'description', 'email',
        'nickname', 'useNickName', 'nickNameTeamException', 'allowContact', 'publicProfile', 'showBadges', 'showCourses'
      ]
      const body = {}
      for(let i = 0; i < updatedAttrs.length; i++) {
        body[updatedAttrs[i]] = user[updatedAttrs[i]]
      }

      const json_body = JSON.stringify(body);
      const id = getUserID()
      updateUser({id, json_body}).unwrap()
      //TODO
     /* fetch(`${ BACKEND_URL }data/user/${ getUserID() }`, {
        method: 'PATCH',
        headers: authHeader(),
        mode: 'cors',
        credentials: 'omit',
        body: JSON.stringify(body),
      })
        .then(response => {
          if(!response.ok) throw new Error(response)
          else return response.json()
        })
        .then(data => {
          this.setState({success: true})
          setUserProfile(body)
        })*/
    }
  }

  const handleToggleNickException = () => {
    let tmp_user = {...user}
    tmp_user.nickNameTeamException = !user.nickNameTeamException
    setUser(tmp_user)
  }

  return (
    <Container>
      <h1 className="mb-5">Profile settings</h1>
      { success ? <Alert color="success">Profile has been updated!</Alert> : null }
      <Row>
        <Col sm={ 6 } xs={ 12 } key="col1">
          <h3>Basic information</h3>
          <p>Complete all required information to register your profile.</p>
          <Form>
            <Row form>
              <Col md={ 6 } key="bi-1">
                <FormGroup>
                  <Label for="firstName">Name *</Label>
                  <Input
                    type="text"
                    name="firstName"
                    id="firstName"
                    placeholder="My first name"
                    value={ user ? user.firstName : '' }
                    onChange={ handleInputChange }
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
                    { errors && errors.firstName ? errors.firstName.msg : '' }
                  </FormFeedback>
                </FormGroup>
              </Col>
              <Col md={ 6 } key="bi-2">
                <FormGroup>
                  <Label for="lastName">Surname *</Label>
                  <Input
                    type="text"
                    name="lastName"
                    id="lastName"
                    placeholder="My last name"
                    value={ user ? user.lastName : '' }
                    onChange={ handleInputChange }
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
                    { errors && errors.lastName ? errors.lastName.msg : '' }
                  </FormFeedback>
                </FormGroup>
              </Col>
            </Row>
            <Row form>
              <Col md={ 6 }>
                <FormGroup>
                  <Label for="email">Email *</Label>
                  <Input
                    type="email"
                    name="email"
                    id="email"
                    placeholder="name@domain.com"
                    value={ user ? user.email : '' }
                    onChange={ handleInputChange }
                    autoComplete="email"
                    valid={ emailValidator(user ? user.email : '').result }
                    invalid={
                      errors && errors.email
                        ? errors.email.result !== true
                        : false
                    }
                  />
                  <FormFeedback tooltip>
                    { errors && errors.email ? errors.email.msg : '' }
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
                rows={ 3 }
                value={ user ? user.description : '' }
                onChange={ handleInputChange }
                valid={
                  textValidator(user ? user.description : '', 0, 254).result
                }
              />
            </FormGroup>
            <Button onClick={ handleSubmit } className="mt-3">
              Update
            </Button>
          </Form>
        </Col>
        <Col sm={ 6 } xs={ 12 } key="col2">
          <h3>Privacy settings</h3>
          <p>This settings can be filled or changed later.</p>
          <Form>
            <FormGroup check>
              <Input
                type="checkbox"
                name="useNickName"
                id="useNickName"
                onChange={ handleInputChange }
                checked={ user ? user.useNickName : false }
              />
              <Label for="useNickName" check>
                I want to hide my name and use nickname
              </Label>
            </FormGroup>
            <Collapse isOpen={ user ? user.useNickName : false }>
              <FormGroup>
                <Label for="nickname">My nickname will be</Label>
                <Input
                  type="text"
                  name="nickname"
                  id="nickname"
                  placeholder="TheBestStudentEver"
                  onChange={ handleInputChange }
                  value={ user ? user.nickname : '' }
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
                  { errors && errors.nickname ? errors.nickname.msg : '' }
                </FormFeedback>
              </FormGroup>
              <FormGroup check>
                <Input
                  type="checkbox"
                  name="nickNameTeamException"
                  id="nickNameTeamException-teacher"
                  onChange={ () => handleToggleNickException() }
                  checked={ user ? !user.nickNameTeamException : false }
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
                  onChange={ () => handleToggleNickException() }
                  checked={ user ? user.nickNameTeamException : false }
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
                onChange={ handleInputChange }
                checked={ user ? user.publicProfile : false }
              />
              <Label for="publicProfile" check>
                My profile is completely public
              </Label>
            </FormGroup>
            <Collapse isOpen={ user && !user.publicProfile } className="ml-3 mt-2 font-weight-normal">
              <FormGroup check>
                <Input
                  type="checkbox"
                  name="showCourses"
                  id="showCourses"
                  onChange={ handleInputChange }
                  checked={ user ? user.showCourses : false }
                />
                <Label for="showCourses">Show my courses</Label>
              </FormGroup>
              <FormGroup check>
                <Input
                  type="checkbox"
                  name="showBadges"
                  id="showBadges"
                  onChange={ handleInputChange }
                  checked={ user ? user.showBadges : false }
                />
                <Label for="showBadges">Show my badges</Label>
              </FormGroup>
              <FormGroup check>
                <Input
                  type="checkbox"
                  name="allowContact"
                  id="allowContact"
                  onChange={ handleInputChange }
                  checked={ user ? user.allowContact : false }
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


















/*

class Profile extends Component {
  constructor(props) {
    super(props)
    const result1 = this.props.getUser(getUserID())
    console.log(result1)
    this.handleSubmit = this.handleSubmit.bind(this)
    this.validation = this.validation.bind(this)
    this.handleInputChange = this.handleInputChange.bind(this)
    this.fetchCurrentData = this.fetchCurrentData.bind(this)
    this.handleToggleNickException = this.handleToggleNickException.bind(this)
    this.state = {
      user: null,
      errors: {},
      be_error: null,
      success: false,
    }
  } 

  componentDidMount() {
    this.fetchCurrentData()
    document.addEventListener('keyup', event => {
      if(event.keyCode === 13) {
        event.preventDefault()
        this.handleSubmit()
      }
    })
  }

  fetchCurrentData() {
   // const result = userApi.endpoints.getUser.select(getUserID())(this.props)
   // const { data, status, error } = result
   // console.log(status)
    //console.log(result)
  /*  fetch(`${ BACKEND_URL }data/user/${ getUserID() }`, { 
      method: 'GET',
      headers: authHeader(),
      mode: 'cors',
      credentials: 'omit',
    })
      .then(response => {
        if(!response.ok) throw new Error(response);
        else return response.json();
      })
      .then(data => {
        if(data && data['@graph']) {
          const user = data['@graph'][0]
          this.setState({user})
        }
      })*/
 // }
//}

const mapStateToProps = state => {
  return state
}
/*
const mapDispatchToProps = {
  getUser: userApi.endpoints.getUser.initiate,
  updateUser: userApi.endpoints.updateUser.initiate
};*/

export default withRouter(connect(mapStateToProps)(Profile))
