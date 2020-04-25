import React from 'react'
import { Container, Card, CardHeader, CardBody } from 'reactstrap'
import EventForm from '../EventForm'
import { BASE_URL, EVENT_URL, INITIAL_EVENT_STATE } from '../constants'
import { axiosRequest, getData } from '../AxiosRequests'
import { getShortId } from '../Helper'

class EditEvent extends React.Component {
  constructor(props) {
    super(props)
    this.state = { event: INITIAL_EVENT_STATE }
  }

  componentDidMount() {
    const {
      match: { params },
    } = this.props

    const url = `${BASE_URL + EVENT_URL}/${params.event_id}?_join=hasInstructor`
    axiosRequest('get', null, url).then(response => {
      const data = getData(response)
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
            courseInstance: eventData.courseInstance
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

        if (params.course_id !== getShortId(event.courseInstance)) {
          //TODO redirect different ids
        }
      } else {
        // TODO zle id
      }
    })
  }

  render() {
    const { event } = this.state
    return (
      <div>
        <Container>
          <Card>
            <CardHeader className="event-card-header">Edit Event</CardHeader>
            <CardBody>
              <EventForm typeOfForm="Edit" {...event} options={[event.type]} />
            </CardBody>
          </Card>
        </Container>
      </div>
    )
  }
}

export default EditEvent
