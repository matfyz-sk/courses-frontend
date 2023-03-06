import React, { useState, useEffect } from 'react';
import { Alert, Button, Col, Container, Form, FormFeedback, FormGroup, Input, Label, Row, } from 'reactstrap'
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { emailValidator, passwordValidator } from '../../functions/validators';
import GithubAuth from '../../components/Auth/GithubAuth';
import { useLoginMutation } from 'services/auth';
import { registerData } from '../../components/Auth';

function LoginPage(props) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [emailError, setEmailError] = useState(null)
  const [passwordError, setPasswordError] = useState(null)
  const [beError, setBeError] = useState(null)
  const [login, result] = useLoginMutation()

  const onSubmit = (event) => {
    event.preventDefault();
    authenticate();
  }

  const authenticate = () => {
    if(loginValidation()) {
      const formData = {
        email,
        password,
      };
      login(formData).unwrap().then(response => {
        if(response.status) {
          // eslint-disable-next-line no-underscore-dangle
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

  const loginValidation = () => {
    const newEmailError = emailValidator(email)
    const newPasswordError = passwordValidator(password)
    setEmailError(newEmailError);
    setPasswordError(newPasswordError);
    return newEmailError.result && newPasswordError.result;
  }

  return (
    <Container className="mb-5">
      <h1 className="mb-5">Login page</h1>
      { beError ? <Alert color="danger">Error! { beError } </Alert> : null }
      <Row>
        <Col sm={ {size: 4, offset: 4} } xs={ 12 }>
          <Form onSubmit={onSubmit}>
            <Row form>
              <Col xs={ 12 }>
                <FormGroup>
                  <Label for="email">Email</Label>
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
              <Col xs={ 12 }>
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
            <Button onClick={ authenticate } type="submit">Sign in</Button>
          </Form>
          <GithubAuth/>
        </Col>
      </Row>
    </Container>
  )
}

const mapStateToProps = state => {
  return state;
};

export default withRouter(connect(mapStateToProps)(LoginPage));
