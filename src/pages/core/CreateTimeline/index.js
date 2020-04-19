import React from 'react'
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Container,
  Row,
  Col,
  CardSubtitle,
} from 'reactstrap'
import { connect } from 'react-redux'
import EventForm from '../EventForm'
import { BlockMenu, SubEventList } from '../Events'
import ModalCreateEvent from '../ModalCreateEvent'

class CreateTimeline extends React.Component {
  constructor(props) {
    super(props)
  }

  componentDidMount() {
    // const {
    //   match: { params },
    // } = this.props
    //
    // const { course } = this.props
    //
  }

  render() {
    const { course } = this.props
    return (
      <div>
        <Container className="core-container">
          <Row>
            <Col xs="3">
              <BlockMenu courseEvents={[]} />
            </Col>
            <Col>
              <NewEventTimelineCard />
            </Col>
          </Row>
        </Container>
      </div>
    )
  }
}

const NewEventTimelineCard = () => (
  <Card>
    <CardHeader className="event-card-header">New Event</CardHeader>
    <CardBody>
      <EventForm
        typeOfForm="Create"
        type="Block"
        options={['Lab', 'Lecture', 'Block']}
      />
      <Container className="sessions-tasks-container">
        <Row>
          <Col className="subevents-col-left">
            <CardSubtitle className="subevents-title">Sessions</CardSubtitle>
            <SubEventList events={[]} />
          </Col>
          <Col className="subevents-col-right">
            <CardSubtitle className="subevents-title">Tasks</CardSubtitle>
            <SubEventList events={[]} />
          </Col>
        </Row>
        <Row>
          <Col>
            <div className="button-container">
              <ModalCreateEvent from={''} to={''} />
            </div>
          </Col>
          <Col>
            <div className="button-container">
              <Button className="new-event-button">Add Task</Button>
            </div>
          </Col>
        </Row>
      </Container>
      <CardSubtitle className="subevents-title">Materials</CardSubtitle>
      <Card body className="materials-card">
        <CardBody> </CardBody>
        {/*<ListOfMaterials/>*/}
      </Card>
      <div className="button-container">
        <Button className="new-event-button">Add Material</Button>
      </div>
    </CardBody>
  </Card>
)

const mapStateToProps = ({ authReducer, courseInstanceReducer }) => {
  return {
    user: authReducer.user,
    course: courseInstanceReducer.courseInstance,
  }
}

export default connect(mapStateToProps)(CreateTimeline)
