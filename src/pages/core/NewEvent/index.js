import React from 'react'
import { Container, Card, CardHeader, CardBody } from 'reactstrap'
import { NavigationCourse } from '../../../components/Navigation'
import EventForm from '../EventForm'
import { INITIAL_EVENT_STATE } from '../constants'

const NewEvent = () => (
  <div>
    <NavigationCourse />
    <Container>
      <Card>
        <CardHeader className="event-card-header">New Event</CardHeader>
        <CardBody>
          <EventForm typeOfForm="Create" {...INITIAL_EVENT_STATE} />
        </CardBody>
      </Card>
    </Container>
  </div>
)

export default NewEvent
