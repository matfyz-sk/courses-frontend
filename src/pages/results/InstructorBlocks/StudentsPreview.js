import React, { useState, useEffect } from 'react'
import { Table } from 'reactstrap'
import { Link, withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import PointsModal from '../PointsModal'
import { redirect } from '../../../constants/redirect'
import { RESULT_USER } from '../../../constants/routes'
// eslint-disable-next-line import/no-cycle
import { getShortID } from '../../../helperFunctions'
import { showUserName } from '../../../components/Auth/userFunction'
import { useGetUserQuery } from 'services/user'
import { useGetResultQuery } from 'services/result'

const StudentsPreview = props => {
  const { match, courseInstanceReducer, privilegesReducer } = props
  const { courseInstance } = courseInstanceReducer
  const privileges = privilegesReducer
  const { course_id } = match.params
  const [users, setUsers] = useState([])
  const { data, isSuccess } = useGetUserQuery({studentOfId: getShortID(course_id)})

  const getUsers = () => {
    if (isSuccess && data) {
      const { data: resultsData, isSuccess: resultsIsSuccess } = useGetResultQuery({courseInstanceId: course_id}) // why not getShortID(course_id)
      if (resultsIsSuccess && resultsData) {
        const userList = []
        for (let i = 0; i < data.length; i++) {
          const user = {
            user: data[i],
            result: 0,
          }
          for (let r = 0; r < resultsData.length; r++) {
            if (user.user['_id'] === resultsData[r].hasUser[0]['_id']) {
              user.result = user.result + resultsData[r].points
            }
          }
          userList.push(user)
        }
        setUsers(userList)
      }
    }
  }

  const resultModifier = (user_index, oldVal, newVal) => {
    const newUser = [...users]
    newUser[user_index].result =
      newUser[user_index].result - parseFloat(oldVal) + parseFloat(newVal)
    setUsers(newUser)
  }

  useEffect(() => {
    getUsers()
  }, [])

  const renderUsers = []
  for (let i = 0; i < users.length; i++) {
    let grading = ''
    if (courseInstance && courseInstance.hasGrading.length > 0) {
      const sortedGrading = courseInstance.hasGrading.sort(function(a, b) {
        return a.minPoints - b.minPoints
      })
      for (let g = 0; g < sortedGrading.length; g++) {
        if (sortedGrading[g].minPoints <= users[i].result) {
          grading = sortedGrading[g].grade
        } else {
          break
        }
      }
    }
    renderUsers.push(
      <tr key={`user-list-${i}`}>
        <td>{showUserName(users[i].user, privileges, courseInstance)} </td>
        <td>{users[i].result}</td>
        <td>{grading}</td>
        <td className="text-right">
          <PointsModal
            user={users[i].user}
            userIndex={i}
            resultModifier={resultModifier}
          />
          <Link
            to={redirect(RESULT_USER, [
              {
                key: 'course_id',
                value: course_id,
              },
              { key: 'user_id', value: getShortID(users[i].user['_id']) },
            ])}
            className="btn btn-sm btn-link ml-2"
          >
            Profile
          </Link>
        </td>
      </tr>
    )
  }

  return (
    <>
      <h2 className="mb-4">Students preview</h2>
      <Table hover size="sm" responsive>
        <thead>
          <tr>
            <th>Full name</th>
            <th>Points</th>
            <th>Grading</th>
            <th> </th>
          </tr>
        </thead>
        <tbody>
          {renderUsers}
        </tbody>
      </Table>
    </>
  )
}

const mapStateToProps = state => {
  return state
}

export default withRouter(connect(mapStateToProps)(StudentsPreview))
