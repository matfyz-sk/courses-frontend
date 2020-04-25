import React from 'react'
import { Container, Card, CardHeader, CardBody } from 'reactstrap'
import EventForm from '../EventForm'
import { INITIAL_EVENT_STATE } from '../constants'

class NewCourseInstance extends React.Component {
  render() {
    return (
      <div>
        <Container>
          <Card>
            <CardHeader className="event-card-header">
              New Course Instance for Course "
              {this.props.location.state.courseName}"
            </CardHeader>
            <CardBody>
              <EventForm
                typeOfForm="New Course Instance"
                {...INITIAL_EVENT_STATE}
                options={['CourseInstance']}
              />
            </CardBody>
          </Card>
        </Container>
      </div>
    )
  }
}
export default NewCourseInstance
