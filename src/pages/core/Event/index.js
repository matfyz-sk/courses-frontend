import React, {useState} from 'react'
import {Alert, Container} from 'reactstrap'
import {connect} from 'react-redux'
import {Redirect} from 'react-router-dom'
import './Event.css'
import {
  getInstructorRights,
  getShortId,
  mergeMaterials,
} from '../Helper'
import { INITIAL_EVENT_STATE } from '../constants'
import { NOT_FOUND } from 'constants/routes'
import DocumentViewer from '../../documents/DocumentViewer'
import { EventCard } from './EventCard'
import { useGetEventByTypeQuery } from 'services/event'
import { useGetCourseInstanceQuery } from 'services/course'
import { getFullID } from 'helperFunctions'

function Event(props) {
  const {
    match: { params },
    user,
    courseInstance,
  } = props
  const isEvent = params.event_id.includes('-')
  const parsedEvent = params.event_id.split("-")
  const eventType = parsedEvent[0]
  const eventId = parsedEvent[1]
  const [redirectTo, setRedirectTo] = useState(null)
  const [viewingDocument, setViewingDocument] = useState(null)
  const { data, isSuccess, isLoading } = isEvent ?
    useGetEventByTypeQuery({id: getFullID(eventId, eventType), type: eventType}) :
    useGetCourseInstanceQuery({id: getFullID(params.event_id, "courseInstance")})
  const hasAccess = courseInstance && user && getInstructorRights(user, courseInstance)

  if (redirectTo) {
    return <Redirect to={redirectTo} />
  }

  if (isLoading) {
    return (
      <Alert color="secondary" className="empty-message">
        Loading...
      </Alert>
    )
  }

  let event = INITIAL_EVENT_STATE
  if(isSuccess && data && data.length > 0) {
    event = data.map(eventData => {
      return {
        id: getShortId(eventData['_id']),
        name: eventData.name,
        description: eventData.description,
        startDate: new Date(eventData.startDate.millis),
        endDate: new Date(eventData.endDate.millis),
        place: eventData.location,
        type: eventData['_type'].split('#')[1],
        uses: eventData.uses.map(material => {
          return {
            id: getShortId(material['_id']),
            fullId: material['_id'],
            name: material.name,
          }
        }),
        recommends: eventData.recommends.map(material => {
          return {
            id: getShortId(material['_id']),
            fullId: material['_id'],
            name: material.name,
          }
        }),
        documentReference: eventData.documentReference,
        courseInstance: eventData.courseInstance
          ? eventData.courseInstance['_id']
          : eventData['_id'],
        instructors: eventData.courseInstance
          ? eventData.courseInstance.hasInstructor
          : eventData.hasInstructor,
      }
    })[0]
    console.log(event)
    if (
      event.courseInstance !== '' &&
      params.course_id !== getShortId(event.courseInstance)
    ) {
      setRedirectTo(NOT_FOUND)
    }

    event.materials = mergeMaterials(event.uses, event.recommends)
  } else {
    //setRedirectTo(NOT_FOUND)
  }
  console.log(event)
  return (
    <div>
      {viewingDocument && (
          <div style={{maxWidth: 1300, padding: 10, margin: "auto"}}>
            <DocumentViewer
              document={viewingDocument}
              onViewingDocumentChange={document => setViewingDocument(document)}
            />
          </div>
        )}
      {!viewingDocument && <Container className="container-view">

        {event && (
          <EventCard
            onViewableDocumentClick={document => setViewingDocument(document)}
            event={event}
            isAdmin={hasAccess}
            detail
          />
        )}
      </Container>}
    </div>
  )
}

const mapStateToProps = ({ authReducer, courseInstanceReducer }) => {
  return {
    user: authReducer.user,
    courseInstance: courseInstanceReducer.courseInstance,
  }
}

export default connect(mapStateToProps)(Event)


