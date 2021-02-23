/* eslint-disable react/forbid-prop-types */
import React from 'react'
// import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
// import axios from 'axios'
import {
  CardBody,
  CardLink,
  Collapse,
  Button,
  Row,
  Col,
  CardTitle,
} from 'reactstrap'

// import apiConfig from '../../../../../configuration/api'
import InfoTable from './info-table/info-table'

import AssignmentPreview from './assignment-preview/assignment-preview'
import { axiosAddEntity } from 'helperFunctions'

function TopicPreview(props) {
  const {
    id,
    assignment,
    name,
    toggle,
    collapse,
    isTeacher,
    fetchDeleteAssignment,
    questions,
    topics,
    match,
  } = props
  let assignmentId
  let description
  let startTime
  let endTime = null

  if (assignment) {
    assignmentId = assignment.id
    description = assignment.description
    startTime = assignment.startDate
    endTime = assignment.endDate
  }
  const deleteAssignment =
    isTeacher && assignmentId
      ? () => {
          fetchDeleteAssignment(assignmentId)
        }
      : null

  const questionsApproved = []
  const questionsNotApproved = []
  if (questions) {
    questions.forEach(question => {
      if (Array.isArray(question.approver) && question.approver.length > 0) {
        questionsApproved.push(question)
      } else {
        questionsNotApproved.push(question)
      }
    })
  }


  return (
    <>
      <CardBody>
        <CardTitle className="h3">{name}</CardTitle>
        { collapse 
          ? <Button color='success' onClick={toggle}>
              Collapse
            </Button> 
          : <Button color='success' onClick={toggle}>
              Expand
            </Button> 
        }
      </CardBody>
      <Collapse isOpen={collapse}>
        <CardBody className="pt-0">
          {!assignment && isTeacher && (
            <Button
              color="success"
              tag={Link}
              to={{
                pathname: `/courses/${match.params.courseId}/quiz/questionAssignment`,
                state: { topic: id },
              }}
            >
              Create Question Assignment
            </Button>
          )}
          {assignment && (
            <AssignmentPreview
              id={assignmentId.substring(assignmentId.lastIndexOf('/') + 1)}
              description={description}
              startTime={startTime}
              endTime={endTime}
              isTeacher={isTeacher}
              topic={id}
              deleteAssignment={deleteAssignment}
              match={match}
            />
          )}
          <hr />
          <h3 className="mb-3">Questions</h3>
          <Row>
            {questionsNotApproved ? (
              <Col xs="12" md="6">
                <InfoTable
                  headerText="In progress"
                  questions={questionsNotApproved}
                  isTeacher={isTeacher}
                  link={`/courses/${match.params.courseId}/quiz/questionEdit`}
                />
              </Col>
            ) : null}
            {questionsApproved ? (
              <Col xs="12" md="6">
                <InfoTable
                  headerText="Approved"
                  questions={questionsApproved}
                  isTeacher={isTeacher}
                  link={`/courses/${match.params.courseId}/quiz/questionEdit`}
                />
              </Col>
            ) : null}
          </Row>
           {(assignment &&
            new Date(startTime) < new Date() &&
            new Date(endTime) > new Date()) ||
          isTeacher ? (
            <Button
              color="success"
              tag={Link}
              to={{
                pathname: `/courses/${match.params.courseId}/quiz/question`,
                topic: id,
              }}
            >
              Create Question
            </Button>
          ) : null} 
        </CardBody>
      </Collapse>
    </>
  )
}

TopicPreview.propTypes = {
  id: PropTypes.string,
  name: PropTypes.string,
  assignment: PropTypes.any,
  toggle: PropTypes.any,
  collapse: PropTypes.any,
  isTeacher: PropTypes.bool,
}

TopicPreview.defaultProps = {
  id: null,
  name: null,
  assignment: null,
  toggle: null,
  collapse: null,
  isTeacher: null,
}

export default TopicPreview
