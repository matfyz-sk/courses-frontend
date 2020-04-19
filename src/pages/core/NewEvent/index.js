import React from 'react'
import { Container, Card, CardHeader, CardBody } from 'reactstrap'
import EventForm from '../EventForm'
import { INITIAL_EVENT_STATE } from '../constants'

const NewEvent = () => (
  <div>
    <Container>
      <Card>
        <CardHeader className="event-card-header">New Event</CardHeader>
        <CardBody>
          <EventForm typeOfForm="Create" {...INITIAL_EVENT_STATE} options={["Block", "Lab", "Lecture"]} />
        </CardBody>
      </Card>
    </Container>
  </div>
)

export default NewEvent
