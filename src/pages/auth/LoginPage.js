import React, {Component} from 'react';
import {
  Alert,
  Button,
  Col,
  Container,
  Form,
  FormFeedback,
  FormGroup,
  Input,
  Label,
  Row,
} from 'reactstrap'
import {connect} from 'react-redux';
import {withRouter} from 'react-router-dom';
import {emailValidator, passwordValidator} from '../../functions/validators';
import GithubAuth from '../../components/Auth/GithubAuth';
import {registerData} from '../../components/Auth';
import {BACKEND_URL} from '../../configuration/api';

class LoginPage extends Component {
  constructor(props) {
    super(props);
    this.authenticate = this.authenticate.bind(this);
    this.loginValidation = this.loginValidation.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    // eslint-disable-next-line react/state-in-constructor
    this.state = {
      email: '',
      password: '',
      loginURL: `${BACKEND_URL}/auth/login`,
      errors: {
        email: null,
        password: null,
      },
      beError: null,
    };
  }

  componentDidMount() {
    document.addEventListener('keyup', event => {
      if (event.keyCode === 13) {
        event.preventDefault();
        this.authenticate();
      }
    });
  }

  handleInputChange(event) {
    const { target } = event;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const { name } = target;
    this.setState({ [name]: value });
  }

  authenticate() {
    if (this.loginValidation()) {
      const { email, password, loginURL } = this.state;
      const header = new Headers({
        'Content-Type': 'application/json',
        Accept: 'application/json',
        'Cache-Control': 'no-cache',
      });
      const formData = {
        email,
        password,
      };
      fetch(loginURL, {
        method: 'POST',
        headers: header,
        mode: 'cors',
        credentials: 'omit',
        body: JSON.stringify(formData),
      })
        .then(response => {
          if (!response.ok) throw new Error(response);
          else return response.json();
        })
        .then(data => {
          if (data.status) {
            // eslint-disable-next-line no-underscore-dangle
            if (registerData(data._token, data.user)) {
              // eslint-disable-next-line react/destructuring-assignment
              this.props.history.push(`/dashboard`);
            } else {
              this.setState({
                beError: 'Something was wrong. Please, try it again.',
              });
            }
          } else {
            this.setState({ beError: data.msg });
          }
        });
    }
  }

  loginValidation() {
    const { email, password, errors } = this.state;
    errors.email = emailValidator(email);
    errors.password = passwordValidator(password);
    this.setState({ errors });
    return errors.email.result && errors.password.result;
  }

  render() {
    const { email, password, errors, beError } = this.state;
    return (
      <Container className="mb-5">
        <h1 className="mb-5">Login page</h1>
        {beError ? <Alert color="danger">Error! { beError } </Alert> : null}
        <Row>
          <Col sm={{ size: 4, offset: 4 }} xs={12}>
            <Form>
              <Row form>
                <Col xs={12}>
                  <FormGroup>
                    <Label for="email">Email</Label>
                    <Input
                      type="email"
                      name="email"
                      id="email"
                      placeholder="name@domain.com"
                      value={email}
                      onChange={this.handleInputChange}
                      autoComplete="email"
                      valid={emailValidator(email).result}
                      invalid={
                        errors.email ? errors.email.result !== true : false
                      }
                    />
                    <FormFeedback tooltip>
                      {errors.email ? errors.email.msg : ''}
                    </FormFeedback>
                  </FormGroup>
                </Col>
                <Col xs={12}>
                  <FormGroup>
                    <Label for="password">Password *</Label>
                    <Input
                      type="password"
                      name="password"
                      id="password"
                      placeholder="*****************"
                      value={password}
                      onChange={this.handleInputChange}
                      autoComplete="password"
                      valid={passwordValidator(password).result}
                      invalid={
                        errors.password
                          ? errors.password.result !== true
                          : false
                      }
                    />
                    <FormFeedback tooltip>
                      {errors.password ? errors.password.msg : ''}
                    </FormFeedback>
                  </FormGroup>
                </Col>
              </Row>
              <Button onClick={() => this.authenticate()}>Sign in</Button>
            </Form>
            <GithubAuth />
          </Col>
        </Row>
      </Container>
    );
  }
}

const mapStateToProps = state => {
  return state;
};

export default withRouter(connect(mapStateToProps)(LoginPage));
