import React from 'react'
import {
  BASE_URL,
  COURSE_URL,
  COURSE_INSTANCE_URL,
  EVENT_URL,
} from '../constants'
import { axiosRequest } from '../AxiosRequests'
import { Alert, Button, CardSubtitle, Col, Table } from 'reactstrap'
import { connect } from 'react-redux'
import { setCourseMigrationState } from '../../../redux/actions'
import { getShortId } from '../Helper'
import { addDays, dateDiffInDays } from '../Timeline/timeline-helper'
import copyFileSystem from '../../documents/common/functions/copyFileSystem'
import { axiosUpdateEntity } from 'helperFunctions'

class Submit extends React.Component {
  constructor() {
    super()

    this.state = {
      errors: [],
      sent: false,
    }
  }

  migrate = () => {
    const {
      name,
      description,
      startDate,
      endDate,
      instanceOf,
      instructors,
    } = this.props.courseMigrationState
    const courseInstance = this.props.courseInstance

    const { errors } = this.state

    const courseId = getShortId(instanceOf[0]['@id'])
    const courseFullId = [
      `http://www.courses.matfyz.sk/data${COURSE_URL}/${courseId}`,
    ]

    const hasInstructor = instructors.map(instructor => {
      return instructor.fullId
    })

    const hasDocument = courseInstance.hasDocument.map(doc => doc["@id"])

    const data = {
      name,
      description,
      startDate,
      endDate,
      hasInstructor,
      instanceOf: courseFullId,
      hasDocument
    }

    const url = BASE_URL + COURSE_INSTANCE_URL

    axiosRequest('post', data, url)
      .then(async response => {
        if (response && response.status === 200) {
          this.createEvents(response.data.resource.iri)

          const newCourseInstanceId = response.data.resource.iri
          const data = {
            fileExplorerRoot: await copyFileSystem(
              courseInstance.fileExplorerRoot[0],
              newCourseInstanceId
            )
          }
          axiosUpdateEntity(data, `courseInstance/${getShortId(newCourseInstanceId)}`)
            .then(response => {
              if (response.failed) {
                errors.push(
                  'There was a problem with server while sending your form. Try again later.'
                )
                return
              }
              this.setState({
                sent: true,
              })
            })
        } else {
          errors.push(
            'There was a problem with server while sending your form. Try again later.'
          )
          this.setState({
            errors,
          })
        }
      })
      .catch()
  }

  createEvents = courseId => {
    const {
      allEvents,
      checkedEvents,
      startDate,
    } = this.props.courseMigrationState
    const { courseInstance } = this.props

    const noOfDays = dateDiffInDays(
      new Date(courseInstance.startDate),
      startDate
    )

    let eventsToAdd = []

    for (let event of allEvents) {
      if (checkedEvents.includes(event.id)) {
        const newStartDate = addDays(event.startDate, noOfDays)
        const newEndDate = addDays(event.endDate, noOfDays)
        const newDocumentReference = event.documentReference.map(ref => ({
          hasDocument: ref.hasDocument,
          courseInstance: courseId,
        }))
        const e = {
          name: event.name,
          description: event.description,
          startDate: newStartDate,
          endDate: newEndDate,
          courseInstance: courseId,
          _type: event.type,
          documentReference: newDocumentReference
        }
        eventsToAdd.push(e)
      }
    }

    const url = BASE_URL + EVENT_URL
    let errors = []
    for (let event of eventsToAdd) {
      axiosRequest('post', event, url)
        .then(response => {
          if (response && response.status === 200) {
          } else {
            errors.push(
              `There was a problem with server while posting ${event.name}`
            )
          }
        })
        .catch()
    }

    if (errors.length > 0) {
      console.log(errors)
    }
  }

  render() {
    const { sent } = this.state
    const { courseMigrationState } = this.props
    const { go, previous } = this.props.navigation

    return (
      <div>
        {sent && (
          <>
            <Alert color="secondary">New run of Course Instance Created!</Alert>
            <div className="button-container-migrations">
              <Button className="new-event-button" onClick={() => go('course')}>
                New Course Migration
              </Button>
            </div>
          </>
        )}
        <CardSubtitle className="card-subtitle-migrations">
          Overview
        </CardSubtitle>
        {courseMigrationState && (
          <Table>
            <tbody>
              <tr>
                <th>Name</th>
                <td>{courseMigrationState.name}</td>
              </tr>
              <tr>
                <th>Description</th>
                <td>{courseMigrationState.description}</td>
              </tr>
              <tr>
                <th>From</th>
                <td>{courseMigrationState.startDate.toString()}</td>
              </tr>
              <tr>
                <th>To</th>
                <td>{courseMigrationState.endDate.toString()}</td>
              </tr>
              <tr>
                <th>Instructors</th>
                <td>
                  {courseMigrationState.instructors.map(i => i.name + '; ')}
                </td>
              </tr>
              <tr>
                <th>Events</th>
                <td>
                  {courseMigrationState.allEvents.map(e => {
                    if (courseMigrationState.checkedEvents.includes(e.id)) {
                      return e.name + '; '
                    }
                  })}
                </td>
              </tr>
            </tbody>
          </Table>
        )}
        {!sent && (
          <div className="button-container-migrations">
            <Button className="new-event-button" onClick={previous}>
              Previous
            </Button>
            <Button className="new-event-button" onClick={this.migrate}>
              Migrate
            </Button>
          </div>
        )}
      </div>
    )
  }
}

const mapStateToProps = ({ courseInstanceReducer, courseMigrationReducer }) => {
  return {
    courseInstance: courseInstanceReducer.courseInstance,
    courseMigrationState: courseMigrationReducer,
  }
}

export default connect(mapStateToProps, { setCourseMigrationState })(Submit)
