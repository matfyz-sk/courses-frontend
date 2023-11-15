import React, {useState} from 'react'
import { Container, Card, CardHeader, CardBody, Alert } from 'reactstrap'
import EventForm from '../EventForm'
import { INITIAL_EVENT_STATE } from '../constants'
import { getShortId } from '../Helper'
import { Redirect } from 'react-router-dom'
import { NOT_FOUND } from '../../../constants/routes'
import { useGetEventByTypeQuery } from 'services/event'
import { getFullID } from 'helperFunctions'
import { useGetCourseInstanceQuery } from 'services/course'

function EditEvent(props) {
  const { match: { params } } = props
  const isEvent = params.event_id.includes('-')
  const { data, isSuccess, isLoading } = isEvent ? 
    useGetEventByTypeQuery({id: getFullID(getId(params.event_id), getType(params.event_id)), type: getType(params.event_id)}) :
    useGetCourseInstanceQuery({id: getFullID(params.event_id, "courseInstance")})
                        
  const [redirectTo, setRedirectTo] = useState(null)

  const setRedirect = id => {
    if (id === null) {
      setRedirectTo(`/courses/${params.course_id}/timeline`)
    } else {
      setRedirectTo(`/courses/${params.course_id}/event/${id}`)
    }
  }

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
  if (isSuccess && data) {
    event = data.map(eventData => {
      return {
        id: getShortId(eventData['_id']),
        fullId: eventData['_id'],
        name: eventData.name,
        description: eventData.description ? eventData.description : '',
        startDate: new Date(eventData.startDate.millis),
        endDate: new Date(eventData.endDate.millis),
        place: eventData.location ? eventData.location : '',
        type:
          typeof eventData['_type'] === 'string'
            ? eventData['_type'].split('#')[1]
            : '',
        uses: eventData?.uses.map(material => {
          return {
            id: getShortId(material['_id']),
            fullId: material['_id'],
            name: material.name,
          }
        }),
        recommends: eventData?.recommends.map(material => {
          return {
            id: getShortId(material['_id']),
            fullId: material['_id'],
            name: material.name,
          }
        }),
        documentReference: eventData.documentReference,
        courseInstance: eventData.courseInstance
          ? eventData.courseInstance['_id']
          : '',
        instructors: eventData.hasInstructor
          ? eventData.hasInstructor.map(instructor => {
              return {
                fullId: instructor['_id'],
                name: `${instructor.firstName} ${instructor.lastName}`,
              }
            })
          : [],
      }
    })[0]
    if (event.courseInstance !== '' &&
        params.course_id !== getShortId(event.courseInstance)) {
      setRedirectTo(NOT_FOUND)
    }
  } else {
    setRedirectTo(NOT_FOUND)
  }
  

  return (
    <div>
      <Container className="container-view">
        <Card className="event-card">
          <CardHeader className="event-card-header">Edit Event</CardHeader>
          <CardBody className="form-cardbody">
            <EventForm
              typeOfForm="Edit"
              {...event}
              options={[event.type]}
              callBack={setRedirect}
            />
          </CardBody>
        </Card>
      </Container>
    </div>
  )
}

const getId = (typeWithId) => {
  const index = typeWithId.indexOf('-')
  return typeWithId.substring(index + 1)
}

const getType = (typeWithId) => {
  const index = typeWithId.indexOf('-')
  return typeWithId.substring(0, index)
}

export default EditEvent
