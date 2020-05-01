import React, { Component } from 'react'
import { connect } from 'react-redux'
import { NavLink } from 'react-router-dom'
import { Container, Row, Col, Button, Alert } from 'reactstrap'
import EventsList, { BlockMenu } from '../Events'
import { getShortId } from '../Helper'
import {
  getEvents,
  sortEventsFunction,
  getTimelineBlocks,
  getNestedEvents, getCurrentBlock,
} from './timeline-helper'
// import NextCalendar from '../NextCalendar'
import * as ROUTES from '../../../constants/routes'
import './Timeline.css'
// import withAuthorization from "../../../components/Session/withAuthorization";
import { BASE_URL, EVENT_URL } from '../constants'
import { axiosRequest, getData } from '../AxiosRequests'
import { redirect } from '../../../constants/redirect'
import Scroll from 'react-scroll'
const scroller = Scroll.scroller

class Timeline extends Component {
  constructor(props) {
    super(props)

    this.state = {
      eventsSorted: [],
      timelineBlocks: [], // for timeline purposes even Session can be a block
      nestedEvents: [],
      currentBlock: null,
    }
  }

  componentDidMount() {
    const {
      match: { params },
    } = this.props

    const url = `${BASE_URL + EVENT_URL}?courseInstance=${
      params.course_id
    }&_join=courseInstance,uses,recommends`

    axiosRequest('get', null, url).then(response => {
      const data = getData(response)
      if (data != null && data !== []) {
        const events = getEvents(data).sort(sortEventsFunction)

        const timelineBlocks = getTimelineBlocks(events)
        const nestedEvents = getNestedEvents(events, timelineBlocks)

        this.setState({
          eventsSorted: events,
          timelineBlocks,
          nestedEvents,
        })


        const currentBlock = getCurrentBlock(timelineBlocks)

        if (currentBlock) {
          scroller.scrollTo(currentBlock, {
            duration: 1500,
            delay: 100,
            smooth: true,
            containerId: 'containerElement',
          })
        }
      }
    })
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
            {user && user.isSuperAdmin && (
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
                user.isSuperAdmin && ( // TODO || myId===courseInstance.hasInstructor &&
                    <div className="button-container">
                      <NavLink
                        to={redirect(ROUTES.CREATE_TIMELINE, [
                          { key: 'course_id', value: courseId },
                        ])}
                      >
                        <Button className="new-event-button">
                          Edit Timeline
                        </Button>
                      </NavLink>
                    </div>
                  )}
                {/*<NextCalendar />*/}
              </Col>
              <Col className="event-list-col">
                <EventsList
                  courseEvents={nestedEvents}
                  isAdmin={user ? user.isSuperAdmin : false}
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
