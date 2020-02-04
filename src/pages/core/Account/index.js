import React from 'react';

import { PasswordForgetForm } from '../PasswordForget';
import PasswordChangeForm from '../PasswordChange';
import { AuthUserContext, withAuthorization } from '../../../components/Session';

const AccountPage = () => (
    <AuthUserContext.Consumer>
        {authUser => (
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
        )}
    </AuthUserContext.Consumer>
);

const condition = authUser => !!authUser;

export default withAuthorization(condition)(AccountPage);