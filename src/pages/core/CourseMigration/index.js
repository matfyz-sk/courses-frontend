import React from 'react'
import { Alert, Card, CardBody, CardHeader, Container } from 'reactstrap'
import './CourseMigration.css'
import { connect } from 'react-redux'
import { MultiStepForm } from '../MultiStepForm'
import { getEvents, sortEventsFunction } from '../Timeline/timeline-helper'
import {
  setCourseMigrationState,
  setCourseMigrationAllEvents,
} from '../../../redux/actions'
import { useGetEventQuery } from 'services/event'

function CourseMigration(props) {
  const { courseInstance } = props
  const { data, isSuccess, isLoading } = useGetEventQuery({courseInstanceId: courseInstance['_id']})

  if (!props.initialized && courseInstance) {
    const state = {
      initialized: true,
      name: courseInstance.name,
      description: courseInstance.description
        ? courseInstance.description
        : '',
      startDate: new Date(courseInstance.startDate.millis),
      endDate: new Date(courseInstance.endDate.millis),
      instructors: courseInstance.hasInstructor
        ? courseInstance.hasInstructor.map(instructor => {
            return {
              fullId: instructor['_id'],
              name: `${instructor.firstName} ${instructor.lastName}`,
            }
          })
        : [],
      course: courseInstance.course,
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
            {courseInstance && <> - {courseInstance.course[0].name}</>}
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
