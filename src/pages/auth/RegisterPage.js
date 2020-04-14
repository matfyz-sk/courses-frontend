import React, { Component } from 'react';
import {
  Col,
  Row,
  Button,
  Form,
  FormGroup,
  Label,
  Input,
  Collapse,
  FormFeedback,
  Alert,
} from 'reactstrap';
import {
  emailValidator,
  textValidator,
  passwordValidator,
} from '../../functions/validators';
import { registerData } from '../../components/Auth';

export default class RegisterPage extends Component {
  constructor(props) {
    super(props);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handlePrivacyChange = this.handlePrivacyChange.bind(this);
    this.registerValidation = this.registerValidation.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.state = {
      user: {
        first_name: '', // required
        last_name: '', // required
        email: '', // required
        password: '', // required
        description: '',
      },
      privacy: {
        nickname: '', // required if use_nickname is true
        use_nickname: false,
        public_profile: true,
        show_courses: false,
        show_badges: false,
        allow_contact: false,
      },
      errors: {
        first_name: null,
        last_name: null,
        email: null,
        password: null,
        confirmed_conditions: null,
        nickname: null,
      },
      be_error: null,
      confirmed_conditions: false,
      register_url: 'http://matfyz.sk:3010/auth/register',
    };
  }

  componentDidMount() {
    document.addEventListener('keyup', event => {
      if (event.keyCode === 13) {
        event.preventDefault();
        this.handleSubmit();
      }
    });
  }

