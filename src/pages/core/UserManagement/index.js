import React, { Component } from 'react'
import { compose } from 'recompose'
import { Alert, Button, Table } from 'reactstrap'

// import { withAuthorization } from '../../../components/Session';
import { connect } from 'react-redux'
import { NavigationCourse } from '../../../components/Navigation'
import { setUserAdmin, fetchCourseInstance } from '../../../redux/actions'

import './UserManagement.css'
import { BASE_URL, COURSE_INSTANCE_URL, TOKEN, USER_URL } from '../constants'
import { axiosRequest, getData } from '../AxiosRequests'
import { getShortId } from '../Helper'

class UserManagement extends Component {
  constructor(props) {
    super(props)

    this.state = {
      course: {},
      courseFullId: '',
      requestedUsers: [],
      enrolledUsers: [],
    }
  }

  componentDidMount() {
    const {
      match: { params },
    } = this.props

    this.setState({
      courseFullId: `http://www.courses.matfyz.sk/data${COURSE_INSTANCE_URL}/${params.id}`,
    })

    const urlRequests = `${BASE_URL + USER_URL}?requests=${params.id}`
    const urlEnrolled = `${BASE_URL + USER_URL}?studentOf=${params.id}`

    axiosRequest('get', TOKEN, null, urlRequests)
      .then(response => {
        const data = getData(response)
        if (data != null) {
          const users = data.map(user => {
            return {
              id: getShortId(user['@id']),
              fullId: user['@id'],
              nickname: user.name,
              // TODO firstName and lastName when implemented
              firstName: '',
              lastName: '',
              studentOf: user.studentOf.map(course => {
                return course['@id']
              }),
              requests: user.requests.map(course => {
                return course['@id']
              }),
            }
          })
          this.setState({
            requestedUsers: users,
          })
        }
      })
      .catch(error => console.log(error))

    axiosRequest('get', TOKEN, null, urlEnrolled)
      .then(response => {
        const data = getData(response)
        if (data != null) {
          const users = data.map(user => {
            return {
              id: getShortId(user['@id']),
              fullId: user['@id'],
              nickname: user.name,
              // TODO firstName and lastName when implemented
              firstName: '',
              lastName: '',
              studentOf: user.studentOf.map(course => {
                return course['@id']
              }),
              requests: user.requests.map(course => {
                return course['@id']
              }),
            }
          })
          console.log('enrolled', users)
          this.setState({
            enrolledUsers: users,
          })
        }
      })
      .catch(error => console.log(error))
  }

  changeStudentOfRequests = (userId, action) => {
    const { courseFullId } = this.state
    const url = `${BASE_URL + USER_URL}/${userId}`
    const { requestedUsers, enrolledUsers } = this.state

    let index
    let user
    let userIndex
    if (action === 'delete' || action === 'request') {
      user = enrolledUsers.find(element => element.id === userId)
    } else if (action === 'decline' || action === 'confirm') {
      user = requestedUsers.find(element => element.id === userId)
    }

    switch (action) {
      case 'delete':
        index = user.studentOf.indexOf(courseFullId)
        if (index > -1) {
          user.studentOf.splice(index, 1)
        }
        userIndex = enrolledUsers.findIndex(element => {
          return element.id === userId
        })
        if (userIndex > -1) {
          enrolledUsers.splice(userIndex, 1)
        }
        break
      case 'request':
        user.requests.push(courseFullId)
        requestedUsers.push(user)
        break
      case 'confirm':
        user.studentOf.push(courseFullId)
        enrolledUsers.push(user)
      case 'decline':
        index = user.requests.indexOf(courseFullId)
        if (index > -1) {
          user.requests.splice(index, 1)
        }
        userIndex = requestedUsers.findIndex(element => {
          return element.id === userId
        })
        if (userIndex > -1) {
          requestedUsers.splice(userIndex, 1)
        }
        break
      default:
        break
    }
    axiosRequest(
      'patch',
      TOKEN,
      JSON.stringify({
        studentOf: user.studentOf,
        requests: user.requests,
      }),
      url
    )
      .then(response => {
        if (response.status === 200) {
          this.setState({
            requestedUsers,
            enrolledUsers,
          })
        } else {
          // TODO alert?
          console.log('Ooops!')
        }
      })
      .catch(error => console.log(error))
  }

  render() {
    const { enrolledUsers, requestedUsers, course } = this.state

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
                  confirmRequest={this.changeStudentOfRequests}
                  declineRequest={this.changeStudentOfRequests}
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
              <EnrolledUserList
                users={enrolledUsers}
                deleteUser={this.changeStudentOfRequests}
              />
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
              onClick={e => confirmRequest(e.target.id, 'confirm')}
            >
              Confirm
            </Button>
          </td>
          <td className="table-last">
            <Button
              id={user.id}
              className="table-button"
              onClick={e => declineRequest(e.target.id, 'decline')}
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
              onClick={e => deleteUser(e.target.id, 'delete')}
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
