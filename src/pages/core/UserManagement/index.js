import React, { Component } from 'react';
import { compose } from 'recompose';
import {NavigationCourse} from "../../../components/Navigation";
import {Button, Table} from 'reactstrap';

// import { withAuthorization } from '../../../components/Session';
import {connect} from "react-redux";
import {setUserAdmin} from "../../../redux/actions";

import "./UserManagement.css";

const users = [
    {id: 0, firstName : 'Jozef', lastName : 'Mrkva', username: 'jCarrot'},
    {id: 1, firstName : 'Anna', lastName : 'Karenina', username: 'AK48'},
    {id: 2, firstName : 'Jane', lastName : 'Austen', username: 'notProudAtAll'},
    {id: 3, firstName : 'Jack', lastName : 'Kerouac', username: 'itsKEROUACnotKEROACK'},
    {id: 4, firstName : 'Anna', lastName : 'Karenina', username: 'AK48'},
    {id: 5, firstName : 'Jane', lastName : 'Austen', username: 'notProudAtAll'},
    {id: 6, firstName : 'Jack', lastName : 'Kerouac', username: 'itsKEROUACnotKEROACK'},
    {id: 7, firstName : 'Anna', lastName : 'Karenina', username: 'AK48'},
    {id: 8, firstName : 'Jane', lastName : 'Austen', username: 'notProudAtAll'},
    {id: 9, firstName : 'Jack', lastName : 'Kerouac', username: 'itsKEROUACnotKEROACK'},
];

class UserManagement extends Component {
    constructor(props) {
        super(props);

        this.state = {
            users: users,
            course: {},
            requestedUsers: [],
            enrolledUsers: [],
        };

        this.deleteUserFromCourse = this.deleteUserFromCourse.bind(this);
        this.confirmRequest = this.confirmRequest.bind(this);
        this.declineRequest = this.declineRequest.bind(this);
    }

    componentDidMount() {
        // const { match: { params } } = this.props;

        // this.setState({
        //     course: , //get Course with id
        //     requestedUsers: , //get Users requested in Course with id
        //     enrolledUsers:  //get Users enrolled in Course with id
        // })
    }

    deleteUserFromCourse() {

    }

    confirmRequest() {

    }

    declineRequest() {

    }

    render() {
        const { users } = this.state;

        return (
            <div>
                <NavigationCourse/>
                <main className="main-user-management-container">
                    <div className="requests-container">
                        <h2>Requests (Confirmation required)</h2>
                        <RequestedUserList users={users} delete={this.deleteUserFromCourse}/>
                    </div>
                    <div className="enrolled-container">
                        <h2>Enrolled users</h2>
                        <EnrolledUserList users={users}/>
                    </div>
                </main>
            </div>
        );
    }
}

const RequestedUserList = ({ users, confirmRequest, declineRequest }) => (
    <Table hover className="user-management-table">
        <thead>
            <tr key="000">
                <th>#</th>
                <th>First Name</th>
                <th>Last Name</th>
                <th>Username</th>
                <th> </th>
                <th> </th>
            </tr>
        </thead>
        <tbody>
            {users.map(user => (
                <tr key={user.id}>
                    <th scope="row">1</th>
                    <td>{user.firstName}</td>
                    <td>{user.lastName}</td>
                    <td>{user.username}</td>
                    <td><Button className="table-button table-button-confirm" onClick={confirmRequest}>Confirm</Button></td>
                    <td><Button className="table-button" onClick={declineRequest}>Decline</Button></td>
                </tr>
            ))}
        </tbody>
    </Table>
);

const EnrolledUserList = ({ users, deleteUser }) => (
    <Table hover  className="user-management-table">
        <thead>
            <tr key="011">
                <th>#</th>
                <th>First Name</th>
                <th>Last Name</th>
                <th>Username</th>
                <th> </th>
            </tr>
        </thead>
        <tbody>
        {users.map(user => (
            <tr key={user.id}>
                <th scope="row">1</th>
                <td>{user.firstName}</td>
                <td>{user.lastName}</td>
                <td>{user.username}</td>
                <td><Button className="table-button" onClick={deleteUser}>Delete</Button></td>
            </tr>
        ))}
        </tbody>
    </Table>
);


const mapStateToProps = ( { userReducer } ) => {
    return {
        isSignedIn: userReducer.isSignedIn,
        isAdmin: userReducer.isAdmin
    };
};

// const condition = () => true;

export default compose(
    connect(mapStateToProps, {setUserAdmin}),
    // withAuthorization(condition),
)(UserManagement);