  handleSubmit() {
    if (this.registerValidation()) {
      const header = new Headers({
        'Content-Type': 'application/json',
        Accept: 'application/json',
        'Cache-Control': 'no-cache',
      });
      const formData = {
        user: this.state.user,
        privacy: this.state.privacy,
      };

      fetch(this.state.register_url, {
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
            if (registerData(data._token, data.user)) {
              // eslint-disable-next-line react/destructuring-assignment
              this.props.history.push(`/dashboard`);
            } else {
              this.setState({
                be_error: 'Something was wrong. Please, try it again.',
              });
            }
          } else {
            this.setState({ be_error: data.msg });
          }
        });
    }
  }

  registerValidation() {
    const { errors, user, confirmed_conditions, privacy } = this.state;
    errors.first_name = textValidator(user.first_name, 3, 20);
    errors.last_name = textValidator(user.last_name, 3, 20);
    errors.email = emailValidator(user.email);
    errors.password = passwordValidator(user.password);
    errors.confirmed_conditions = confirmed_conditions === true;
    if (privacy.use_nickname) {
      errors.nickname = textValidator(privacy.nickname, 5, 20);
    } else {
      errors.nickname = null;
    }
    this.setState({ errors });
    return (
      errors.first_name.result &&
      errors.last_name.result &&
      errors.email.result &&
      errors.password.result &&
      confirmed_conditions === true &&
      (errors.nickname === null || errors.nickname.result === true)
    );
  }

  handleInputChange(event) {
    const { target } = event;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const { name } = target;
    const { user } = this.state;
    user[name] = value;
    this.setState({ user });
  }

  handlePrivacyChange(event) {
    const { target } = event;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const { name } = target;
    const { privacy } = this.state;
    privacy[name] = value;
    this.setState({ privacy });
  }

  render() {
    const {
      user,
      privacy,
      confirmed_conditions,
      errors,
      be_error,
    } = this.state;
    return (
      <>
        <h1 className="mb-5">Register profile</h1>
        {be_error ? <Alert color="danger">Error! {be_error}</Alert> : null}
        <Row>
          <Col sm={6} xs={12} key="col1">
            <h3>Basic information</h3>
            <p>Complete all required information to register your profile.</p>
            <Form>
              <Row form>
                <Col md={6} key="bi-1">
                  <FormGroup>
                    <Label for="first_name">Name *</Label>
                    <Input
                      type="text"
                      name="first_name"
                      id="first_name"
                      placeholder="Nora"
                      value={user.first_name}
                      onChange={this.handleInputChange}
                      autoComplete="first_name"
                      valid={textValidator(user.first_name, 3, 20).result}
                      invalid={
                        errors.first_name
                          ? errors.first_name.result !== true
                          : false
                      }
                    />
                    <FormFeedback tooltip>
                      {errors.first_name ? errors.first_name.msg : ''}
                    </FormFeedback>
                  </FormGroup>
                </Col>
                <Col md={6} key="bi-2">
                  <FormGroup>
                    <Label for="last_name">Surname *</Label>
                    <Input
                      type="text"
                      name="last_name"
                      id="last_name"
                      placeholder="Mojsejova"
                      value={user.last_name}
                      onChange={this.handleInputChange}
                      autoComplete="last_name"
                      valid={textValidator(user.last_name, 3, 20).result}
                      invalid={
                        errors.last_name
                          ? errors.last_name.result !== true
                          : false
                      }
                    />
                    <FormFeedback tooltip>
                      {errors.last_name ? errors.last_name.msg : ''}
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
                      placeholder="nora@example.com"
                      value={user.email}
                      onChange={this.handleInputChange}
                      autoComplete="email"
                      valid={emailValidator(user.email).result}
                      invalid={
                        errors.email ? errors.email.result !== true : false
                      }
                    />
                    <FormFeedback tooltip>
                      {errors.email ? errors.email.msg : ''}
                    </FormFeedback>
                  </FormGroup>
                </Col>
                <Col md={6}>
                  <FormGroup>
                    <Label for="password">Password *</Label>
                    <Input
                      type="password"
                      name="password"
                      id="password"
                      placeholder="*****************"
                      value={user.password}
                      onChange={this.handleInputChange}
                      autoComplete="password"
                      valid={passwordValidator(user.password).result}
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
              <FormGroup>
                <Label for="description">About me</Label>
                <Input
                  type="textarea"
                  name="description"
                  id="description"
                  placeholder="I am ..."
                  rows={3}
                  value={user.description}
                  onChange={this.handleInputChange}
                  valid={textValidator(user.description, 0, 254).result}
                />
              </FormGroup>
              <FormGroup check>
                <Input
                  type="checkbox"
                  name="confirmed_conditions"
                  id="confirmed_conditions"
                  checked={confirmed_conditions}
                  onChange={() =>
                    this.setState({
                      confirmed_conditions: !confirmed_conditions,
                    })}
                  invalid={
                    errors.confirmed_conditions !== null
                      ? !errors.confirmed_conditions
                      : null
                  }
                />
                <Label for="confirmed_conditions" check>Accept <a href="/privacy-policy" target={"_blank"}>register conditions</a> *</Label>
                <FormFeedback tooltip>
                  You must accept this conditions!
                </FormFeedback>
              </FormGroup>
              <Button onClick={this.handleSubmit} className="mt-3">
                Register NOW!
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
                  name="use_nickname"
                  id="use_nickname"
                  onChange={this.handlePrivacyChange}
                  checked={privacy.use_nickname}
                />
                <Label for="use_nickname" check>
                  I want to hide my name and use nickname
                </Label>
              </FormGroup>
              <Collapse isOpen={privacy.use_nickname}>
                <FormGroup>
                  <Label for="nickname">My nickname will be</Label>
                  <Input
                    type="text"
                    name="nickname"
                    id="nickname"
                    placeholder="TheBestStudentEver"
                    onChange={this.handlePrivacyChange}
                    checked={privacy.nickname}
                    valid={textValidator(privacy.nickname, 5, 20).result}
                    invalid={
                      errors.nickname ? errors.nickname.result !== true : false
                    }
                  />
                  <FormFeedback tooltip>
                    {errors.nickname ? errors.nickname.msg : ''}
                  </FormFeedback>
                </FormGroup>
              </Collapse>

              <FormGroup check>
                <Input
                  type="checkbox"
                  name="public_profile"
                  id="public_profile"
                  onChange={this.handlePrivacyChange}
                  checked={privacy.public_profile}
                />
                <Label for="public_profile" check>
                  My profile is public
                </Label>
              </FormGroup>
              <Collapse isOpen={!privacy.public_profile}>
                <FormGroup check>
                  <Input
                    type="checkbox"
                    name="show_courses"
                    id="show_courses"
                    onChange={this.handlePrivacyChange}
                    checked={privacy.show_courses}
                  />
                  <Label for="show_courses">Show my courses</Label>
                </FormGroup>
                <FormGroup check>
                  <Input
                    type="checkbox"
                    name="show_badges"
                    id="show_badges"
                    onChange={this.handlePrivacyChange}
                    checked={privacy.show_badges}
                  />
                  <Label for="show_badges">Show my badges</Label>
                </FormGroup>
                <FormGroup check>
                  <Input
                    type="checkbox"
                    name="allow_contact"
                    id="allow_contact"
                    onChange={this.handlePrivacyChange}
                    checked={privacy.allow_contact}
                  />
                  <Label for="allow_contact">Allow contact me</Label>
                </FormGroup>
              </Collapse>
            </Form>
          </Col>
        </Row>
      </>
    );
  }
}
