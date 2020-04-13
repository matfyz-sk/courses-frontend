import React from 'react'
import Navigation from '../../../components/Navigation'
import CourseForm from '../CourseForm'
// import {withAuthorization} from "../../../components/Session";
import { Container, Card, CardHeader, CardBody } from 'reactstrap'
import './NewCourse.css'
import { INITIAL_COURSE_STATE } from '../constants'

const NewCourse = () => (
  <div>
    <Navigation />
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
