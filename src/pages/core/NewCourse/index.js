import React from 'react'
import CourseForm from '../CourseForm'
import { Container, Card, CardHeader, CardBody } from 'reactstrap'
import './NewCourse.css'
import { INITIAL_COURSE_STATE } from '../constants'

const NewCourse = () => (
  <div>
    <Container>
      <Card>
        <CardHeader className="event-card-header">New Course</CardHeader>
        <CardBody>
          <CourseForm typeOfForm="Create" {...INITIAL_COURSE_STATE} />
        </CardBody>
      </Card>
    </Container>
  </div>
)

export default NewCourse
