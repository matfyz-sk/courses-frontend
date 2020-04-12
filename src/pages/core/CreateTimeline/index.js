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
import { Courses } from '../Courses/courses-data'
import { fetchCourseInstance, setUserAdmin } from '../../../redux/actions'

const TOKEN =
  'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyVVJJIjoiaHR0cDovL3d3dy5jb3Vyc2VzLm1hdGZ5ei5zay9kYXRhL3VzZXIvcHQxb0siLCJlbWFpbCI6ImhhcnJ5LnBvdHRlckBnbWFpbC5jb20iLCJpYXQiOjE1ODQyMDA1ODN9.-V3OAviWMMQ_KaBvhDmETq38z1wCXnX9rkf1XbDDPwU'

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


const mapStateToProps = ({ userReducer, eventsReducer, coursesReducer }) => {
  return {
    isSignedIn: userReducer.isSignedIn,
    isAdmin: userReducer.isAdmin,
    events: eventsReducer.events,
    course: coursesReducer.course,
  }
}

export default connect(mapStateToProps, { setUserAdmin, fetchCourseInstance })(CreateTimeline)
