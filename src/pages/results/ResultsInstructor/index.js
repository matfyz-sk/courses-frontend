import React from 'react'
import { Col, Container, Row } from 'reactstrap'
// eslint-disable-next-line import/no-cycle
import StudentsPreview from '../InstructorBlocks/StudentsPreview'
// eslint-disable-next-line import/no-cycle
import ResultTypes from '../InstructorBlocks/ResultTypes'
import CourseGrading from '../InstructorBlocks/CourseGrading'
import { connect } from 'react-redux'
import instructorOnly from '../instructorOnly'

const ResultsInstructor = props => {
  return (
    <Container>
      <h1 className="mb-5">Course results</h1>
      <Row>
        <Col
          lg={7}
          md={6}
          sm={12}
          className="order-md-1 order-sm-2 mt-md-0 mt-4"
        >
          <StudentsPreview />
        </Col>
        <Col lg={5} md={6} sm={12} className="order-md-2 order-sm-1">
          <ResultTypes />
          <CourseGrading />
        </Col>
      </Row>
    </Container>
  )
}

const mapStateToProps = ({ privilegesReducer }) => {
  const privileges = privilegesReducer
  return {
    privileges,
  }
}

export default connect(mapStateToProps)(instructorOnly(ResultsInstructor))
