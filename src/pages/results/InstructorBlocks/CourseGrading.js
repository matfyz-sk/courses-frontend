import React, { useState, useEffect } from 'react'
import { Alert, Table, Row, Col } from 'reactstrap'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import CriteriaModal from '../CriteriaModal'
import { useGetAllGradingsQuery } from 'services/result'

const CourseGrading = props => {
  const { courseInstanceReducer } = props
  const { courseInstance } = courseInstanceReducer
  const courseInstanceId = !courseInstance ? "" : courseInstance._id
  const { data } = useGetAllGradingsQuery(courseInstanceId, {
    skip: !courseInstance,
  })
  const sortedGradings = !data ? [] 
  : [...data[0]?.hasGrading].sort((a, b) => b.minPoints - a.minPoints)

  return (
    <>
      <Row>
        <Col xs="auto">
          <h2 className="mb-4 mt-4">Course grading</h2>
        </Col>
        <Col className="mb-4 mt-4">
          <CriteriaModal />
        </Col>
      </Row>
      
      <Table hover size="sm" responsive>
        <tbody>
          {courseInstance && courseInstance.hasGrading.length === 0 ? (
            <tr>
              <td>
                <Alert color="info">No gradings was set</Alert>
              </td>
            </tr>
          ) : (
            <>
              {
                !data ? 
                <tr>
                  <td>
                    <Alert color="info">Loading...</Alert>
                  </td>
                </tr>
                :
                sortedGradings.map((grading, i) =>
                i == 0 ? 
                <tr className="border-bottom" key={`grading-list-${grading['_id']}`}>
                  <>
                    <th>{grading.minPoints}</th>
                    <th>-</th>
                    <th>{String.fromCharCode(8734)}</th>
                  </>
                  <th>{grading.grade}</th>
                  <td className="text-right">
                    <CriteriaModal grading={grading} />
                  </td>
                </tr>
                :
                <tr className="border-bottom" key={`grading-list-${sortedGradings[i]['_id']}`}>
                <>
                  <th>{sortedGradings[i].minPoints}</th>
                  <th>-</th>
                  <th>{sortedGradings[i - 1].minPoints - 1}</th>
                </>
                <th>{sortedGradings[i].grade}</th>
                <td className="text-right">
                  <CriteriaModal grading={sortedGradings[i]} />
                </td>
                </tr>)
              }
            </>
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
