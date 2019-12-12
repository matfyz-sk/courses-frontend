import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import { withFirebase } from '../Firebase';
import * as ROUTES from '../../constants/routes';
import { Button, Form, FormGroup, Label, Input } from 'reactstrap';
import Navigation from "../Navigation";

const PasswordForgetPage = () => (
    <div>
        <Navigation />
        <main>
            <div className="sign-in-div">
        <h1>Reset password</h1>
        <PasswordForgetForm />
            </div>
        </main>
    </div>
);

const INITIAL_STATE = {
    email: '',
    error: null,
};

class PasswordForgetFormBase extends Component {
    constructor(props) {
        super(props);

        this.state = { ...INITIAL_STATE };
    }

    onSubmit = event => {
        const { email } = this.state;

        this.props.firebase
            .doPasswordReset(email)
            .then(() => {
                this.setState({ ...INITIAL_STATE });
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
        const { email, error } = this.state;

        const isInvalid = email === '';

        return (
            <Form onSubmit={this.onSubmit}>
               <FormGroup>
                <Label for="email">Your e-mail:</Label>
                <Input
                    name="email"
                    id="email"
                    value={this.state.email}
                    onChange={this.onChange}
                    type="text"
                    placeholder="Email Address"
                />
               </FormGroup>
                <Button disabled={isInvalid} type="submit">
                    Reset My Password
                </Button>

                {error && <p>{error.message}</p>}
            </Form>
        );
    }
}

const PasswordForgetLink = () => (
    <p className="password-forget-link">
        <Link to={ROUTES.PASSWORD_FORGET}>Forgot Password?</Link>
    </p>
);

export default PasswordForgetPage;

const PasswordForgetForm = withFirebase(PasswordForgetFormBase);

export { PasswordForgetForm, PasswordForgetLink };