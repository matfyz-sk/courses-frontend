import React, { useState, useEffect } from 'react'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import { Alert, Button, Col, Collapse, Container, Form, FormFeedback, FormGroup, Input, Label, Row, } from 'reactstrap'
import { emailValidator, textValidator } from '../../functions/validators'
import { getUser, getUserID, logout, setUserProfile, } from '../../components/Auth'
import { useUpdateUserInfoMutation, useDeleteUserMutation, useGetUserQuery } from 'services/user'

function RegisterCompletion(props) {
  const user = getUser()
  //user
  const [firstName, setFirstName] = useState(user ? user.firstName : '')
  const [lastName, setLastName] = useState(user ? user.lastName : '')
  const [email, setEmail] = useState(user ? user.email : '')
  const [description, setDescription] = useState(user ? user.description : '')
  //Privacy
  const [nickname, setNickname] = useState(user ? user.nickname : '')
  const [useNickName, setUseNickName] = useState(user ? user.useNickName : false)
  const [publicProfile, setPublicProfile] = useState(user ? user.publicProfile : true)
  const [showCourses, setShowCourses] = useState(user ? user.showCourses : false)
  const [showBadges, setShowBadges] = useState(user ? user.showBadges : false)
  const [allowContact, setAllowContact] = useState(user ? user.allowContact : false)
  const [nickNameTeamException, setNickNameTeamException] = useState(user ? user.nickNameTeamException : false)
  //Errors
  const [firstNameError, setFirstNameError] = useState(null)
  const [lastNameError, setLastNameError] = useState(null)
  const [emailError, setEmailError] = useState(null)
  const [nicknameError, setNicknameError] = useState(null)

  const [be_error, setBeError] = useState(null)
  const [success, setSuccess] = useState(false)
  const [updateUser, updateUserResult] = useUpdateUserInfoMutation()
  const [deleteUser, deleteUserResult] = useDeleteUserMutation()

  if(emailError && emailError.result) {
    const {data, isSuccess} = useGetUserQuery({email: email})
    if(isSuccess && data && data.length > 0) {
      setEmailError({result: false, msg: 'Sorry, but email is already taken!'})
    } else {
      validation()
      setEmailError(null)
    }
  }

  // This does the same thing as componentDidMount
  useEffect(() => {
    document.getElementsByClassName('main-nav')[0].style.opacity = 0
    document.addEventListener('keyup', event => {
      if(event.keyCode === 13) {
        event.preventDefault()
        checkEmailExisting()
      }
    })
  }, [])

  const validation = () => {
    if(user === null) {
      return false
    }
    const newFirstNameError = textValidator(firstName, 3, 20)
    const newLastNameError = textValidator(lastName, 3, 20)
    let newNickNameError = null
    if(useNickName) {
      newNickNameError = textValidator(nickname, 5, 20)
    }

    setFirstNameError(newFirstNameError)
    setLastNameError(newLastNameError)
    setNicknameError(newNickNameError)
    const result = (
      newFirstNameError.result &&
      newLastNameError.result &&
      emailError.result &&
      (newNickNameError === null || newNickNameError.result === true)
    )
    if(result) {
      handleSubmit()
    }
  }

  const handleSubmit = () => {
    const updatedAttrs = [
      'firstName', 'lastName', 'description', 'email',
      'nickname', 'useNickName', 'nickNameTeamException', 'allowContact', 'publicProfile', 'showBadges', 'showCourses'
    ]
    const body = {}
    for(let i = 0; i < updatedAttrs.length; i++) {
      body[updatedAttrs[i]] = user[updatedAttrs[i]]
    }

    updateUser({
      id: getUserID(), 
      patch: body
    }).unwrap().then(response => {
      setUserProfile(body)
      document.getElementsByClassName('main-nav')[0].style.opacity = 1
      props.history.push('/dashboard')
    }).catch(error => {
      throw new Error("Failed to execute PATCH request to update user information")
    })
  }

  const checkEmailExisting = () => {
    const newEmailError = emailValidator(email)
    setEmailError(newEmailError)
    return false
  }

  const removeAccount = () => {
    deleteUser(getUserID()).unwrap().then(response => {
      logout()
      document.getElementsByClassName('main-nav')[0].style.opacity = 1
      props.history.push('/')
    })
  }

  return (
    <Container className="mb-5">
      <Row>
        <Col xs={ 12 }>
          <h1>This account is new!</h1>
          <h2 className="mb-5">Fill your profile and set your privacy.</h2>
        </Col>
      </Row>
      <Alert color="warning" className="mb-3">
        If your <b>already have account in this system</b> and you <b>dont want to create new one</b>, remove this
        settings and go back to login!
        <br/>
        <div className="text-sm-right text-center">
          <Button color="danger" className="mt-3" onClick={ removeAccount }>Remove settings and go
            back</Button>
        </div>
      </Alert>
      { be_error ? <Alert color="danger">Error!{ be_error }</Alert> : null }
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
                    value={ firstName }
                    onChange={ e => setFirstName(e.target.value) }
                    autoComplete="firstName"
                    valid={
                      textValidator(firstName, 3, 20).result
                    }
                    invalid={
                      firstNameError
                        ? firstNameError.result !== true
                        : false
                    }
                  />
                  <FormFeedback tooltip>
                    { firstNameError ? firstNameError.msg : '' }
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
                    value={ lastName }
                    onChange={ e => setLastName(e.target.value) }
                    autoComplete="lastName"
                    valid={
                      textValidator(lastName, 3, 20).result
                    }
                    invalid={
                      lastNameError
                        ? lastNameError.result !== true
                        : false
                    }
                  />
                  <FormFeedback tooltip>
                    { lastNameError ? lastNameError.msg : '' }
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
                    value={ email }
                    onChange={ e => setEmail(e.target.value) }
                    autoComplete="email"
                    valid={ emailValidator(email).result }
                    invalid={
                      emailError
                        ? emailError.result !== true
                        : false
                    }
                  />
                  <FormFeedback tooltip>
                    { emailError ? emailError.msg : '' }
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
                value={ description }
                onChange={ e => setDescription(e.target.value) }
                valid={
                  textValidator(description, 0, 254).result
                }
              />
            </FormGroup>
            <Button onClick={ checkEmailExisting } className="mt-3" color="success">
              Create profile
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
                onChange={ e => setUseNickName(e.target.checked) }
                checked={ useNickName }
              />
              <Label for="useNickName" check>
                I want to hide my name and use nickname
              </Label>
            </FormGroup>
            <Collapse isOpen={ useNickName }>
              <FormGroup>
                <Label for="nickname">My nickname will be</Label>
                <Input
                  type="text"
                  name="nickname"
                  id="nickname"
                  placeholder="TheBestStudentEver"
                  onChange={ e => setNickname(e.target.value) }
                  value={ nickname }
                  valid={
                    textValidator(nickname, 5, 20).result
                  }
                  invalid={
                    nicknameError
                      ? nicknameError.result !== true
                      : false
                  }
                />
                <FormFeedback tooltip>
                  { nicknameError ? nicknameError.msg : '' }
                </FormFeedback>
              </FormGroup>
              <FormGroup check>
                <Input
                  type="checkbox"
                  name="nickNameTeamException"
                  id="nickNameTeamException-teacher"
                  onChange={ e => setNickNameTeamException(e.target.checked) }
                  checked={ !nickNameTeamException }
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
                  onChange={ e => setNickNameTeamException(e.target.checked) }
                  checked={ nickNameTeamException }
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
                onChange={ e => setPublicProfile(e.target.checked) }
                checked={ publicProfile }
              />
              <Label for="publicProfile" check>
                My profile is public
              </Label>
            </FormGroup>
            <Collapse isOpen={ user && !user.publicProfile }>
              <FormGroup check>
                <Input
                  type="checkbox"
                  name="showCourses"
                  id="showCourses"
                  onChange={ e => setShowCourses(e.target.checked) }
                  checked={ showCourses }
                />
                <Label for="showCourses">Show my courses</Label>
              </FormGroup>
              <FormGroup check>
                <Input
                  type="checkbox"
                  name="showBadges"
                  id="showBadges"
                  onChange={ e => setShowBadges(e.target.checked) }
                  checked={ showBadges }
                />
                <Label for="showBadges">Show my badges</Label>
              </FormGroup>
              <FormGroup check>
                <Input
                  type="checkbox"
                  name="allowContact"
                  id="allowContact"
                  onChange={ e => setAllowContact(e.target.checked) }
                  checked={ allowContact }
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

const mapStateToProps = state => {
  return state
}

export default withRouter(connect(mapStateToProps)(RegisterCompletion))
