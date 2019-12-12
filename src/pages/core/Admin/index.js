import React, { Component } from 'react';
import { compose } from 'recompose';

import { withFirebase } from '../Firebase';
import { withAuthorization } from '../Session';
import * as ROLES from '../../constants/roles';
import Navigation from "../Navigation";


class AdminPage extends Component {
    constructor(props) {
        super(props);

        this.state = {
            loading: false,
            users: [],
        };
    }

    componentDidMount() {
        this.setState({ loading: true });

        this.unsubscribe = this.props.firebase
            .users()
            .onSnapshot(snapshot => {
                let users = [];

                snapshot.forEach(doc =>
                    users.push({ ...doc.data(), uid: doc.id }),
                );

                this.setState({
                    users,
                    loading: false,
                });
            });
    }

    componentWillUnmount() {
        this.unsubscribe();
    }

    render() {
        const { users, loading } = this.state;

        return (
            <div>
                <Navigation />
                <main>
                    <div>
                        <h1>Admin</h1>
                        <p>
                            The Admin Page is accessible by every signed in admin user.
                        </p>

                        {loading && <div>Loading ...</div>}

                        <UserList users={users} />
                    </div>
                </main>
            </div>
        );
    }
}

const UserList = ({ users }) => (
    <ul>
        {users.map(user => (
            <li key={user.uid}>
                <span>
                  <strong> E-Mail:</strong> {user.email}
                </span>
                        <span>
                  <strong> Username:</strong> {user.username}
                </span>
            </li>
        ))}
    </ul>
);

const condition = authUser =>
    authUser && (authUser.roles.includes(ROLES.ADMIN));

export default compose(
    withAuthorization(condition),
    withFirebase,
)(AdminPage);