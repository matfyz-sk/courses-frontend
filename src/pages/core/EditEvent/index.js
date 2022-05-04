import React from 'react'
import { Container, Card, CardHeader, CardBody, Alert } from 'reactstrap'
import EventForm from '../EventForm'
import { BASE_URL, EVENT_URL, INITIAL_EVENT_STATE } from '../constants'
import { axiosRequest, getData } from '../AxiosRequests'
import { getShortId } from '../Helper'
import { Redirect } from 'react-router-dom'
import { NOT_FOUND } from '../../../constants/routes'

class EditEvent extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      event: INITIAL_EVENT_STATE,
      redirect: null,
      courseId: '',
      loading: true,
    }
  }

  componentDidMount() {
    const {
      match: { params },
    } = this.props

    this.setState({
      courseId: params.course_id,
    })

    const url = `${BASE_URL + EVENT_URL}/${
      params.event_id
    }?_join=hasInstructor,uses,recommends,documentReference`
    axiosRequest('get', null, url).then(response => {
      const data = getData(response)
      this.setState({
        loading: false,
      })
      if (data != null) {
        const event = data.map(eventData => {
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

        this.setState({
          event,
        })

        if (
          event.courseInstance !== '' &&
          params.course_id !== getShortId(event.courseInstance)
        ) {
          this.setState({
            redirect: NOT_FOUND,
          })
        }
      } else {
        this.setState({
          redirect: NOT_FOUND,
        })
      }
    })
  }

  setRedirect = id => {
    const { courseId } = this.state
    if (id === null) {
      this.setState({
        redirect: `/courses/${courseId}/timeline`,
      })
    } else {
      this.setState({
        redirect: `/courses/${courseId}/event/${id}`,
      })
    }
  }

  render() {
    const { event, redirect, loading } = this.state

    if (redirect) {
      return <Redirect to={redirect} />
    }

    if (loading) {
      return (
        <Alert color="secondary" className="empty-message">
          Loading...
        </Alert>
      )
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
                callBack={this.setRedirect}
              />
            </CardBody>
          </Card>
        </Container>
      </div>
    )
  }
}

export default EditEvent
