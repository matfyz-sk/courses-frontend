import React, { Component } from 'react';
import { compose } from 'recompose';
import Navigation from "../../../components/Navigation";

import { withAuthorization } from '../../../components/Session';
import {connect} from "react-redux";

const users = [
    {firstName : 'Jozef', lastName : 'Mrkva', username: 'jCarrot'},
    {firstName : 'Anna', lastName : 'Karenina', username: 'AK48'},
    {firstName : 'Jane', lastName : 'Austen', username: 'notProudAtAll'},
    {firstName : 'Jack', lastName : 'Kerouac', username: 'itsKEROUACnotKEROACK'},
];

class UserManagement extends Component {
    constructor(props) {
        super(props);

        this.state = {
            users: users,
        };
    }

    render() {
        const { users } = this.state;

        return (
            <div>
                <Navigation/>
                <main>
                    <h1>User Management</h1>
                    <h2>Requests</h2>
                    <h3>Confirmation required</h3>
                    <RequestedUserList users={users} />
                    <h2>Enrolled users</h2>
                    <EnrolledUserList users={users} />
                </main>
            </div>
        );
    }
}

const RequestedUserList = ({ users }) => (
    <ul>
        {users.map(user => (
            <li key={user.uid}>
                <span>
                  <strong> Name:</strong> {user.firstName} {user.lastName}
                </span>
                <span>
                  <strong> Username:</strong> {user.username}
                </span>
            </li>
        ))}
    </ul>
);

const EnrolledUserList = ({ users }) => (
    <ul>
        {users.map(user => (
            <li key={user.uid}>
                <span>
                  <strong> Name:</strong> {user.firstName} {user.lastName}
                </span>
                <span>
                  <strong> Username:</strong> {user.username}
                </span>
            </li>
        ))}
    </ul>
);


const mapStateToProps = ( { userReducer } ) => {
    return {
        isSignedIn: userReducer.isSignedIn,
        isAdmin: userReducer.isAdmin
    };
};

const condition = () => true;

export default compose(
    connect(mapStateToProps, {}),
    withAuthorization(condition),
)(UserManagement);