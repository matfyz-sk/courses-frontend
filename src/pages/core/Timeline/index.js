import React, { Component } from 'react'
import { connect } from 'react-redux'
import { NavLink } from 'react-router-dom'
import { Container, Row, Col, Button, Alert } from 'reactstrap'
import EventsList, { BlockMenu } from '../Events'
import { getDisplayDateTime, getShortId, mergeMaterials } from '../Helper'
import NextCalendar from '../NextCalendar'
import * as ROUTES from '../../../constants/routes'
import './Timeline.css'
// import withAuthorization from "../../../components/Session/withAuthorization";
import { BASE_URL, EVENT_URL, TOKEN, TASKS, SESSIONS } from '../constants'
import { axiosRequest, getData } from '../AxiosRequests'
import { redirect } from '../../../constants/redirect'


class Timeline extends Component {
  constructor(props) {
    super(props)

    this.state = {
      eventsSorted: [],
      timelineBlocks: [], // for timeline purposes even Session can be a block
      nestedEvents: [],
    }
  }

  componentDidMount() {
    const {
      match: { params },
    } = this.props

    const url = `${BASE_URL + EVENT_URL}?courseInstance=${
      params.course_id
    }&_join=courseInstance,uses,recommends`

    axiosRequest('get', TOKEN, null, url).then(response => {
      const data = getData(response)

      if (data != null && data !== []) {
        const events = data.map(eventData => {
          const event = {
            id: getShortId(eventData['@id']),
            fullId: eventData['@id'],
            type: eventData['@type'].split('#')[1],
            name: eventData.name,
            description: eventData.description,
            startDate: new Date(eventData.startDate),
            endDate: new Date(eventData.endDate),
            place: eventData.location,
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
            courseAbbr: eventData.courseInstance[0]
              ? eventData.courseInstance[0].abbreviation
              : '',
            courseInstance: eventData.courseInstance[0]['@id'],
          }
          event.materials = mergeMaterials(event.uses, event.recommends)
          return event
        })

        events.sort(this.sortEventsFunction)

        const timelineBlocks = this.getTimelineBlocks(events)
        const nestedEvents = this.getNestedEvents(events, timelineBlocks)

        this.setState({
          eventsSorted: events,
          timelineBlocks,
          nestedEvents,
        })
      }
    })
  }

  sortEventsFunction = (e1, e2) => {
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

  getTimelineBlocks = events => {
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

  getNestedEvents = (events, timelineBlocks) => {
    if (events.length === 0 || timelineBlocks === 0) {
      return timelineBlocks
    }
    for (const block of timelineBlocks) {
      if (block.type === 'Block') {
        block.sessions = []
        block.tasks = []

        for (const event of events) {
          if (block.id !== event.id && event.type !== 'Block') {
            if (
              SESSIONS.includes(event.type) &&
              ((this.greaterEqual(event.startDate, block.startDate) &&
                !this.greaterEqual(event.startDate, block.startDate)) ||
                (this.greater(event.endDate, block.startDate) &&
                  !this.greater(event.endDate, block.endDate)))
            ) {
              event.displayDateTime = getDisplayDateTime(event.startDate, false)
              block.sessions.push(event)
              block.materials = mergeMaterials(block.materials, event.materials)
            } else if (
              (TASKS.includes(event.type) &&
                this.greaterEqual(event.startDate, block.startDate) &&
                !this.greaterEqual(event.startDate, block.endDate)) ||
              (event.type === 'Task' &&
                this.greater(event.endDate, block.startDate) &&
                !this.greater(event.endDate, block.endDate))
            ) {
              if (event.type === 'OralExam' || event.type === 'TestTake') {
                event.displayDateTime = getDisplayDateTime(
                  event.startDate,
                  false
                )
              } else {
                event.displayDateTime = getDisplayDateTime(event.endDate, false)
              }
              block.tasks.push(event)
              block.materials = mergeMaterials(block.materials, event.materials)
            }
          }
        }
      }
    }
    return timelineBlocks
  }

  greaterEqual = (dateTime1, dateTime2) => {
    return new Date(dateTime1) >= new Date(dateTime2)
  }

  greater = (dateTime1, dateTime2) => {
    return new Date(dateTime1) > new Date(dateTime2)
  }

  render() {
    const { eventsSorted, timelineBlocks, nestedEvents } = this.state
    const { course, user } = this.props
    const courseId = course ? getShortId(course['@id']) : ''

    return (
      <>
        {eventsSorted.length === 0 ? (
          <Alert color="secondary" className="empty-message">
            Timeline for this course is empty.
            <br />
            {user && user.isSuperadmin && (
              <NavLink
                to={redirect(ROUTES.CREATE_TIMELINE, [
                  { key: 'course_id', value: courseId },
                ])}
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
                {user &&
                user.isSuperadmin && ( // TODO || myId===courseInstance.hasInstructor &&
                    <div className="button-container">
                      <NavLink to={`/createtimeline/${course.id}`}>
                        <Button className="new-event-button">New Event</Button>
                      </NavLink>
                    </div>
                  )}
                <NextCalendar />
              </Col>
              <Col className="event-list-col">
                <EventsList
                  courseEvents={nestedEvents}
                  isAdmin={user ? user.isSuperadmin : false}
                />
              </Col>
            </Row>
          </Container>
        )}
      </>
    )
  }
}

const mapStateToProps = ({ authReducer, courseInstanceReducer }) => {
  return {
    course: courseInstanceReducer.courseInstance,
    user: authReducer.user,
  }
}

export default connect(mapStateToProps)(Timeline)

// export default withAuthorization(condition)(Timeline);
