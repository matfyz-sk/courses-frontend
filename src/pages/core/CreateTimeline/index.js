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
import { NavigationCourse } from '../../../components/Navigation'
import EventForm from '../EventForm'
import { BlockMenu, SubEventList } from '../Events'
import ModalCreateEvent from '../ModalCreateEvent'
import { fetchCourseInstance, setUserAdmin } from '../../../redux/actions'
import { TOKEN } from '../constants'

class CreateTimeline extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      course: {},
    }
  }

  componentDidMount() {
    const {
      match: { params },
    } = this.props

    this.props.fetchCourseInstance(TOKEN, params.id).then(() => {
      const { course } = this.props

      this.setState({
        course,
      })
    })
  }

  render() {
    const { course } = this.state
    return (
      <div>
        <NavigationCourse courseAbbr={course.abbreviation} />
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
      <EventForm typeOfForm="Create" type="Block" />
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


const mapStateToProps = ({ userReducer, coursesReducer }) => {
  return {
    isSignedIn: userReducer.isSignedIn,
    isAdmin: userReducer.isAdmin,
    course: coursesReducer.course,
  }
}

export default connect(mapStateToProps, { setUserAdmin, fetchCourseInstance })(CreateTimeline)
