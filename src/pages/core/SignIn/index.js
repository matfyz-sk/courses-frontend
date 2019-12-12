import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { compose } from 'recompose';
import { SignUpLink } from '../SignUp';
import { PasswordForgetLink } from '../PasswordForget';
import { withFirebase } from '../Firebase';
import * as ROUTES from '../../constants/routes';
import { Button, Form, FormGroup, Label, Input } from 'reactstrap';
import './SignIn.css';
import Navigation from "../Navigation";

const SignInPage = () => (
    <div>
        <Navigation />
        <main>
            <div className="sign-in-div">
                <h1>Sign In</h1>
                <SignInForm />
                <PasswordForgetLink/>
                <SignUpLink />
            </div>
        </main>
    </div>
);

const INITIAL_STATE = {
    username: '',
    email: '',
    password: '',
    error: null,
};

class SignInFormBase extends Component {
    constructor(props) {
        super(props);

        this.state = { ...INITIAL_STATE };
    }

    onSubmit = event => {
        const { email, password } = this.state;

        this.props.firebase
            .doSignInWithEmailAndPassword(email, password)
            .then(authUser => {
                this.setState({ error: null });
                this.props.history.push(ROUTES.COURSES);
            })
            .catch(error => {
                this.setState({ error });
            });

        event.preventDefault();
    };

    onChange = event => {
        this.setState({ [event.target.name]: event.target.value });
    };

    render() {
        const { email, password, error } = this.state;

        const isInvalid = password === '' || email === '';

        return (
            <Form onSubmit={this.onSubmit}>
                <FormGroup>
                    <Label for="email">Email</Label>
                    <Input
                        name="email"
                        id="email"
                        value={email}
                        onChange={this.onChange}
                        type="text"
                        placeholder="Email Address"
                    />
                    <Label for="password">Password</Label>
                    <Input
                        name="password"
                        id="password"
                        value={password}
                        onChange={this.onChange}
                        type="password"
                        placeholder="Password"
                    />
                </FormGroup>
                <Button disabled={isInvalid} type="submit">
                    Sign In
                </Button>

                {error && <p>{error.message}</p>}
            </Form>
        );
    }
}

const SignInForm = compose(
    withRouter,
    withFirebase,
)(SignInFormBase);

export default SignInPage;

export { SignInForm };