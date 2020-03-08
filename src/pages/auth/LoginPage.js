import React, { Component } from 'react';
import { Col, Row, Button, Form, FormGroup, Label, Input, FormFeedback } from 'reactstrap';
import {emailValidator, passwordValidator} from "../../functions/validators";
import {connect} from "react-redux";
import {withRouter} from "react-router-dom";
import { store } from '../../index';
import {setToken, setUser} from "../../redux/actions/authActions";
import GithubAuth from '../../components/auth/GithubAuth';

class LoginPage extends Component {
    constructor(props) {
        super(props);
        this.authenticate = this.authenticate.bind(this);
        this.loginValidation = this.loginValidation.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
        this.state={
            email: '',
            password: '',
            errors: {
                email: null,
                password: null,
            },
        }
    }

    handleInputChange(event) {
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;
        this.setState({[name] : value});
    }

    authenticate() {
        if(this.loginValidation()) {
            const {email, password} = this.state;
            // todo backend fetch
            store.dispatch(setToken({name: '_token', value: 'token'}));
            store.dispatch(setUser({name: 'user', value: {
                    name: 'Test login',
                    avatar: null,
                    type: 'student',
                }}));
            this.props.history.push('/dashboard');
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
        const {email, password, errors} = this.state;
        return (
            <React.Fragment>
                <h1 className={"mb-5"}>Login page</h1>
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