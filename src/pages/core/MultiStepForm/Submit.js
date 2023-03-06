import React, {useState} from 'react'
import { DATA_PREFIX } from 'constants/ontology'
import {
  COURSE_URL,
} from '../constants'
import { Alert, Button, CardSubtitle, Col, Table } from 'reactstrap'
import { connect } from 'react-redux'
import { setCourseMigrationState } from '../../../redux/actions'
import { getShortId } from '../Helper'
import { addDays, dateDiffInDays } from '../Timeline/timeline-helper'
import copyFileSystem from '../../documents/common/functions/copyFileSystem'
import { useNewCourseInstanceMutation, useUpdateCourseInstanceMutation } from 'services/course'
import { useNewEventMutation } from 'services/event'

function Submit(props) {
  const { courseMigrationState } = props
  const { go, previous } = props.navigation
  const [sent, setSent] = useState(false)
  const [errors, setErrors] = useState([])
  const [newCourseInstance, newCourseInstanceResult] = useNewCourseInstanceMutation()
  const [updateCourseInstance, updateCourseInstanceResult] = useUpdateCourseInstanceMutation()
  const [newEvent, newEventResult] = useNewEventMutation()
  
  const migrate = () => {
    const {
      name,
      description,
      startDate,
      endDate,
      instanceOf,
      instructors,
    } = courseMigrationState
    const courseInstance = props.courseInstance

    const courseId = getShortId(instanceOf[0]['@id'])
    const courseFullId = [
      `${ DATA_PREFIX }${ COURSE_URL }/${ courseId }`,
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
    console.log(data)
    const new_errors = []
    
    newCourseInstance(data).unwrap().then(async response => {
      console.log(response)
      createEvents(response.resource.iri)
      const newCourseInstanceId = response.resource.iri
      const data = {
        fileExplorerRoot: await copyFileSystem(
          courseInstance.fileExplorerRoot[0],
          newCourseInstanceId
        )
      }
      const id = getShortId(newCourseInstanceId)
      console.log(id)
      console.log(data)
      updateCourseInstance({id, data}).unwrap().then(updateResponse => {
        console.log(updateResponse)
        setSent(true)
      }).catch(errors => {
        new_errors.push(
          'There was a problem with server while sending your form. Try again later.'
        )
      })
    }).catch(errors => {
      new_errors.push(
        'There was a problem with server while sending your form. Try again later.'
      )
    })
    setErrors(new_errors)
  }

  const createEvents = courseId => {
    const {
      allEvents,
      checkedEvents,
      startDate,
    } = courseMigrationState
    const { courseInstance } = props

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

    const new_errors = []

    for (let event of eventsToAdd) {
      newEvent(event).unwrap().catch(error => {
        new_errors.push(`There was a problem with server while posting ${event.name}`)
      })
    }
    setErrors(new_errors)
    if (new_errors.length > 0) {
      console.log(new_errors)
    }
  }

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
          <Button className="new-event-button" onClick={migrate}>
            Migrate
          </Button>
        </div>
      )}
    </div>
  )
}

const mapStateToProps = ({ courseInstanceReducer, courseMigrationReducer }) => {
  return {
    courseInstance: courseInstanceReducer.courseInstance,
    courseMigrationState: courseMigrationReducer,
  }
}

export default connect(mapStateToProps, { setCourseMigrationState })(Submit)
