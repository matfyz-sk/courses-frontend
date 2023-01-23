import React, { useState, useEffect } from 'react'
import { Link, withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import { Col, Container, Row, Table, Alert } from 'reactstrap'
import { getShortID } from '../../../helperFunctions'
import { formatDate } from '../../../functions/global'
import { redirect } from '../../../constants/redirect'
import { RESULT_DETAIL, RESULT_TYPE } from '../../../constants/routes'
import { getUserID } from '../../../components/Auth'
import { showUserName } from '../../../components/Auth/userFunction'
import { useGetUserOfCourseQuery } from 'services/user'
import { useGetAllUserResultsQuery, useGetResultTypeDetailQuery } from 'services/result'

function StudentOverview(props) {
  const { courseInstance, privileges, match } = props
  const { course_id, user_id } = match.params
  const userId = user_id ? user_id : getUserID()
  const [user, setUser] = useState(null)
  const [results, setResults] = useState(null)

  const fetchStudent = () => {
    const { data: userInCourseData, isSuccess: userInCourseIsSuccess } = useGetUserOfCourseQuery({userId, course_id})
    if (userInCourseIsSuccess && userInCourseData && userInCourseData.length > 0) {
      setUser(userInCourseData[0])
      const { data: allUserResultsData, isSuccess: allUserResultsIsSuccess } = useGetAllUserResultsQuery(userId)
      if (allUserResultsIsSuccess && allUserResultsData) {
        const resultArr = allUserResultsData
        for (let i = 0; i < resultArr.length; i++) {
          if (resultArr[i].correctionFor) {
            const { data, isSuccess } = useGetResultTypeDetailQuery(getShortID(resultArr.correctionFor))
            if (isSuccess && data && data.length > 0) {
              resultArr[i] = {
                ...resultArr[i],
                correction: data[0],
              }
            } else {
              resultArr[i] = { ...resultArr[i], correction: null }
            }
          } else {
            resultArr[i] = { ...resultArr[i], correction: null }
          }
        }
        setResults(resultArr)
      }
    }
  }

  useEffect(() => {
    fetchStudent()
  }, [])

  let grading = null
  let pointsUpper = null
  let isBottom = false
  const renderResult = []
  let total_result = null
  if (results) {
    total_result = 0
    for (let i = 0; i < results.length; i++) {
      const result = results[i]
      total_result += result.points
      renderResult.push(
        <tr
          key={result['@id']}
          className={
            result.type &&
            result.type.length > 0 &&
            result.points < result.type[0].minPoints
              ? 'text-danger'
              : ''
          }
        >
          <td>
            {result.type && result.type.length > 0 ? (
              <Link
                to={redirect(RESULT_TYPE, [
                  {
                    key: 'course_id',
                    value: getShortID(courseInstance['@id']),
                  },
                  {
                    key: 'result_type_id',
                    value: getShortID(result.type[0]['@id']),
                  },
                ])}
              >
                {result.type[0].name}
              </Link>
            ) : (
              '-'
            )}
          </td>
          <td>
            {result.correction ? (
              <Link
                to={redirect(RESULT_TYPE, [
                  {
                    key: 'course_id',
                    value: getShortID(courseInstance['@id']),
                  },
                  {
                    key: 'result_type_id',
                    value: getShortID(result.correction['@id']),
                  },
                ])}
              >
                {result.correction.name}
              </Link>
            ) : (
              '-'
            )}
          </td>
          <td>
            {result.awardedBy
              ? `${result.awardedBy[0].lastName}`
              : '-'}
          </td>
          <td>{result.description ? 'Yes' : 'No'}</td>
          <td>
            {result.reference ? (
              'Yes'
            ) : (
              'No'
            )}
          </td>
          <th>
            {result.points}{' '}
            <span className="font-weight-normal">
              {result.type &&
              result.type.length > 0 &&
              result.points < result.type[0].minPoints
                ? `(${result.type[0].minPoints - result.points} needed)`
                : ''}
            </span>
          </th>
          <td>{formatDate(result.createdAt)}</td>
          <td className="text-right">
            <Link
              to={redirect(RESULT_DETAIL, [
                {
                  key: 'course_id',
                  value: course_id,
                },
                {
                  key: 'result_id',
                  value: getShortID(result['@id']),
                },
              ])}
            >
              Detail
            </Link>
          </td>
        </tr>
      )
    }
    renderResult.push(
      <tr key="total-results" style={{ fontSize: '1.2rem' }} className="text-right">
        <th colSpan={5} className="pt-3">TOTAL:</th>
        <th colSpan={3} className="pt-3">{total_result} points</th>
      </tr>
    )

    if (courseInstance && courseInstance.hasGrading.length > 0) {
      const sortedGrading = courseInstance.hasGrading.sort(function(a, b) {
        return a.minPoints - b.minPoints
      })
      for (let g = 0; g < sortedGrading.length; g++) {
        if (sortedGrading[g].minPoints <= total_result) {
          grading = sortedGrading[g].grade
          isBottom = g === 0
          if (g + 1 < sortedGrading.length && (sortedGrading[g + 1].minPoints - total_result) >= 0) {
            pointsUpper = `${
              sortedGrading[g + 1].minPoints - total_result
            } more points to ${sortedGrading[g + 1].grade}`
          }
        } else {
          break
        }
      }
    }
  }

  const renderGradings = []
  if (courseInstance && courseInstance.hasGrading.length > 0) {
    const sortedGrading = courseInstance.hasGrading.sort(function(a, b) {
      return b.minPoints - a.minPoints
    })
    for (let i = 0; i < sortedGrading.length; i++) {
      const item = sortedGrading[i]
      let compareString = <th> </th>
      if (i === 0) {
        compareString = (
          <>
            <th>{item.minPoints}</th>
            <th>-</th>
            <th>{String.fromCharCode(8734)}</th>
          </>
        )
      } else {
        compareString = (
          <>
            <th>{item.minPoints}</th>
            <th>-</th>
            <th>{sortedGrading[i - 1].minPoints - 1}</th>
          </>
        )
      }
      renderGradings.push(
        <tr className="border-bottom" key={`grading-list-${item['@id']}`}>
          {compareString}
          <th>{item.grade}</th>
        </tr>
      )
    }
  }

  return (
    <Container>
      {user ? (
        <h1 className="mb-5">{getUserID() === userId ? 'My results' : `Results of ${showUserName(user, privileges, courseInstance)}`}</h1>
      ) : null}
      <Row>
        <Col lg={9} md={8} sm={12} className="order-md-1 order-sm-2  mt-md-0 mt-4">
          <h2 className="mb-4">Points preview</h2>
          <Table hover size="sm" responsive>
            <thead>
              <tr>
                <th>Result type</th>
                <th>Correction for</th>
                <th>Awarded by</th>
                <th>Description</th>
                <th>Reference</th>
                <th>Points</th>
                <th>Created at</th>
                <th> </th>
              </tr>
            </thead>
            <tbody>{renderResult}</tbody>
          </Table>
        </Col>
        <Col lg={3} md={4} sm={12} className="order-md-2 order-sm-1">
          <h2 className="mb-4">Course grading</h2>
          {grading ? (
            <Alert
              color={isBottom ? 'danger' : 'success'}
              className="text-center"
            >
              <span>Your current grading is</span>
              <h3 className="mt-1 mb-1">{grading}</h3>
              {pointsUpper ? (
                <span>({pointsUpper})</span>
              ) : (<span>yes, this is maximum</span>)}
            </Alert>
          ) : null}
          <Table hover size="sm" responsive>
            <tbody>
              {courseInstance && courseInstance.hasGrading.length === 0 ? (
                <tr>
                  <td>
                    <Alert color="info">No gradings was set</Alert>
                  </td>
                </tr>
              ) : (
                <>{renderGradings}</>
              )}
            </tbody>
          </Table>
        </Col>
      </Row>
    </Container>
  )
}

const mapStateToProps = ({ courseInstanceReducer, privilegesReducer }) => {
  const { courseInstance } = courseInstanceReducer
  const privileges = privilegesReducer
  return {
    courseInstance,
    privileges,
  }
}

export default withRouter(connect(mapStateToProps)(StudentOverview))
