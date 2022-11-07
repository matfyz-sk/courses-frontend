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
import { useGetEventCourseInstanceQuery } from 'services/event'

function Event(props) {
  const {
    match: { params },
    user,
    courseInstance,
  } = props
  const [redirectTo, setRedirectTo] = useState(null)
  const [viewingDocument, setViewingDocument] = useState(null)
  const {data, isSuccess, isLoading} = useGetEventCourseInstanceQuery(params.event_id)
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
  if(isSuccess && data && data !== []) {
    event = data.map(eventData => {
      return {
        id: getShortId(eventData['@id']),
        name: eventData.name,
        description: eventData.description,
        startDate: new Date(eventData.startDate),
        endDate: new Date(eventData.endDate),
        place: eventData.location,
        type: eventData['@type'].split('#')[1],
        uses: eventData.uses.map(material => {
          return {
            id: getShortId(material['@id']),
            fullId: material['@id'],
            name: material.name,
          }
        }),
        recommends: eventData.recommends.map(material => {
          return {
            id: getShortId(material['@id']),
            fullId: material['@id'],
            name: material.name,
          }
        }),
        documentReference: eventData.documentReference,
        courseInstance: eventData.courseInstance[0]
          ? eventData.courseInstance[0]['@id']
          : eventData['@id'],
        instructors: eventData.courseInstance[0]
          ? eventData.courseInstance[0].hasInstructor
          : eventData.hasInstructor,
      }
    })[0]
    
    if (
      event.courseInstance !== '' &&
      params.course_id !== getShortId(event.courseInstance)
    ) {
      setRedirectTo(NOT_FOUND)
    }

    event.materials = mergeMaterials(event.uses, event.recommends)
  } else {
    setRedirectTo(NOT_FOUND)
  }

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


