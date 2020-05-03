import React from 'react'
import CourseForm from '../CourseForm'
import { Container, Card, CardHeader, CardBody } from 'reactstrap'
import './NewCourse.css'
import { INITIAL_COURSE_STATE } from '../constants'

const NewCourse = () => (
  <div>
    <Container className="container-view">
      <Card>
        <CardHeader className="event-card-header">New Course</CardHeader>
        <CardBody className="form-cardbody">
          <CourseForm typeOfForm="Create" {...INITIAL_COURSE_STATE} />
        </CardBody>
      </Card>
    </Container>
  </div>
)

export default NewCourse
