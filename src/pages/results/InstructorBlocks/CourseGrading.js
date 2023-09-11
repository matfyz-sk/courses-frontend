import React, { useState, useEffect } from 'react'
import { Alert, Table } from 'reactstrap'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import CriteriaModal from '../CriteriaModal'
import {
  useLazyGetCourseHasGradingQuery,
} from "services/result"




const CourseGrading = props => {
  const { courseInstanceReducer } = props
  const { courseInstance } = courseInstanceReducer
  const [isReady, setIsReady] = useState(false);
  const [ getCourseGrading ] = useLazyGetCourseHasGradingQuery()
  const [ gradings, setGradings ] = useState([])
  const [ modalUpdate, setModalUpdate ] = useState(false)
  const gradingsList = [] 
  const renderGradings = []

  useEffect(() => {
    if (courseInstance && courseInstance.hasGrading) {
      setIsReady(true);
      getCourseGrading(courseInstance._id).unwrap().then( response => {
        setGradings(response[0].hasGrading)
      }
      ).catch(e => {
        console.log(e)
      })
    }
  }, [courseInstance, gradings, modalUpdate]);


  function updateGrading(){
    setModalUpdate(!modalUpdate)
  }
 
  
  if (!isReady){
    return (
    <>
    <h2 className="mb-4 mt-4">Course grading</h2>
    <div>Loading...</div>
    </>
    )
  }

  
  if (gradings.length > 0){
      for (let i = 0; i < gradings.length; i++) {
          const item = gradings[i]
          gradingsList.push(item)
      }
  }
 

  const sortedGrading = gradingsList.sort(function(a, b) {
      return b.minPoints - a.minPoints})


  if (gradings.length > 0) {
    for (let i = 0; i < sortedGrading.length; i++) {
        let item = sortedGrading[i]
        let compareString = <th> </th>
        if (i === 0) {
          compareString = (
            <>
              <td>{item.minPoints}</td>
              <td>-</td>
              <td>{String.fromCharCode(8734)}</td>
            </>
          )
        } else {
          compareString = (
            <>
              <td>{item.minPoints}</td>
              <td>-</td>
              <td>{gradingsList[i - 1].minPoints - 1}</td>
            </>
          )
        }
        renderGradings.push(
          <tr className="border-bottom" key={`grading-list-${item._id}`}>
            
            <th>{item.grade}</th>
            {compareString}
            <td className="text-right">
              <CriteriaModal list={gradings} grading={item} updateGrading={updateGrading}/>
            </td>
          </tr>
        )
      }
    }
  

  return (
    <>
      <h2 className="mb-4 mt-4">Course grading</h2>
      <CriteriaModal list={gradings}  updateGrading={updateGrading}/>
      <Table hover size="sm" responsive>
      <thead>
          <tr className="border-bottom">
            <th>Grade</th>
            <th colSpan={5}>Points range</th>
          </tr>
        </thead>
        <tbody>
          {gradings.length === 0 ? (
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
    </>
  )
}

const mapStateToProps = state => {
  return state
}

export default withRouter(connect(mapStateToProps)(CourseGrading))
