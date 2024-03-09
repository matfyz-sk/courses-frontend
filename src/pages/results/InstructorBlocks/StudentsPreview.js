import React, { useState, useEffect } from 'react'
import { Table } from 'reactstrap'
import { Link, withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import PointsModal from '../PointsModal'
import { redirect } from '../../../constants/redirect'
import { RESULT_USER } from '../../../constants/routes'
// eslint-disable-next-line import/no-cycle
import { getFullID, getShortID } from '../../../helperFunctions'
import { showUserName } from '../../../components/Auth/userFunction'
import { aggregateResults } from '../StudentOverview'
import { 
  useGetUserQuery
 } from 'services/user'
import {
  useGetCourseHasGradingQuery,
  useGetResultQuery,
  useGetAllResultTypesQuery
} from 'services/result'

const StudentsPreview = props => {
  const { match, courseInstanceReducer, privilegesReducer } = props
  const { courseInstance } = courseInstanceReducer
  const { course_id } = match.params
  const privileges = privilegesReducer
  const courseInstanceId = !courseInstance ? "" : courseInstance._id

  const { 
    data: userData, 
    isSuccess: isUserSuccess, 
    error: userError} = useGetUserQuery({
    studentOfId: courseInstanceId,
  },{skip: !courseInstance})

  const { 
    data: resultData, 
    isSuccess: isResultSuccess, 
    error: resultError} = useGetResultQuery({
    courseInstanceId: courseInstanceId,
  },{skip: !courseInstance})

  const { 
    data: gradingData, 
    isSuccess: isGradingSuccess, 
    error: gradingError} = useGetCourseHasGradingQuery(courseInstanceId,{skip: !courseInstance})

  const { 
    data: resultTypeData, 
    isSuccess: isResultTypeSuccess, 
    error: resultTypeError} = useGetAllResultTypesQuery(courseInstanceId,{skip: !courseInstance})

  const gradingList = []
  const renderUsers = []

  if (!(isUserSuccess && isResultSuccess && isGradingSuccess && isResultTypeSuccess)){
    return (
      <>
        <p>Loading...</p>
      </>
    )
  }

  const users = userData
  const resultTypes = resultTypeData
  const gradings = gradingData
  const results = resultData
  

  
  const resultModifier = (user_index, oldVal, newVal) => {
    const newUser = [...users]
    newUser[user_index].result =
      newUser[user_index].result - parseFloat(oldVal) + parseFloat(newVal)
    setUsers(newUser)
  }


  
  if (gradings.length > 0){
    for (let i=0; i<gradings[0].hasGrading.length; i++){
      gradingList.push(gradings[0].hasGrading[i])
    }
  }

  const sortedGrading = gradingList.sort(function(a, b) {
    return a.minPoints - b.minPoints
  })


  if (users && users.length > 0){

    for (let i=0; i<users.length; i++){
      const user = {
        user: users[i],
        result: 0,
      }
      let myResults = []

      let resultsWaitingForCorrection = []

      if (results){
        for (let r=0; r<results.length; r++){
          
          if (results[r].hasUser._id == user.user._id){
            myResults.push(results[r])
            for (let type=0; type<resultTypes[0].hasResultType.length; type++){
              if (resultTypes[0].hasResultType[type]!=null && results[r].type && resultTypes[0].hasResultType[type]._id == results[r].type._id){
                resultsWaitingForCorrection.push([resultTypes[0].hasResultType[type].name, results[r].points])
              }
            }
          }
        }
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

      for (let res=0; res<resultsWaitingForCorrection.length; res++){
        user.result = user.result + resultsWaitingForCorrection[res][1]
      }
      let totalAfterAggregation = 0
      for (let i=0; i<resultTypes[0].hasResultType.length; i++){
        totalAfterAggregation += aggregateResults(resultTypes[0].hasResultType[i], resultTypes[0].hasResultType, myResults)
      }

      let grading = ''
      for (let g = 0; g < sortedGrading.length; g++) {
        if (sortedGrading[g].minPoints <= totalAfterAggregation) {
          grading = sortedGrading[g].grade
        }else{
          break
        }
      }
      
      

      renderUsers.push(
        <tr key={`user-list-${i}`}>
          <td>{showUserName(users[i], privileges, courseInstance)} </td>
          <td>{totalAfterAggregation? totalAfterAggregation : 0}</td>
          <td>{grading!='' ? grading : 'No grade'}</td>
          <td className="text-right">
            <PointsModal
              user={users[i]}
              userIndex={i}
              resultModifier={resultModifier}
              resultTypes={resultTypes}
            />
            <Link
              to={redirect(RESULT_USER, [
                {
                  key: 'course_id',
                  value: course_id,
                },
                { key: 'user_id', value: getShortID(users[i]['_id']) },
              ])}
              className="btn btn-sm btn-link ml-2"
            >
              Profile
            </Link>
          </td>
        </tr>
      )
    }
  }

  return (
    <>
      <h2 className="mb-4 mt-4">Students preview</h2>
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