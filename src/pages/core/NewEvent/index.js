import React from 'react'
import { Container, Card, CardHeader, CardBody } from 'reactstrap'
import EventForm from '../EventForm'
import { INITIAL_EVENT_STATE } from '../constants'
import { Redirect } from 'react-router-dom'

class NewEvent extends React.Component {
  constructor(props) {
    super(props)
    this.state = { redirect: null, courseId: '' }
  }

  componentDidMount() {
    const {
      match: { params },
    } = this.props

    this.setState({
      courseId: params.course_id,
    })
  }

  setRedirect = id => {
    const { courseId } = this.state

    this.setState({
      redirect: `/courses/${courseId}/event/${id}`,
    })
  }

  render() {
    const { redirect } = this.state

    if (redirect) {
      return <Redirect to={redirect} />
    }

    return (
      <div>
        <Container className="container-view">
          <Card>
            <CardHeader className="event-card-header">New Event</CardHeader>
            <CardBody className="form-cardbody">
              <EventForm
                typeOfForm="Create"
                {...INITIAL_EVENT_STATE}
                options={['Block', 'Lab', 'Lecture']}
                callBack={this.setRedirect}
              />
            </CardBody>
          </Card>
        </Container>
      </div>
    )
  }
}

export default NewEvent
