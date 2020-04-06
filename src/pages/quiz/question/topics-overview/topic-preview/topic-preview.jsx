/* eslint-disable react/forbid-prop-types */
import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import axios from 'axios'
import {
  CardBody,
  CardLink,
  CardSubtitle,
  Collapse,
  Button,
  Row,
  Col,
  CardTitle,
} from 'reactstrap'

import apiConfig from '../../../../../configuration/api'
// import InfoTable from './info-table/info-table'

import AssignmentPreview from './assignment-preview/assignment-preview'

function TopicPreview(props) {
  const {
    id,
    assignment,
    name,
    toggle,
    collapse,
    isTeacher,
    fetchDeleteAssignment,
  } = props
  let assignmentId
  let description
  let startTime
  let endTime = null

  if (assignment) {
    assignmentId = assignment.id
    description = assignment.description
    if (assignment.creationPeriod) {
      startTime = assignment.creationPeriod.startDate
      endTime = assignment.creationPeriod.endDate
    }
  }
  const deleteAssignment =
    isTeacher && assignmentId
      ? () => {
          fetchDeleteAssignment(assignmentId)
        }
      : null

  // const questionsApproved = []
  // const questionsNotApproved = []
  // if (questions) {
  //   questions.forEach(question => {
  //     // question.approvedAsPublicId !== 'undefined' ||
  //     // question.approvedAsPrivateId !== 'undefined'
  //     //   ? questionsApproved.push(question)
  //     //   : questionsNotApproved.push(question);
  //   })
  // }
  return (
    <>
      <CardBody>
        <CardTitle className="h3">{name}</CardTitle>
        <CardLink href="#" onClick={toggle}>
          expand
        </CardLink>
      </CardBody>
      <Collapse isOpen={collapse}>
        <CardBody className="pt-0">
          {!assignment && isTeacher && (
            <Button
              color="success"
              tag={Link}
              to={{
                pathname: '/quiz/questionAssignment',
                state: { topic: id },
              }}
            >
              Create Question Assignment
            </Button>
          )}
          {assignment && (
            <>
              <AssignmentPreview
                id={assignmentId.substring(assignmentId.lastIndexOf('/') + 1)}
                description={description}
                startTime={startTime}
                endTime={endTime}
                isTeacher={isTeacher}
                topic={id}
                deleteAssignment={deleteAssignment}
              />
            </>
          )}
        </CardBody>
        <CardBody>
          <CardSubtitle tag="h3" className="h4">
            Questions
          </CardSubtitle>
          {/* <Row>
            {questionsNotApproved ? (
              <Col xs="12" md="6">
                <InfoTable
                  headerText="In progress"
                  questions={questionsNotApproved}
                  isTeacher={isTeacher}
                  link="/quiz/question/"
                />
              </Col>
            ) : null}
            {questionsApproved ? (
              <Col xs="12" md="6">
                <InfoTable
                  headerText="Approved"
                  questions={questionsApproved}
                  isTeacher={isTeacher}
                  link="/quiz/question/"
                />
              </Col>
            ) : null}
          </Row> */}
          {(assignment &&
            new Date(assignment.startTime) < new Date() &&
            new Date(assignment.endTime) > new Date()) ||
          isTeacher ? (
            <Button
              color="success"
              tag={Link}
              to={{
                pathname: '/quiz/question',
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
