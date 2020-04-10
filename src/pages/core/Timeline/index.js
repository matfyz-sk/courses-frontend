import React, { Component } from 'react'
import { connect } from 'react-redux'
import { NavLink } from 'react-router-dom'
import { Container, Row, Col, Button, Alert } from 'reactstrap'
import EventsList, { BlockMenu } from '../Events'
import { NavigationCourse } from '../../../components/Navigation'
import { getDisplayDateTime } from '../Helper'
import NextCalendar from '../NextCalendar'
import * as ROUTES from '../../../constants/routes'
import './Timeline.css'
// import withAuthorization from "../../../components/Session/withAuthorization";

import { Events } from './timeline-data'
import { Courses } from '../Courses/courses-data'

import { setUserAdmin } from '../../../redux/actions'

class Timeline extends Component {
  constructor(props) {
    super(props)

    this.state = {
      loading: true,
      courseInstance: undefined,
      eventsSorted: [],
      timelineBlocks: [], // for timeline purposes even Session can be a block
      nestedEvents: [],
      courseAbbr: '',
    }

    this.getTimelineBlocks = this.getTimelineBlocks.bind(this)
    this.getNestedEvents = this.getNestedEvents.bind(this)
    this.greaterEqual = this.greaterEqual.bind(this)
    this.greater = this.greater.bind(this)
    this.sortEventsFunction = this.sortEventsFunction.bind(this)
    this.mergeMaterials = this.mergeMaterials.bind(this)
  }

  componentDidMount() {
    const {
      match: { params },
    } = this.props

    const courses = Courses
    let courseAbbr

    for (const i in courses) {
      const course = courses[i]
      if (`${course.id}` === params.id) {
        courseAbbr = course.abbreviation
      }
    }

    // TODO get all events where courseInstance.id = params
    const events = Events

    events.sort(this.sortEventsFunction)

    const timelineBlocks = this.getTimelineBlocks(events)
    const nestedEvents = this.getNestedEvents(events, timelineBlocks)

    this.setState({
      eventsSorted: events,
      timelineBlocks,
      nestedEvents,
      courseId: params.id,
      courseAbbr,
    })
  }

  sortEventsFunction(e1, e2) {
    if (new Date(e1.startDate) > new Date(e2.startDate)) {
      return 1
    }
    if (new Date(e1.startDate) < new Date(e2.startDate)) {
      return -1
    }

    if (e1.type > e2.type) {
      return 1
    }
    if (e1.type < e2.type) {
      return -1
    }
    return 0
  }

  getTimelineBlocks(events) {
    const timelineBlocks = []
    timelineBlocks.push(events[0])
    for (let i = 1; i < events.length; i++) {
      const event = events[i]
      const block = timelineBlocks[timelineBlocks.length - 1]
      if (
        event.type === 'block' ||
        new Date(event.startDate) >= new Date(block.endDate)
      ) {
        timelineBlocks.push(event)
      }
    }
    return timelineBlocks
  }

  getNestedEvents(events, timelineBlocks) {
    if (events.length === 0 || timelineBlocks === 0) {
      return timelineBlocks
    }
    for (const block of timelineBlocks) {
      if (block.type === 'Block') {
        block.sessions = []
        block.tasks = []
      }
      for (const event of events) {
        if (block.id !== event.id && event.type !== 'Block') {
          if (
            (event.type === 'Lecture' || event.type === 'Lab') &&
            ((this.greaterEqual(event.startDate, block.startDate) &&
              !this.greaterEqual(event.startDate, block.startDate)) ||
              (this.greater(event.endDate, block.startDate) &&
                !this.greater(event.endDate, block.endDate)))
          ) {
            event.displayDateTime = getDisplayDateTime(event.startDate, false)
            block.sessions.push(event)
            this.mergeMaterials(block.materials, event.materials)
          } else if (
            ((event.type === 'OralExam' || event.type === 'TestTake') &&
              this.greaterEqual(event.startDate, block.startDate) &&
              !this.greaterEqual(event.startDate, block.endDate)) ||
            (event.type === 'Task' &&
              this.greater(event.endDate, block.startDate) &&
              !this.greater(event.endDate, block.endDate))
          ) {
            if (event.type === 'OralExam' || event.type === 'TestTake') {
              event.displayDateTime = getDisplayDateTime(event.startDate, false)
            } else if (event.type === 'Task') {
              event.displayDateTime = getDisplayDateTime(event.endDate, false)
            }
            block.tasks.push(event)
            this.mergeMaterials(block.materials, event.materials)
          }
        }
      }
    }
    return timelineBlocks
  }

  mergeMaterials(arr1, arr2) {
    arr2.map(element1 => {
      if (
        arr1.find(element => {
          return element.id === element1.id
        }) == null
      ) {
        arr1.push(element1)
      }
    })
  }

  greaterEqual(dateTime1, dateTime2) {
    return new Date(dateTime1) >= new Date(dateTime2)
  }

  greater(dateTime1, dateTime2) {
    return new Date(dateTime1) > new Date(dateTime2)
  }

  render() {
    const { timelineBlocks, nestedEvents, courseAbbr, courseId } = this.state
    return (
      <div>
        <NavigationCourse courseAbbr={this.state.courseAbbr} />
        {this.state.eventsSorted.length === 0 ? (
          <Alert color="secondary" className="empty-message">
            Timeline for this course is empty.
            <br />
            {this.props.isAdmin && (
              <NavLink
                to={ROUTES.CREATE_TIMELINE + courseId}
                className="alert-link"
              >
                Create NEW TIMELINE{' '}
              </NavLink>
            )}
          </Alert>
        ) : (
          <Container className="core-container">
            <Row className="timeline-row">
              <Col xs="3" className="timeline-left-col">
                <BlockMenu courseEvents={timelineBlocks} />
                {this.props.isAdmin && ( // || myId===courseInstance.hasInstructor &&
                  <div className="button-container">
                    <NavLink to={`/createtimeline/${courseAbbr}`}>
                      <Button className="new-event-button">New Event</Button>
                    </NavLink>
                  </div>
                )}
                <NextCalendar />
              </Col>
              <Col className="event-list-col">
                <EventsList
                  courseEvents={nestedEvents}
                  isAdmin={this.props.isAdmin}
                />
              </Col>
            </Row>
          </Container>
        )}
      </div>
    )
  }
}

const mapStateToProps = ({ userReducer }) => {
  return {
    isSignedIn: userReducer.isSignedIn,
    isAdmin: userReducer.isAdmin,
  }
}

export default connect(mapStateToProps, { setUserAdmin })(Timeline)

// const condition = authUser => !!authUser;

// export default withAuthorization(condition)(Timeline);
