import React from 'react'
import { Container, Card, CardHeader, CardBody } from 'reactstrap'
import EventForm from '../EventForm'
import { BASE_URL, EVENT_URL, INITIAL_EVENT_STATE, TOKEN } from '../constants'
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

    const url = `${BASE_URL + EVENT_URL}/${params.id}`
    axiosRequest('get', TOKEN, null, url).then(response => {
      const data = getData(response)
      if (data != null) {
        const event = data.map(eventData => {
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
            courseInstance: eventData.courseInstance[0]['@id'],
          }
        })[0]

        this.setState({
          event,
        })
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
              <EventForm typeOfForm="Edit" {...event} />
            </CardBody>
          </Card>
        </Container>
      </div>
    )
  }
}

export default EditEvent
