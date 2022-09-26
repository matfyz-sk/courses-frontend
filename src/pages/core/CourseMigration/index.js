import React from 'react'
import { Alert, Card, CardBody, CardHeader, Container } from 'reactstrap'
import './CourseMigration.css'
import { connect } from 'react-redux'
import { MultiStepForm } from '../MultiStepForm'
import { BASE_URL, EVENT_URL, INITIAL_MIGRATION_STATE } from '../constants'
import { getShortId } from '../Helper'
import { axiosRequest, getData } from '../AxiosRequests'
import { getEvents, sortEventsFunction } from '../Timeline/timeline-helper'
import {
  setCourseMigrationState,
  setCourseMigrationAllEvents,
} from '../../../redux/actions'

class CourseMigration extends React.Component {
  constructor() {
    super()

    this.state = {
      loading: true,
    }
  }

  componentDidMount() {
    if (!this.props.initialized) {
      this.setCourseInstance()
    }
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (prevProps.courseInstance !== this.props.courseInstance) {
      if (!this.props.initialized) {
        this.setCourseInstance()
      }
    }
  }

  setCourseInstance = () => {
    const { courseInstance } = this.props
    if (courseInstance) {
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

      this.props.setCourseMigrationState(state)
      this.getEvents()
    }
  }

  getEvents = () => {
    const { courseInstance } = this.props

    const courseInstanceId = getShortId(courseInstance['@id'])

    const url = `${
      BASE_URL + EVENT_URL
    }?courseInstance=${courseInstanceId}&_join=uses,recommends,documentReference`

    axiosRequest('get', null, url).then(response => {
      const data = getData(response)
      this.setState({
        loading: false,
      })
      if (data != null && data !== []) {
        const allEvents = getEvents(data).sort(sortEventsFunction)

        this.props.setCourseMigrationAllEvents(allEvents)
      }
    })
  }

  render() {
    const { courseInstance } = this.props
    const { loading } = this.state

    if (loading) {
      return (
        <Alert color="secondary" className="empty-message">
          Loading...
        </Alert>
      )
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
