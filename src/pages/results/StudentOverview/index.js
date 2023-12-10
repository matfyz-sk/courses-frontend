import React, { useState, useEffect } from 'react'
import { Link, withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import { Col, Container, Row, Table, Alert } from 'reactstrap'
import { getShortID, getFullID } from '../../../helperFunctions'
import { formatDate } from '../../../functions/global'
import { redirect } from '../../../constants/redirect'
import { RESULT_DETAIL, RESULT_TYPE } from '../../../constants/routes'
import { getUserID } from '../../../components/Auth'
import { showUserName } from '../../../components/Auth/userFunction'
import ResultModal from '../ResultModal'
import StudentViewResultDetail from '../StudentViewResultDetail'
import { useGetUserQuery } from 'services/user'
import { useGetResultQuery,useGetAllResultTypesQuery  } from 'services/result'
import DetailedStudentList from '../InstructorBlocks/DetailedStudentList'

function StudentOverview(props) {
  const {courseInstance, privileges, match } = props
  const courseInstanceId = !(courseInstance && courseInstance._id)? "" : courseInstance._id
  const userId = match.params && match.params.user_id ? getFullID(match.params.user_id, "user") : getUserID()
  const [ updateFromModal, setUpdateFromModal ] = useState(false)
  const [ showAllStudents, setShowAllStudents ] = useState(false)


  const { 
    data: resultTypeData, 
    isSuccess: isResultTypeSuccess, 
    error: resultTypeError} = useGetAllResultTypesQuery(courseInstanceId,{skip: !courseInstance})

  const { 
    data: resultData, 
    isSuccess: isResultSuccess, 
    error: resultError} = useGetResultQuery({
    courseInstanceId: courseInstanceId,
    userId: userId,
  },{skip: !courseInstance})

  const {
    data: userData,
    isSuccess: isUserSuccess,
    error: userError
  } = useGetUserQuery({
    id: userId
  },{skip: !userId})



  const toggleTable = () => {
    setShowAllStudents(!showAllStudents)
  }

  
  

if (!(isResultSuccess && isResultTypeSuccess && isUserSuccess)){
  return <p>Loading...</p>
}

const resultTypes = resultTypeData
const results = resultData
const user = userData[0]



  let grading = null
  let pointsUpper = null
  let isBottom = false
  const renderResult = []
  let total_result = null
  let resultsWaitingForCorrection = []
  let type = null

  if (results && resultTypes.length>0){
    resultsWaitingForCorrection = []

    for (let result=0; result<results.length; result++){
      resultsWaitingForCorrection.push([results[result].type.name, results[result].points])
    }


    for (let type=0; type<resultTypes[0].hasResultType.length; type++){

      if (resultTypes[0].hasResultType[type].correctionFor != null){
        let correctedResults = []

        for (let toCorrect=0; toCorrect<resultsWaitingForCorrection.length; toCorrect++){
          let shouldReplace = false
          for (let s=0; s<resultsWaitingForCorrection.length; s++){
              if (resultsWaitingForCorrection[s][0] == resultTypes[0].hasResultType[type].name){
                shouldReplace = true
              }
          }
          if ((resultsWaitingForCorrection[toCorrect][0] != resultTypes[0].hasResultType[type].correctionFor.name) || !shouldReplace){
            correctedResults.push(resultsWaitingForCorrection[toCorrect])
          }
        }
        resultsWaitingForCorrection = correctedResults
      }
    }

    
  }

  if (results && resultTypes.length > 0) {
    total_result = 0
    for (let i = 0; i < results.length; i++) {
      const result = results[i]
      for (let t=0; t<resultTypes[0].hasResultType.length; t++){
        if (result.type && resultTypes[0].hasResultType[t].name == result.type.name){
          type = resultTypes[0].hasResultType[t]
        }
      }
    
      renderResult.push(
        <tr
          key={result['_id']}
          className={
            result.type &&
            result.type.length > 0 &&
            result.points < result.type[0].minPoints
              ? 'text-danger'
              : ''
          }
        >
          <td>
            {result.type && result.type.name ? (
              <Link
                to={redirect(RESULT_TYPE, [
                  {
                    key: 'course_id',
                    value: getShortID(courseInstance['_id']),
                  },
                  {
                    key: 'result_type_id',
                    value: getShortID(result.type['_id']),
                  },
                ])}
              >
                {result.type.name}
              </Link>
            ) : (
              '-'
            )}
          </td>
          <td>
            {type && type.correctionFor ? (
              <Link
                to={redirect(RESULT_TYPE, [
                  {
                    key: 'course_id',
                    value: getShortID(courseInstance['_id']),
                  },
                  {
                    key: 'result_type_id',
                    value: getShortID(type.correctionFor['name']),
                  },
                ])}
              >
                {type.correctionFor.name}
              </Link>
            ) : (
              '-'
            )}
          </td>
          <td>
            {result.awardedBy
              ? result.awardedBy.lastName
              : '-'}
          </td>
          <td>{result.description ? result.description: '-'}</td>
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
              {privileges.inCourseInstance == 'visitor'? <StudentViewResultDetail result={result} />
                :<ResultModal result={result}/>}
            </td>
        </tr>
      )
    }

    for (let res=0; res<resultsWaitingForCorrection.length; res++){
      total_result = total_result + resultsWaitingForCorrection[res][1]
    }
    renderResult.push(
      <tr key="total-results" style={{ fontSize: '1.2rem' }} className="text-right">
        <th colSpan={5} className="pt-3">TOTAL:</th>
        <th colSpan={3} className="pt-3">{total_result} points</th>
      </tr>
    )

    if (courseInstance && courseInstance.hasGrading.length > 0) {

      let newHasGradingArray = []
      for (let i=0; i<courseInstance.hasGrading.length; i++){
        newHasGradingArray.push(courseInstance.hasGrading[i])
      }

      const sortedGrading = newHasGradingArray.sort(function(a, b) {
        return a.minPoints - b.minPoints
      })
      for (let g = 0; g < sortedGrading.length; g++) {
        if (sortedGrading[g].minPoints <= total_result) {
          grading = sortedGrading[g].grade
          isBottom = g == 0
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
    let newHasGradingArray = []
    
    for (let i=0; i<courseInstance.hasGrading.length; i++){
      newHasGradingArray.push(courseInstance.hasGrading[i])
    }

    const sortedGrading = newHasGradingArray.sort(function(a, b) {
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
        <tr className="border-bottom" key={`grading-list-${item['_id']}`}>
          {compareString}
          <th>{item.grade}</th>
        </tr>
      )
    }
  }



  return (<>
  <Container>
    <button onClick={toggleTable}>{showAllStudents? "Show detail" : "Show all students"}</button>
    {showAllStudents? (<DetailedStudentList/>) : 
      (
        <>
      {user ? (
        <h1 className="mb-5">{getUserID() === userId ? 'My results' : `Results of ${showUserName(user, privileges, courseInstance)}`}</h1>
      ) : null}
      <Row>
        <Col lg={9} md={8} sm={12} className="order-md-1 order-sm-2  mt-md-0 mt-4">
          <h2 className="mb-4 mt-4">Points preview</h2>
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
    </>
      )
    }
  </Container>
  </>
    
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