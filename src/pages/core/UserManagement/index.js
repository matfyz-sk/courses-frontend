import React, { Component } from 'react'
import { compose } from 'recompose'
import { Alert, Button, Table } from 'reactstrap'

// import { withAuthorization } from '../../../components/Session';
import { connect } from 'react-redux'
import { NavigationCourse } from '../../../components/Navigation'
import {
  setUserAdmin,
  fetchCourseInstance,
} from '../../../redux/actions'

import './UserManagement.css'
import { Courses } from '../Courses/courses-data'
import axios from 'axios'
import apiConfig from '../../../configuration/api'

const TOKEN =
  'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyVVJJIjoiaHR0cDovL3d3dy5jb3Vyc2VzLm1hdGZ5ei5zay9kYXRhL3VzZXIvcHQxb0siLCJlbWFpbCI6ImhhcnJ5LnBvdHRlckBnbWFpbC5jb20iLCJpYXQiOjE1ODQyMDA1ODN9.-V3OAviWMMQ_KaBvhDmETq38z1wCXnX9rkf1XbDDPwU'

class UserManagement extends Component {
  constructor(props) {
    super(props)

    // this.state = {
    //   course: {},
    //   requestedUsers: [],
    //   enrolledUsers: [],
    // }

    this.deleteUserFromCourse = this.deleteUserFromCourse.bind(this)
    this.confirmRequest = this.confirmRequest.bind(this)
    this.declineRequest = this.declineRequest.bind(this)
  }

  componentDidMount() {
    const {
      match: { params },
    } = this.props

    // this.props.fetchCourseInstance(TOKEN, params.id).then(() => {
    //   const { course } = this.props
    //   //
    //   this.props.fetchRequestedUsers(TOKEN, course.id).then(() => {
    //     // const { requestedUsers } = this.props
    //     // this.setState({
    //     //   requestedUsers,
    //     // })
    //   })
    //
    //   this.props.fetchEnrolledUsers(TOKEN, course.id).then(() => {
    //     // const { enrolledUsers } = this.props
    //     // this.setState({
    //     //   enrolledUsers,
    //     // })
    //   })
    //   //
    //   // this.setState({
    //   //   course,
    //   // })
    // })
  }

  deleteUserFromCourse(userId) {}

  confirmRequest(userId) {
    // return axios
    //   .get(`${apiConfig.API_URL}/user/${userId}`, {
    //     headers: {
    //       Accept: 'application/json',
    //       'Content-Type': 'application/json',
    //       Authorization: TOKEN,
    //     },
    //   })
    //   .then(({ data }) => {
    //     if (
    //       data &&
    //       data['@graph'] &&
    //       data['@graph'].length &&
    //       data['@graph'].length > 0
    //     ) {
    //       const user = data['@graph'].map(userData => {
    //         return {
    //           id: userData['@id'].substring(userData['@id'].length - 5),
    //           firstName: userData.firstName,
    //           lastName: userData.lastName,
    //           nickname: userData.nickname,
    //           requests: user.requests,
    //           studentOf: user.studentOf,
    //           instructorOf: user.instructorOf,
    //         }
    //       })[0]
    //       user.requests.remove(this.state.course.id)
    //       user.enrolled.push(course.fullId)
    //       this.props.patchUser(TOKEN, user.id, user).then(() => {
    //         this.state.requestedUsers.remove(user)
    //         this.state.enrolledUsers.remove(user)
    //         this.props.setRequestedUsers()
    //         this.props.setEnrolledUsers()
    //       })
    //     }
    //   })
    //   .catch(error => console.log(error))
  }

  declineRequest(userId) {
    this.props.setEnrolledUsers([])
  }

  render() {
    const { enrolledUsers, requestedUsers, course } = this.props

    return (
      <div>
        <NavigationCourse courseAbbr={course.abbreviation} />
        <main className="main-user-management-container">
          {
            requestedUsers.length > 0 && (
              <div className="requests-container">
                <h2>Requests (Confirmation required)</h2>
                <RequestedUserList
                  users={requestedUsers}
                  delete={this.deleteUserFromCourse}
                />
              </div>
            )
            // :
            // <Alert color='secondary' className='empty-message'>
            //     There are no pending requests for this course.
            // </Alert>
          }
          <div className="enrolled-container">
            <h2>Enrolled users</h2>
            {enrolledUsers.length > 0 ? (
              <EnrolledUserList users={enrolledUsers} />
            ) : (
              <Alert color="secondary" className="empty-message">
                There are not any enrolled users in this course.
              </Alert>
            )}
          </div>
        </main>
      </div>
    )
  }
}

const RequestedUserList = ({ users, confirmRequest, declineRequest }) => (
  <Table hover className="user-management-table">
    <thead>
      <tr key="000">
        <th>#</th>
        <th>First Name</th>
        <th>Last Name</th>
        <th>Nickname</th>
        <th> </th>
        <th> </th>
      </tr>
    </thead>
    <tbody>
      {users.map((user, index) => (
        <tr key={user.id}>
          <th scope="row" className="table-first">
            {index + 1}
          </th>
          <td>{user.firstName}</td>
          <td>{user.lastName}</td>
          <td>{user.nickname}</td>
          <td className="table-last">
            <Button
              id={user.id}
              className="table-button table-button-confirm"
              onClick={confirmRequest(this.id)}
            >
              Confirm
            </Button>
          </td>
          <td className="table-last">
            <Button
              id={user.id}
              className="table-button"
              onClick={declineRequest(this.id)}
            >
              Decline
            </Button>
          </td>
        </tr>
      ))}
    </tbody>
  </Table>
)

const EnrolledUserList = ({ users, deleteUser }) => (
  <Table hover className="user-management-table">
    <thead>
      <tr key="011">
        <th>#</th>
        <th>First Name</th>
        <th>Last Name</th>
        <th>Nickname</th>
        <th> </th>
      </tr>
    </thead>
    <tbody>
      {users.map((user, index) => (
        <tr key={user.id}>
          <th scope="row" className="table-first">
            {index + 1}
          </th>
          <td>{user.firstName}</td>
          <td>{user.lastName}</td>
          <td>{user.nickname}</td>
          <td className="table-last">
            <Button
              id={user.id}
              className="table-button"
              onClick={deleteUser(this.id)}
            >
              Delete
            </Button>
          </td>
        </tr>
      ))}
    </tbody>
  </Table>
)

const mapStateToProps = ({ userReducer, coursesReducer }) => {
  return {
    isSignedIn: userReducer.isSignedIn,
    isAdmin: userReducer.isAdmin,
    enrolledUsers: userReducer.enrolledUsers,
    requestedUsers: userReducer.requestedUsers,
    course: coursesReducer.course,
  }
}

// const condition = () => true;

export default compose(
  connect(mapStateToProps, {
    setUserAdmin,
    fetchCourseInstance,
  })
  // withAuthorization(condition),
)(UserManagement)
