import React from 'react'
import { Alert, Card, CardBody, CardHeader, Container } from 'reactstrap'
import './CourseMigration.css'
import { connect } from 'react-redux'
import { MultiStepForm } from '../MultiStepForm'
import { getShortId } from '../Helper'
import { getEvents, sortEventsFunction } from '../Timeline/timeline-helper'
import {
  setCourseMigrationState,
  setCourseMigrationAllEvents,
} from '../../../redux/actions'
import { useGetCourseInstanceEventQuery } from 'services/event'

function CourseMigration(props) {
  const { courseInstance } = props
  console.log(courseInstance)
  const courseInstanceId = getShortId(courseInstance['@id'])
  const { data, isSuccess, isLoading } = useGetCourseInstanceEventQuery(courseInstanceId)

  if (!props.initialized && courseInstance) {
    const state = {
      initialized: true,
      name: courseInstance.name,
      description: courseInstance.description
        ? courseInstance.description
        : '',
      startDate: new Date(courseInstance.startDate),
      endDate: new Date(courseInstance.endDate),
      instructors: courseInstance.hasInstructor
        ? courseInstance.hasInstructor.map(instructor => {
            return {
              fullId: instructor['@id'],
              name: `${instructor.firstName} ${instructor.lastName}`,
            }
          })
        : [],
      instanceOf: courseInstance.instanceOf,
      quizzes: [],
      assignments: [],
      checkedEvents: [],
    }

    props.setCourseMigrationState(state)
  }

  if (isLoading) {
    return (
      <Alert color="secondary" className="empty-message">
        Loading...
      </Alert>
    )
  }
  
  if(isSuccess && data && !props.courseMigrationState.allEvents) {
    const allEvents = getEvents(data).sort(sortEventsFunction)
    props.setCourseMigrationAllEvents(allEvents)
  }

  return (
    <>
      <Container className="container-view">
        <Card className="course-migration-card event-card">
          <CardHeader className="event-card-header">
            Course Migration
            {courseInstance && <> - {courseInstance.instanceOf[0].name}</>}
          </CardHeader>
          <CardBody className="course-migration-card">
            <MultiStepForm />
          </CardBody>
        </Card>
      </Container>
    </>
  )
}

const mapStateToProps = ({ courseInstanceReducer, courseMigrationReducer }) => {
  return {
    courseInstance: courseInstanceReducer.courseInstance,
    initialized: courseMigrationReducer.initialized,
    courseMigrationState: courseMigrationReducer,
  }
}

export default connect(mapStateToProps, {
  setCourseMigrationState,
  setCourseMigrationAllEvents,
})(CourseMigration)
