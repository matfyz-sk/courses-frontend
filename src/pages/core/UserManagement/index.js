import React, { Component } from 'react'
import { compose } from 'recompose'
import { Alert, Button, Table } from 'reactstrap'
// import { withAuthorization } from '../../../components/Session';
import { connect } from 'react-redux'

import './UserManagement.css'
import { BASE_URL, COURSE_INSTANCE_URL, TOKEN, USER_URL } from '../constants'
import { axiosRequest, getData } from '../AxiosRequests'
import { getShortId } from '../Helper'

class UserManagement extends Component {
  constructor(props) {
    super(props)

    this.state = {
      courseFullId: '',
      requestedUsers: [],
      enrolledUsers: [],
    }
  }

  componentDidMount() {
    this.setUsers()
    if (this.props.course != null) {
      this.setState({
        courseFullId: this.props.course['@id'],
      })
    }
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (prevProps.course !== this.props.course) {
      this.setUsers()
      if (this.props.course != null) {
        this.setState({
          courseFullId: this.props.course['@id'],
        })
      }
    }
  }

  setUsers = () => {
    const { course } = this.props

    if (course != null) {
      const courseId = getShortId(course['@id'])

      const urlRequests = `${BASE_URL + USER_URL}?requests=${courseId}`
      const urlEnrolled = `${BASE_URL + USER_URL}?studentOf=${courseId}`

      axiosRequest('get', TOKEN, null, urlRequests)
        .then(response => {
          const data = getData(response)
          if (data != null) {
            const users = data.map(user => {
              return {
                id: getShortId(user['@id']),
                fullId: user['@id'],
                nickname: user.nickname,
                firstName: user.firstName,
                lastName: user.lastName,
                studentOf: user.studentOf.map(courseElement => {
                  return courseElement['@id']
                }),
                requests: user.requests.map(courseElement => {
                  return courseElement['@id']
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
                nickname: user.nickname,
                firstName: user.firstName,
                lastName: user.lastName,
                studentOf: user.studentOf.map(courseElement => {
                  return courseElement['@id']
                }),
                requests: user.requests.map(courseElement => {
                  return courseElement['@id']
                }),
              }
            })
            this.setState({
              enrolledUsers: users,
            })
          }
        })
        .catch(error => console.log(error))
    }
  }

  changeStatusOfStudent = (userId, action) => {
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
    const { enrolledUsers, requestedUsers } = this.state

    return (
      <div>
        <main className="main-user-management-container">
          {
            requestedUsers.length > 0 && (
              <div className="requests-container">
                <h2>Requests (Confirmation required)</h2>
                <RequestedUserList
                  users={requestedUsers}
                  confirmRequest={this.changeStatusOfStudent}
                  declineRequest={this.changeStatusOfStudent}
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
                deleteUser={this.changeStatusOfStudent}
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

const mapStateToProps = ({ courseInstanceReducer }) => {
  return {
    course: courseInstanceReducer.courseInstance,
  }
}

// const condition = () => true;

export default compose(
  connect(mapStateToProps)
  // withAuthorization(condition),
)(UserManagement)
