import React, { useState, useEffect } from 'react'
import { Alert, Table } from 'reactstrap'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import CriteriaModal from '../CriteriaModal'

const CourseGrading = props => {
  const { courseInstanceReducer } = props
  const { courseInstance } = courseInstanceReducer

  const renderGradings = []
  if (courseInstance && courseInstance.hasGrading.length > 0) {
    courseInstance.hasGrading.forEach(item => {
      renderGradings.push(
        <tr className="border-bottom" key={`grading-list-${item['@id']}`}>
          <th>0 - 25 b</th>
          <th>{item.grade}</th>
          <td className="text-right">
            <CriteriaModal grading={item} />
          </td>
        </tr>
      )
    })
  }

  return (
    <>
      <h2 className="mb-4 mt-4">Course grading</h2>
      <CriteriaModal />
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
    </>
  )
}

const mapStateToProps = state => {
  return state
}

export default withRouter(connect(mapStateToProps)(CourseGrading))
