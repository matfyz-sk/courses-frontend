import React, { Component } from 'react'
import { connect } from 'react-redux'
import { NavLink } from 'react-router-dom'
import { Container, Row, Col, Alert } from 'reactstrap'
import Scroll from 'react-scroll'
import EventsList, { BlockMenu, BlockMenuToggle } from '../Events'
import { getInstructorRights, getShortId } from '../Helper'
import {
  getEvents,
  sortEventsFunction,
  getTimelineBlocks,
  getNestedEvents,
  getCurrentBlock,
} from './timeline-helper'
// import NextCalendar from '../NextCalendar'
import * as ROUTES from '../../../constants/routes'
import './Timeline.css'
import { BASE_URL, EVENT_URL } from '../constants'
import { axiosRequest, getData } from '../AxiosRequests'
import { redirect } from '../../../constants/redirect'
// import TeacherNavigation from '../../../components/Navigation/TeacherNavigation'
import DocumentViewer from 'pages/documents/common/DocumentViewer'

const { scroller } = Scroll

class Timeline extends Component {
  constructor(props) {
    super(props)

    this.state = {
      eventsSorted: [],
      timelineBlocks: [], // for timeline purposes even Session can be a block
      nestedEvents: [],
      currentBlock: null,
      hasAccess: false,
      loading: true,
      viewingDocument: null,
      scrollToBlock: null
    }

    this.onLinkClickAdditionalAction = this.onLinkClickAdditionalAction.bind(this)
    this.onViewingDocumentChange = this.onViewingDocumentChange.bind(this)
  }

  componentDidMount() {
    const {
      match: { params },
    } = this.props
    const { course, user } = this.props

    if (course && user && getInstructorRights(user, course)) {
      this.setState({
        hasAccess: true,
      })
    }

    const url = `${BASE_URL + EVENT_URL}?courseInstance=${
      params.course_id
    }&_join=courseInstance,uses,recommends,documentReference`

    axiosRequest('get', null, url).then(response => {
      const data = getData(response)
      this.setState({
        loading: false,
      })
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
            duration: 500,
            // delay: 100,
            smooth: true,
            containerId: 'containerElement',
          })
        }
      }
    })
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    const { user, course } = this.props
    if (prevProps.user !== user || prevProps.course !== course) {
      if (course && user && getInstructorRights(user, course)) {
        this.setState({
          hasAccess: true,
        })
      }
    }
    const { scrollToBlock, viewingDocument } = this.state
  
    if (prevState.scrollToBlock == null && prevState.scrollToBlock !== scrollToBlock) {
      scroller.scrollTo(scrollToBlock, {
        duration: 500,
        delay: 50,
        smooth: true,
        containerId: 'containerElement',
      })
      this.setState({
        scrollToBlock: null
      })
    }
  }

  onLinkClickAdditionalAction(id) {
    if (this.state.viewingDocument) {
      this.setState({
        scrollToBlock: id,
      })
    }
    this.setState({
      viewingDocument: null,
    })
  }

  onViewingDocumentChange(document) {
    this.setState({
      viewingDocument: document
    })
  }

  render() {
    const {
      eventsSorted,
      timelineBlocks,
      nestedEvents,
      hasAccess,
      loading,
      viewingDocument
    } = this.state
    const { course } = this.props
    const courseId = course ? getShortId(course['@id']) : ''

    if (loading) {
      return (
        <Alert color="secondary" className="empty-message">
          Loading...
        </Alert>
      )
    }
    return (
      <>
        {/* eslint-disable-next-line no-nested-ternary */}
        {eventsSorted.length === 0 ? (
          <Alert color="secondary" className="empty-message">
            Timeline for this course is empty.
            <br />
            {hasAccess && (
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
                <BlockMenu
                  onLinkClickAdditionalAction={this.onLinkClickAdditionalAction}
                  courseEvents={timelineBlocks}
                />
                {/*<BlockMenuToggle courseEvents={timelineBlocks} scroll />*/}
                {/*{hasAccess &&*/}
                {/*    <div className="button-container">*/}
                {/*      <NavLink*/}
                {/*        to={redirect(ROUTES.CREATE_TIMELINE, [*/}
                {/*          { key: 'course_id', value: courseId },*/}
                {/*        ])}*/}
                {/*      >*/}
                {/*        <Button className="new-session-button">*/}
                {/*          Edit Timeline*/}
                {/*        </Button>*/}
                {/*      </NavLink>*/}
                {/*    </div>*/}
                {/*  )}*/}
                {/*/!*<NextCalendar />*!/*/}
              </Col>
              <Col className="event-list-col">
                {viewingDocument && (
                  <div className="events-list">
                    <DocumentViewer
                      document={viewingDocument}
                      onViewingDocumentChange={this.onViewingDocumentChange}
                    />
                  </div>
                )}
                <div style={{ display: viewingDocument ? 'none' : 'block' }}>
                  <EventsList
                    courseEvents={nestedEvents}
                    isAdmin={hasAccess}
                    onViewableDocumentClick={this.onViewingDocumentChange}
                  />
                </div>
              </Col>
              {/*<TeacherNavigation currentKey={1} href_array={adminMenuRoutes} />*/}
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
