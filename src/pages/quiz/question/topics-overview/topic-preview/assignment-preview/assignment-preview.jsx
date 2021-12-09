/* eslint-disable react/forbid-prop-types */
import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import { Table, CardText, Button, Row, Col } from 'reactstrap'
import { FaTrash, FaTrashAlt } from 'react-icons/fa'

export default function AssignmentPreview({
  id,
  description,
  startTime,
  endTime,
  isTeacher,
  deleteAssignment,
  match,
}) {
  return (
    <>
      <h4 className="h4">Assignment</h4>
      <CardText>{description}</CardText>
      <CardText>
        <label>Start date: </label>
        {` ${new Date(startTime).toLocaleDateString()}`}
        <br/>
        <label>End date:</label>
          {` ${new Date(endTime).toLocaleDateString()}`}
      </CardText>
      <Row>
        {isTeacher ? (
          <Button
            color="success"
            tag={Link}
            to={`/courses/${
              match.params.courseId
            }/quiz/questionAssignment/${encodeURIComponent(id)}`}
          >
            Edit assignment
          </Button>
        ) : null}
        {deleteAssignment && (
          <Button
            color="danger"
            onClick={deleteAssignment}
            className="ml-2"
          >
            <FaTrashAlt/>
          </Button>
        )}
      </Row>
    </>
  )
}

AssignmentPreview.propTypes = {
  id: PropTypes.any,
  description: PropTypes.any,
  startTime: PropTypes.any,
  endTime: PropTypes.any,
  isTeacher: PropTypes.bool,
}

AssignmentPreview.defaultProps = {
  id: null,
  description: null,
  startTime: null,
  endTime: null,
  isTeacher: false,
}
