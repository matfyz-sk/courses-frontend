import React from 'react'
import { compose } from 'recompose'
import { Alert, Button, Table } from 'reactstrap'
// import { withAuthorization } from '../../../components/Session';
import { connect } from 'react-redux'

import './UserManagement.css'
import { getShortId } from '../Helper'
import { useGetUserQuery, useUpdateUserInfoMutation } from 'services/user'

function UserManagement(props) {
  const { course } = props
  const courseId = getShortId(course['_id'])
  const {
    data: userRequestData, 
    isSuccess: userRequestIsSuccess,
    isLoading: userRequestIsLoading,
    error: userRequestError
  } = useGetUserQuery({requestId: courseId})
  const {
    data: userEnrolledData, 
    isSuccess: userEnrolledIsSuccess,
    isLoading: userEnrolledIsLoading,
    error: userEnrolledError
  } = useGetUserQuery({studentOfId: courseId})
  const [updateUser, result] = useUpdateUserInfoMutation()
  
  if (userRequestIsLoading || userEnrolledIsLoading) {
    return (
      <Alert color="secondary" className="empty-message">
        Loading...
      </Alert>
    )
  }

  let requestedUsers = []
  if (userRequestIsSuccess && userRequestData) {
    requestedUsers = userRequestData.map(user => {
      return {
        id: getShortId(user['_id']),
        fullId: user['_id'],
        nickname: user.nickname,
        firstName: user.firstName,
        lastName: user.lastName,
        studentOf: user.studentOf.map(courseElement => {
          return courseElement['_id']
        }),
        requests: user.requests.map(courseElement => {
          return courseElement['_id']
        }),
      }
    })
  } else {
    console.log(userRequestError)
  }
  
  let enrolledUsers = []
  if (userEnrolledIsSuccess && userEnrolledData) {
    enrolledUsers = userEnrolledData.map(user => {
      return {
        id: getShortId(user['_id']),
        fullId: user['_id'],
        nickname: user.nickname,
        firstName: user.firstName,
        lastName: user.lastName,
        studentOf: user.studentOf.map(courseElement => {
          return courseElement['_id']
        }),
        requests: user.requests.map(courseElement => {
          return courseElement['_id']
        }),
      }
    })
  } else {
    console.log(userEnrolledError)
  }

  const changeStatusOfStudent = (userId, action) => {
    const { courseFullId } = course['_id']

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

    const body = {
      studentOf: user.studentOf,
      requests: user.requests,
    }
    console.log(body)

    updateUser({userId, body}).unwrap().catch(error => {
      console.log(error)
      throw new Error(error)
    })
  }

  return (
    <div>
      <main className="main-user-management-container">
        {
          requestedUsers.length > 0 && (
            <div className="requests-container">
              <h2>Requests (Confirmation required)</h2>
              <RequestedUserList
                users={requestedUsers}
                confirmRequest={changeStatusOfStudent}
                declineRequest={changeStatusOfStudent}
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
              deleteUser={changeStatusOfStudent}
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
