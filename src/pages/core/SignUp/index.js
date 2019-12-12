import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { withFirebase } from '../Firebase';
import { compose } from 'recompose';

import * as ROUTES from '../../constants/routes';
import { Button, Form, FormGroup, Label, Input } from 'reactstrap';
import Navigation from "../Navigation";

const SignUpPage = () => (
    <div>
        <Navigation />
        <main>
            <div className="sign-in-div">
                <h1>Registration</h1>
                <SignUpForm />
            </div>
        </main>
    </div>
);

const INITIAL_STATE = {
    username: '',
    name: '',
    surname: '',
    email: '',
    passwordOne: '',
    passwordTwo: '',
    isAdmin: false,
    error: null,
};

class SignUpFormBase extends Component {
    constructor(props) {
        super(props);

        this.state = { ...INITIAL_STATE };
    }

    onSubmit = event => {
        const { username, name, surname, email, passwordOne } = this.state; //isAdmin
        // const roles = [];

        // if (isAdmin) {
        //     roles.push(ROLES.ADMIN);
        // }

        this.props.firebase
            .doCreateUserWithEmailAndPassword(email, passwordOne)
            .then(authUser => {
                return this.props.firebase
                    .user(authUser.user.uid)
                    .set({
                        username,
                        name,
                        surname,
                        email,
                        // roles,
                    },
                    { merge: true },
                    );
            })
            .then(() => {
                this.setState({ ...INITIAL_STATE });
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

    // onChangeCheckbox = event => {
    //     this.setState({ [event.target.name]: event.target.checked });
    // };

    render() {
        const {
            username,
            name,
            surname,
            email,
            passwordOne,
            passwordTwo,
            // isAdmin,
            error,
        } = this.state;

        const isInvalid =
            passwordOne !== passwordTwo ||
            passwordOne === '' ||
            email === '' ||
            username === '' ||
            name === '' ||
            surname === '';

        return (
            <Form onSubmit={this.onSubmit}>
                <FormGroup>
                    <Label for="username">Nick</Label>
                    <Input
                        name="username"
                        id="username"
                        value={username}
                        onChange={this.onChange}
                        type="text"
                        placeholder="Username"
                    />
                    <Label for="email">Email</Label>
                    <Input
                        name="email"
                        id="email"
                        value={email}
                        onChange={this.onChange}
                        type="text"
                        placeholder="Email Address"
                    />
                </FormGroup>

                <FormGroup>
                    <Label for="name">Name</Label>
                    <Input
                        name="name"
                        id="name"
                        value={name}
                        onChange={this.onChange}
                        type="text"
                        placeholder="Name"
                    />
                    <Label for="surname">Surname</Label>
                    <Input
                        name="surname"
                        id="surname"
                        value={surname}
                        onChange={this.onChange}
                        type="text"
                        placeholder="Surname"
                    />
                </FormGroup>

                <FormGroup>
                    <Label for="passwordOne">Password</Label>
                    <Input
                        name="passwordOne"
                        id="passwordOne"
                        value={passwordOne}
                        onChange={this.onChange}
                        type="password"
                        placeholder="Password"
                    />
                    <Label for="passwordTwo">Password verification</Label>
                    <Input
                        name="passwordTwo"
                        id="passwordTwo"
                        value={passwordTwo}
                        onChange={this.onChange}
                        type="password"
                        placeholder="Confirm Password"
                    />
                </FormGroup>
                {/*<label>*/}
                    {/*Admin:*/}
                    {/*<input*/}
                        {/*name="isAdmin"*/}
                        {/*type="checkbox"*/}
                        {/*checked={isAdmin}*/}
                        {/*onChange={this.onChangeCheckbox}*/}
                    {/*/>*/}
                {/*</label>*/}
                <Button disabled={isInvalid} type="submit">
                    Sign Up
                </Button>

                {error && <p>{error.message}</p>}
            </Form>
        );
    }
}

const SignUpForm = compose(
    withRouter,
    withFirebase,
)(SignUpFormBase);

const SignUpLink = () => (
    <p>
        Don't have an account? <Link to={ROUTES.SIGN_UP}>Sign Up</Link>
    </p>
);

export default SignUpPage;

export { SignUpForm, SignUpLink };