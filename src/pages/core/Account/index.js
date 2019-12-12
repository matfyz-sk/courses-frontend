import React from 'react';

import { PasswordForgetForm } from '../PasswordForget';
import PasswordChangeForm from '../PasswordChange';
import { AuthUserContext, withAuthorization } from '../Session';
import Navigation from "../Navigation";

const AccountPage = () => (
    <AuthUserContext.Consumer>
        {authUser => (
            <div>
                <Navigation />
                <main>
                    <div className="sign-in-div">
                        <h1>Account:</h1>
                        <h2>{authUser.name} {authUser.surname}</h2>
                        <h3>Reset password</h3>
                        <PasswordForgetForm />
                        <br></br>
                        <h3>Change password</h3>
                        <PasswordChangeForm />
                    </div>
                </main>
            </div>
        )}
    </AuthUserContext.Consumer>
);

const condition = authUser => !!authUser;

export default withAuthorization(condition)(AccountPage);