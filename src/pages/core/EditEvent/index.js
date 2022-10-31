import React from 'react'
import { Container, Card, CardHeader, CardBody, Alert } from 'reactstrap'
import EventForm from '../EventForm'
import { BASE_URL, EVENT_URL, INITIAL_EVENT_STATE } from '../constants'
import { axiosRequest, getData } from '../AxiosRequests'
import { getShortId } from '../Helper'
import { Redirect } from 'react-router-dom'
import { NOT_FOUND } from '../../../constants/routes'
import { useGetEventQuery } from 'services/event'

function EditEvent(props) {
  const { match: { params } } = props
  const { data, isSuccess, isLoading } = useGetEventQuery(params.event_id)
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
        id: getShortId(eventData['@id']),
        fullId: eventData['@id'],
        name: eventData.name,
        description: eventData.description ? eventData.description : '',
        startDate: new Date(eventData.startDate),
        endDate: new Date(eventData.endDate),
        place: eventData.location ? eventData.location : '',
        type:
          typeof eventData['@type'] === 'string'
            ? eventData['@type'].split('#')[1]
            : '',
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
          : '',
        instructors: eventData.hasInstructor
          ? eventData.hasInstructor.map(instructor => {
              return {
                fullId: instructor['@id'],
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

export default EditEvent
