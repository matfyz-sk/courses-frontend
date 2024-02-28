import React, { useState, useEffect } from 'react'
import { Table } from 'reactstrap'
import { Link, withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import PointsModal from '../PointsModal'
import { redirect } from '../../../constants/redirect'
import { RESULT_USER, RESULT_TYPE } from '../../../constants/routes'
// eslint-disable-next-line import/no-cycle
import { getShortID } from '../../../helperFunctions'
import { showUserName } from '../../../components/Auth/userFunction'
import { useGetUserQuery } from 'services/user'
import { useGetCourseHasGradingQuery,
  useGetResultQuery,
  useGetAllResultTypesQuery } from 'services/result'
  import { aggregateResults } from '../StudentOverview'

const DetailedStudentList = props => {
    const { match, courseInstanceReducer, privilegesReducer } = props
    const { courseInstance } = courseInstanceReducer
    const courseInstanceId = !courseInstance ? "" : courseInstance._id
    const privileges = privilegesReducer
    const { course_id } = match.params
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
    const renderResultTypes = []

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
          let renderGrades = []
          let resultsWaitingForCorrection = []

          if (resultTypes.length > 0){
            
            for (let type=0; type<resultTypes[0].hasResultType.length; type++){
                let toBePushed = 0
                if (results){
                  for (let r=0; r<results.length; r++){  
                    if (results[r].hasUser._id == user.user._id && results[r].type && results[r].type._id == resultTypes[0].hasResultType[type]._id){
                        resultsWaitingForCorrection.push([resultTypes[0].hasResultType[type].name, results[r].points])
                        toBePushed += results[r].points
                        myResults.push(results[r])
                    }
                  }
                }
                renderGrades.push(<td>{toBePushed}</td>)
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
              <td><Link
                to={redirect(RESULT_USER, [
                  {
                    key: 'course_id',
                    value: getShortID(courseInstance._id),
                  },
                  { key: 'user_id', value: getShortID(user.user._id) },
                ])}
                className="btn btn-sm btn-link ml-2"
              >
                {user.user._id == props.userReducer.user.fullURI? user.user.firstName + " " + user.user.lastName : showUserName(users[i], privileges, courseInstance)}
              </Link>
              </td>
              {renderGrades}
              <td>{totalAfterAggregation}</td>
              <td>{grading!='' ? grading : 'No grade'}</td>
              <td className="text-right">
              </td>
            </tr>
          )
        }
      }

    

    if (resultTypes.length > 0){
        for (let i=0; i<resultTypes[0].hasResultType.length; i++){
        renderResultTypes.push((
            <th>{resultTypes[0].hasResultType[i].name}</th>
        ))
        }
    }
    


    return (
        <>
        <h2 className="mb-4 mt-4">List of all students</h2>
        <Table hover size="sm" responsive>
        <thead>
          <tr>
            <th>Full name</th>
            {renderResultTypes}
            <th>Total points</th>
            <th>Final grade</th>
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
  
export default withRouter(connect(mapStateToProps)(DetailedStudentList))