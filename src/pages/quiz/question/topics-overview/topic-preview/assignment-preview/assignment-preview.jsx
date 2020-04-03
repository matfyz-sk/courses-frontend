/* eslint-disable react/forbid-prop-types */
import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { CardSubtitle, CardText, Button } from 'reactstrap';

export default function AssignmentPreview({
  id,
  description,
  startTime,
  endTime,
  isTeacher,
}) {
  return (
    <>
      <CardSubtitle tag="h3" className="h4">
        Assignment
      </CardSubtitle>
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
          color="primary"
          tag={Link}
          to={`/quiz/questionAssignment/${encodeURIComponent(id)}`}
        >
          Edit assignment
        </Button>
      ) : null}
    </>
  );
}

AssignmentPreview.propTypes = {
  id: PropTypes.any,
  description: PropTypes.any,
  startTime: PropTypes.any,
  endTime: PropTypes.any,
  isTeacher: PropTypes.bool,
};

AssignmentPreview.defaultProps = {
  id: null,
  description: null,
  startTime: null,
  endTime: null,
  isTeacher: false,
};
