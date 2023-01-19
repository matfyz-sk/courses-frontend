import React, { useState, useEffect } from 'react';
import { Alert, Button, Col, Collapse, Container, Form, FormFeedback, FormGroup, Input, Label, Row, } from 'reactstrap';
import { emailValidator, passwordValidator, textValidator, } from '../../functions/validators';
import { registerData } from '../../components/Auth';
import { useRegisterMutation } from 'services/auth'

export default function RegisterPage(props) {
  //user
  const [first_name, setFirstName] = useState('')
  const [last_name, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [description, setDescription] = useState('')
  //Privacy
  const [nickname, setNickname] = useState('')
  const [use_nickname, setUseNickname] = useState(false)
  const [public_profile, setPublicProfile] = useState(true)
  const [show_courses, setShowCourses] = useState(false)
  const [show_badges, setShowBadges] = useState(false)
  const [allow_contact, setAllowContact] = useState(false)
  const [nickNameTeamException, setNickNameTeamException] = useState(false)
  //Errors
  const [firstNameError, setFirstNameError] = useState(null)
  const [lastNameError, setLastNameError] = useState(null)
  const [emailError, setEmailError] = useState(null)
  const [passwordError, setPasswordError] = useState(null)
  const [confirmedConditionsError, setConfirmedConditionError] = useState(null)
  const [nicknameError, setNicknameError] = useState(null)

  const [be_error, setBeError] = useState(null)
  const [confirmed_conditions, setConfirmedCondition] = useState(false)
  const [register, result] = useRegisterMutation()
  
  // This does the same thing as componentDidMount
  useEffect(() => {
    document.addEventListener('keyup', event => {
      if(event.keyCode === 13) {
        event.preventDefault()
        handleSubmit()
      }
    });
  }, [])

  const handleSubmit = () => {
    if(registerValidation()) {
      const formData = {
        user: {
          first_name,
          last_name,
          email,
          password,
          description,
        },
        privacy: {
          nickname,
          use_nickname,
          public_profile,
          show_courses,
          show_badges,
          allow_contact,
          nickNameTeamException,
        }
      }
      register(formData).unwrap().then(response => {
        if(response.status) {
          if(registerData(response._token, response.user)) {
            // eslint-disable-next-line react/destructuring-assignment
            props.history.push(`/dashboard`);
          } else {
            setBeError('Something was wrong. Please, try it again.')
          }
        } else {
          setBeError(response.msg)
        }
      })
    }
  }

  const registerValidation = () => {
    const newFirstNameError = textValidator(first_name, 3, 20)
    const newLastNameError = textValidator(last_name, 3, 20)
    const newEmailError = emailValidator(email)
    const newPasswordError =  passwordValidator(password)
    const newConfirmedConditionsError = confirmed_conditions === true
    let newNickNameError = null
    if(use_nickname) {
      newNickNameError = textValidator(nickname, 5, 20)
    }
    setFirstNameError(newFirstNameError)
    setLastNameError(newLastNameError)
    setEmailError(newEmailError)
    setPasswordError(newPasswordError)
    setConfirmedConditionError(newConfirmedConditionsError)
    setNicknameError(newNickNameError)
    return (
      newFirstNameError.result &&
      newLastNameError.result &&
      newEmailError.result &&
      newPasswordError.result &&
      newConfirmedConditionsError &&
      (newNickNameError === null || newNickNameError.result === true)
    );
  }

  return (
    <Container className="mb-5">
      <h1 className="mb-5">Register profile</h1>
      { be_error ? <Alert color="danger">Error! { be_error }</Alert> : null }
      <Row>
        <Col sm={ 6 } xs={ 12 } key="col1">
          <h3>Basic information</h3>
          <p>Complete all required information to register your profile.</p>
          <Form>
            <Row form>
              <Col md={ 6 } key="bi-1">
                <FormGroup>
                  <Label for="first_name">Name *</Label>
                  <Input
                    type="text"
                    name="first_name"
                    id="first_name"
                    placeholder="My first name"
                    value={ first_name }
                    onChange={ e => setFirstName(e.target.value) }
                    autoComplete="first_name"
                    valid={ textValidator(first_name, 3, 20).result }
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
                  <Label for="last_name">Surname *</Label>
                  <Input
                    type="text"
                    name="last_name"
                    id="last_name"
                    placeholder="My last name"
                    value={ last_name }
                    onChange={ e => setLastName(e.target.value) }
                    autoComplete="last_name"
                    valid={ textValidator(last_name, 3, 20).result }
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
                      emailError ? emailError.result !== true : false
                    }
                  />
                  <FormFeedback tooltip>
                    { emailError ? emailError.msg : '' }
                  </FormFeedback>
                </FormGroup>
              </Col>
              <Col md={ 6 }>
                <FormGroup>
                  <Label for="password">Password *</Label>
                  <Input
                    type="password"
                    name="password"
                    id="password"
                    placeholder="*****************"
                    value={ password }
                    onChange={ e => setPassword(e.target.value) }
                    autoComplete="password"
                    valid={ passwordValidator(password).result }
                    invalid={
                      passwordError
                        ? passwordError.result !== true
                        : false
                    }
                  />
                  <FormFeedback tooltip>
                    { passwordError ? passwordError.msg : '' }
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
                valid={ textValidator(description, 0, 254).result }
              />
            </FormGroup>
            <FormGroup check>
              <Input
                type="checkbox"
                name="confirmed_conditions"
                id="confirmed_conditions"
                checked={ confirmed_conditions }
                onChange={ e => setConfirmedCondition(e.target.checked) }
                invalid={
                  confirmedConditionsError !== null
                    ? !confirmedConditionsError
                    : null
                }
              />
              <Label for="confirmed_conditions" check>Accept <a href="/privacy-policy" target={ "_blank" }>register
                conditions</a> *</Label>
              <FormFeedback tooltip>
                You must accept this conditions!
              </FormFeedback>
            </FormGroup>
            <Button onClick={ handleSubmit } className="mt-3">
              Register NOW!
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
                name="use_nickname"
                id="use_nickname"
                onChange={ e => setUseNickname(e.target.checked) }
                checked={ use_nickname }
              />
              <Label for="use_nickname" check>
                I want to hide my name and use nickname
              </Label>
            </FormGroup>
            <Collapse isOpen={ use_nickname }>
              <FormGroup>
                <Label for="nickname">My nickname will be</Label>
                <Input
                  type="text"
                  name="nickname"
                  id="nickname"
                  placeholder="TheBestStudentEver"
                  onChange={ e => setNickname(e.target.value) }
                  checked={ nickname }
                  valid={ textValidator(nickname, 5, 20).result }
                  invalid={
                    nicknameError ? nicknameError.result !== true : false
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
                name="public_profile"
                id="public_profile"
                onChange={ e => setPublicProfile(e.target.checked) }
                checked={ public_profile }
              />
              <Label for="public_profile" check>
                My profile is completely public
              </Label>
            </FormGroup>
            <Collapse isOpen={ !public_profile } className="ml-3 mt-2 font-weight-normal">
              <FormGroup check>
                <Input
                  type="checkbox"
                  name="show_courses"
                  id="show_courses"
                  onChange={ e => setShowCourses(e.target.checked) }
                  checked={ show_courses }
                />
                <Label for="show_courses">Show my courses</Label>
              </FormGroup>
              <FormGroup check>
                <Input
                  type="checkbox"
                  name="show_badges"
                  id="show_badges"
                  onChange={ e => setShowBadges(e.target.checked) }
                  checked={ show_badges }
                />
                <Label for="show_badges">Show my badges</Label>
              </FormGroup>
              <FormGroup check>
                <Input
                  type="checkbox"
                  name="allow_contact"
                  id="allow_contact"
                  onChange={ e => setAllowContact(e.target.checked) }
                  checked={ allow_contact }
                />
                <Label for="allow_contact">Allow contact me</Label>
              </FormGroup>
            </Collapse>
          </Form>
        </Col>
      </Row>
    </Container>
  )
}
