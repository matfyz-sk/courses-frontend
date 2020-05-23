import React from 'react'
import { Table } from 'reactstrap'
import { Link, withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import PointsModal from '../PointsModal'
import { redirect } from '../../../constants/redirect'
import { RESULT_USER } from '../../../constants/routes'
// eslint-disable-next-line import/no-cycle
import { getShortID } from '../../../helperFunctions'

const StudentsPreview = props => {
  const { courseInstance } = props
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
          <tr>
            <td>Patrik Hudák (Patrick) </td>
            <td>24 b</td>
            <td>E</td>
            <td className="text-right">
              <PointsModal user={null} />
              {courseInstance ? (
                <Link
                  to={redirect(RESULT_USER, [
                    {
                      key: 'course_id',
                      value: getShortID(courseInstance['@id']),
                    },
                    { key: 'user_id', value: 'ddd' },
                  ])}
                  className="btn btn-sm btn-link ml-2"
                >
                  Profile
                </Link>
              ) : null}
            </td>
          </tr>
        </tbody>
      </Table>
    </>
  )
}

const mapStateToProps = ({ courseInstanceReducer }) => {
  const { courseInstance } = courseInstanceReducer
  return {
    courseInstance,
  }
}

export default withRouter(connect(mapStateToProps)(StudentsPreview))
