import React, { useState } from 'react'
import { connect } from 'react-redux'
import { NavLink } from 'react-router-dom'
import { Container, Row, Col, Alert } from 'reactstrap'
import Scroll from 'react-scroll'
import EventsList, { BlockMenu } from '../Events'
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
import { redirect } from '../../../constants/redirect'
// import TeacherNavigation from '../../../components/Navigation/TeacherNavigation'
import DocumentViewer from '../../documents/DocumentViewer'
import { useGetEventQuery } from 'services/event'

const { scroller } = Scroll

function Timeline(props) {
  const { 
    match: { params },
    user, 
    course 
  } = props
  const courseId = course ? getShortId(course['_id']) : ''
  const [viewingDocument, setViewingDocument] = useState(null)
  const [scrollToBlock, setScrollToBlock] = useState(null)
  const {data, isSuccess, isLoading} = useGetEventQuery({courseInstanceId: params.course_id})
  const hasAccess = course && user && getInstructorRights(user, course)

  if (scrollToBlock) {
    scroller.scrollTo(scrollToBlock, { 
      duration: 500,
      delay: 50,
      smooth: true,
      containerId: 'containerElement',
    })
    setScrollToBlock(null)
  }

  const onLinkClickAdditionalAction = id => {
    if (viewingDocument) {
      setScrollToBlock(id)
    }
    setViewingDocument(null)
  }

  if (isLoading) {
    return (
      <Alert color="secondary" className="empty-message">
        Loading...
      </Alert>
    )
  }

  let eventsSorted = []
  let timelineBlocks = []
  let nestedEvents = []
  console.log(data)
  if (isSuccess && data && data.length > 0) {
    eventsSorted = getEvents(data).sort(sortEventsFunction)
    timelineBlocks = getTimelineBlocks(eventsSorted)
    nestedEvents = getNestedEvents(eventsSorted, timelineBlocks)
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
                onLinkClickAdditionalAction={onLinkClickAdditionalAction}
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
                    onViewingDocumentChange={document => setViewingDocument(document)}
                  />
                </div>
              )}
              <div style={{ display: viewingDocument ? 'none' : 'block' }}>
                <EventsList
                  courseEvents={nestedEvents}
                  isAdmin={hasAccess}
                  onViewableDocumentClick={document => setViewingDocument(document)}
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

const mapStateToProps = ({ authReducer, courseInstanceReducer }) => {
  return {
    course: courseInstanceReducer.courseInstance,
    user: authReducer.user,
  }
}

export default connect(mapStateToProps)(Timeline)
