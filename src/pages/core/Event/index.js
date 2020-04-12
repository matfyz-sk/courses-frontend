import React from 'react'
import {
  Container,
  Row,
  Col,
  Card,
  CardSubtitle,
  CardHeader,
  CardBody,
  CardText,
  ListGroup,
  ListGroupItem,
  Button,
  Table,
} from 'reactstrap'
import { connect } from 'react-redux'
import { NavLink } from 'react-router-dom'

import { NavigationCourse } from '../../../components/Navigation'
import './Event.css'
// import NextCalendar from '../NextCalendar'
import { setUserAdmin, fetchCourseInstance } from '../../../redux/actions'
import { SubEventList } from '../Events'
import { getDisplayDateTime, getIcon, mergeMaterials } from '../Helper'

const TOKEN =
  'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyVVJJIjoiaHR0cDovL3d3dy5jb3Vyc2VzLm1hdGZ5ei5zay9kYXRhL3VzZXIvcHQxb0siLCJlbWFpbCI6ImhhcnJ5LnBvdHRlckBnbWFpbC5jb20iLCJpYXQiOjE1ODQyMDA1ODN9.-V3OAviWMMQ_KaBvhDmETq38z1wCXnX9rkf1XbDDPwU'

class Event extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      event: undefined,
      course: {},
    }
  }

  componentDidMount() {
    const {
      match: { params },
    } = this.props


  }

  render() {
    const { event, course } = this.state
    const { isAdmin } = this.props
    return (
      <div>
        <NavigationCourse courseAbbr={course.abbreviation}/>
        <Container>
          {/*// className="core-container">*/}
          {/*<Row>*/}
          {/*    <Col xs="3">*/}
          {/*        <NextCalendar/>*/}
          {/*    </Col>*/}
          {/*    <Col>*/}
          {event && <EventCard event={event} isAdmin={isAdmin} />}
          {/*    </Col>*/}
          {/*</Row>*/}
        </Container>
      </div>
    )
  }
}

const EventCard = ({ event, isAdmin }) => (
  <Card id={`${event.id}`} name={`${event.id}`} className="event-card">
    <CardHeader className="event-card-header">
      <NavLink to={`/event/${event.id}`} className="subevent-name">
        {event.name}
      </NavLink>
      {isAdmin && (
        <NavLink to={`/editevent/${event.id}`}>
          <Button className="edit-button"> Edit</Button>
        </NavLink>
      )}
    </CardHeader>
    <CardBody>
      <CardText className="event-card-text">{event.description}</CardText>
      <Table borderless className="event-table">
        <tbody>
          <tr>
            <th>Start</th>
            <td>{getDisplayDateTime(event.startDate, true)}</td>
            <th>End</th>
            <td>{getDisplayDateTime(event.endDate, true)}</td>
          </tr>
          {/*{event.location &&*/}
          {/*<tr>*/}
          {/*    <th>Location</th><td colSpan="3">{event.location}</td>*/}
          {/*</tr>*/}
          {/*}*/}
        </tbody>
      </Table>
      {event.type === 'Block' && (
        <Container className="sessions-tasks-container core-container">
          <Row>
            <Col className="subevents-col-left">
              <CardSubtitle className="subevents-title">Sessions</CardSubtitle>
              <SubEventList events={event.sessions} />
            </Col>
            <Col className="subevents-col-right">
              <CardSubtitle className="subevents-title">Tasks</CardSubtitle>
              <SubEventList events={event.tasks} />
            </Col>
          </Row>
        </Container>
      )}
      {event.materials && event.materials.length > 0 && (
        <>
          <CardSubtitle className="event-card-subtitle">Materials</CardSubtitle>
          <ListGroup key={event.id}>
            {event.materials.map(material => (
              <ListGroupItem
                key={material.id}
                className="event-list-group-item"
              >
                {getIcon('Material')}
                <div className="material-name">{material.name}</div>
              </ListGroupItem>
            ))}
          </ListGroup>
        </>
      )}
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

export default connect(mapStateToProps, { setUserAdmin })(Event)

export { EventCard }
