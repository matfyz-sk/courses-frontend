import React, { Component } from 'react';
import { compose } from 'recompose';
import {NavigationCourse} from "../../../components/Navigation";
import {Alert, Button, Table} from 'reactstrap';

// import { withAuthorization } from '../../../components/Session';
import {connect} from "react-redux";
import {setUserAdmin} from "../../../redux/actions";

import "./UserManagement.css";
import {Courses} from "../Courses/courses-data";

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
            enrolled: users,
            requests: [],
            course: {},
            requestedUsers: [],
            enrolledUsers: [],
            courseId: '',
            courseAbbr: '',
        };

        this.deleteUserFromCourse = this.deleteUserFromCourse.bind(this);
        this.confirmRequest = this.confirmRequest.bind(this);
        this.declineRequest = this.declineRequest.bind(this);
    }

    componentDidMount() {
        this.setState({ loading: true });

        const { match: { params } } = this.props;

        let courses = Courses;
        let courseAbbr;

        for(let i in courses) {
            let course = courses[i];
            if (course.id+'' === params.id) {
                courseAbbr = course.abbreviation;
            }
        }

        this.setState({
            courseId: params.id,
            courseAbbr: courseAbbr,
        });
    }

    deleteUserFromCourse() {

    }

    confirmRequest() {

    }

    declineRequest() {

    }

    render() {
        const { enrolled, requests, courseAbbr } = this.state;

        return (
            <div>
                <NavigationCourse courseAbbr={courseAbbr}/>
                <main className="main-user-management-container">
                    { requests.length>0 &&
                        <div className="requests-container">
                            <h2>Requests (Confirmation required)</h2>
                            <RequestedUserList users={requests} delete={this.deleteUserFromCourse}/>
                        </div>
                        // :
                        // <Alert color='secondary' className='empty-message'>
                        //     There are no pending requests for this course.
                        // </Alert>
                    }
                    <div className="enrolled-container">
                        <h2>Enrolled users</h2>
                        { enrolled.length>0 ?
                            <EnrolledUserList users={enrolled}/>
                            :
                            <Alert color='secondary' className='empty-message'>
                                There are not any enrolled users in this course.
                            </Alert>
                        }
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
            {users.map((user, index) => (
                <tr key={user.id}>
                    <th scope="row" className='table-first'>{index+1}</th>
                    <td>{user.firstName}</td>
                    <td>{user.lastName}</td>
                    <td>{user.username}</td>
                    <td className='table-last'><Button className="table-button table-button-confirm" onClick={confirmRequest}>Confirm</Button></td>
                    <td className='table-last'><Button className="table-button" onClick={declineRequest}>Decline</Button></td>
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
        {users.map((user, index) => (
            <tr key={user.id}>
                <th scope="row" className='table-first'>{index+1}</th>
                <td>{user.firstName}</td>
                <td>{user.lastName}</td>
                <td>{user.username}</td>
                <td  className='table-last'><Button className="table-button" onClick={deleteUser}>Delete</Button></td>
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