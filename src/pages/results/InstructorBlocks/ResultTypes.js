import React, { useState, useEffect } from 'react'
import { Alert, Table } from 'reactstrap'
import { Link, withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import ResultTypeModal from '../ResultTypeModal'
import { redirect } from '../../../constants/redirect'
import { RESULT_TYPE } from '../../../constants/routes'
import { getShortID } from '../../../helperFunctions'
import {
  useLazyGetCourseHasResultTypeQuery,
} from "services/result"

const ResultTypes = props => {
  const { courseInstanceReducer } = props
  const { courseInstance } = courseInstanceReducer
  const [resultTypesList, setResultTypesList] = useState([])
  const [isReady, setIsReady] = useState(false);
  const [ getResultTypes ] = useLazyGetCourseHasResultTypeQuery()
  const [modalUpdate, setModalUpdate] = useState(true)


  useEffect(() => {
    if (courseInstance && courseInstance._id){
      setIsReady(true);
      getResultTypes(courseInstance._id).unwrap().then( response => {
        setResultTypesList(response[0].hasResultType)
      }
      ).catch(e => {
        console.log(e)
      })
    }
  }, [courseInstance, resultTypesList, modalUpdate])

  function updateResultTypes(){
    setModalUpdate(!modalUpdate)  
  }


  if (!isReady){
    return (
    <>
    <h2 className="mb-4 mt-4">Result types</h2>
    <div>Loading...</div>
    </>)
  }

  const renderTypes = []

  if (resultTypesList && resultTypesList.length > 0) {
    resultTypesList.forEach(item => {
      renderTypes.push(
        <tr className="border-bottom" key={`grading-list-${item._id}`}>
          <th>{item.name}</th>
          <td>{item.minPoints}</td>
          <td>{item.correctionFor ? item.correctionFor.name : ''}</td>
          <td className="text-right">
            <ResultTypeModal resultType={item} updateResultTypes={updateResultTypes} resultTypesList={resultTypesList}/>
            {courseInstance ? (
              <Link
                to={redirect(RESULT_TYPE, [
                  {
                    key: 'course_id',
                    value: getShortID(courseInstance._id),
                  },
                  { key: 'result_type_id', value: getShortID(item._id) },
                ])}
                className="btn btn-sm btn-link ml-2"
              >
                Points
              </Link>
            ) : null}
          </td>
        </tr>
      )
    })
  }

  return (
    <>
      <h2 className="mb-4">Result types</h2>
      <ResultTypeModal  updateResultTypes={updateResultTypes} resultTypesList={resultTypesList}/>
      <Table hover size="sm" responsive>
        <thead>
          <tr className="border-bottom">
            <th>Name</th>
            <th>Min points</th>
            <th>Correction for</th>
            <th> </th>
          </tr>
        </thead>
        <tbody>
          {courseInstance && courseInstance.hasResultType.length === 0 ? (
            <tr>
              <td colSpan={4}>
                <Alert color="info">No result type was set</Alert>
              </td>
            </tr>
          ) : (
            <>{renderTypes}</>
          )}
        </tbody>
      </Table>
    </>
  )
}

const mapStateToProps = state => {
  return state
}

export default withRouter(connect(mapStateToProps)(ResultTypes))
