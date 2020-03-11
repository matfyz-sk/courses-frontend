import React, { Component } from 'react';
import { Col, Row, Button, Form, FormGroup, Label, Input, FormFeedback, Alert } from 'reactstrap';
import {emailValidator, passwordValidator} from "../../functions/validators";
import {connect} from "react-redux";
import {withRouter} from "react-router-dom";
import GithubAuth from '../../components/auth/GithubAuth';
import {registerData} from "../../components/auth/Auth";

class LoginPage extends Component {
    constructor(props) {
        super(props);
        this.authenticate = this.authenticate.bind(this);
        this.loginValidation = this.loginValidation.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
        this.state={
            email: '',
            password: '',
            login_url: 'http://matfyz.sk:3010/auth/login',
            errors: {
                email: null,
                password: null,
            },
            be_error: null,
        }
    }

    componentDidMount() {
        document.addEventListener("keyup", (event) => {
            if (event.keyCode === 13) {
                event.preventDefault();
                this.authenticate();
            }
        });
    }

    handleInputChange(event) {
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;
        this.setState({[name] : value});
    }

    authenticate() {
        if(this.loginValidation()) {
            const {email, password, login_url} = this.state;
            const header = new Headers({
                'Content-Type':     'application/json',
                "Accept":           "application/json",
                'Cache-Control':    'no-cache',
            });
            const formData = {
                "email": email,
                "password": password
            };
            fetch(login_url, {
                method: 'POST',
                headers: header,
                mode: 'cors',
                credentials: 'omit',
                body: JSON.stringify(formData)
            }).then(response => {
                if(!response.ok) throw new Error(response)
                else return response.json();
            }).then(data=> {
                if(data.status) {
                    if(registerData(data._token, data.user)) {
                        this.props.history.push(`/dashboard`);
                    }
                    else {
                        this.setState({be_error:"Something was wrong. Please, try it again."})
                    }
                }
                else {
                    this.setState({be_error:data.msg})
                }
            });
        }
    }

    loginValidation() {
        const {email, password, errors} = this.state;
        errors.email = emailValidator(email);
        errors.password = passwordValidator(password);
        this.setState({errors});
        return errors.email.result && errors.password.result;
    }

    render() {
        const {email, password, errors, be_error} = this.state;
        return (
            <React.Fragment>
                <h1 className={"mb-5"}>Login page</h1>
                {be_error ?
                    <Alert color="danger">
                        Error! {be_error}
                    </Alert>
                    : null}
                <Row>
                    <Col sm={{ size: 4, offset: 4 }} xs={12}>
                        <Form>
                            <Row form>
                                <Col xs={12}>
                                    <FormGroup>
                                        <Label for="email">Email</Label>
                                        <Input type="email" name="email" id="email" placeholder="nora@example.com"
                                               value={email} onChange={this.handleInputChange} autoComplete={"email"}
                                               valid={emailValidator(email).result}
                                               invalid={errors.email ? errors.email.result !== true : false}
                                        />
                                        <FormFeedback tooltip>{errors.email ? errors.email.msg : ""}</FormFeedback>
                                    </FormGroup>
                                </Col>
                                <Col xs={12}>
                                    <FormGroup>
                                        <Label for="password">Password *</Label>
                                        <Input type="password" name="password" id="password" placeholder="*****************"
                                               value={password} onChange={this.handleInputChange} autoComplete={"password"}
                                               valid={passwordValidator(password).result}
                                               invalid={errors.password ? errors.password.result !== true : false}
                                        />
                                        <FormFeedback tooltip>{errors.password ? errors.password.msg : ""}</FormFeedback>
                                    </FormGroup>
                                </Col>
                            </Row>
                            <Button onClick={()=>this.authenticate()}>Sign in</Button>
                        </Form>
                        <GithubAuth />
                    </Col>
                </Row>
            </React.Fragment>
        )
    }
}

const mapStateToProps=(state)=>{
    return state
};

export default withRouter(connect(mapStateToProps)(LoginPage))