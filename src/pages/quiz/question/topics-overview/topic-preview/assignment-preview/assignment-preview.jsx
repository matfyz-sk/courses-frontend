/* eslint-disable react/forbid-prop-types */
import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import { CardSubtitle, CardText, Button, CardHeader, Row } from 'reactstrap'

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
      <CardHeader>
        <Row>
          <CardSubtitle tag="h3" className="h4">
            Assignment
          </CardSubtitle>
          {deleteAssignment && (
            <Button
              color="danger"
              onClick={deleteAssignment}
              className="text-center"
            >
              X
            </Button>
          )}
        </Row>
      </CardHeader>
      <CardText>{description}</CardText>
      <CardText>
        Start date:
        {` ${new Date(startTime).toLocaleDateString()}`}
      </CardText>
      <CardText>
        End date:
        {` ${new Date(endTime).toLocaleDateString()}`}
      </CardText>
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
