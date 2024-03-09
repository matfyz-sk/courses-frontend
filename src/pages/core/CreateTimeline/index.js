import React, { useState } from 'react'
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Container,
  Row,
  Col,
  ListGroup,
  ListGroupItem,
  Alert,
} from 'reactstrap'
import { connect } from 'react-redux'
import EventForm from '../EventForm'
import {
  INITIAL_EVENT_STATE,
} from '../constants'
import {
  getEvents,
  getNestedEvents,
  getTimelineBlocks,
  sortEventsFunction,
  addDays,
} from '../Timeline/timeline-helper'
import { BlockMenuToggle } from '../Events'
import { useNewTimelineBlockMutation, useGetTimelineEventsQuery } from 'services/event'
import { getFullID } from 'helperFunctions'


function CreateTimeline(props) {
  const {
    match: { params },
  } = props
  const courseId = params.course_id
  const [event, setEvent] = useState(null)
  const [saved, setSaved] = useState(false)
  const [disabled, setDisabled] = useState(false)
  const { data: eventsData, isLoading } = useGetTimelineEventsQuery(
    { courseInstanceId: getFullID(courseId, 'courseInstance') },
    { skip: !courseId }
  )
  const [newTimelineBlock, result] = useNewTimelineBlockMutation()
  const dataArray = Object.values(eventsData ?? {})
  let [events, timelineBlocks, nestedEvents] = [[],[],[]]
  if (dataArray.length > 0) {
    events = getEvents(dataArray).sort(sortEventsFunction)
    timelineBlocks = getTimelineBlocks(events)
    nestedEvents = getNestedEvents(events, timelineBlocks)
  }

  const postWeeklyBlocks = () => {
    setDisabled(true)
    const { course } = props
    const errors = []
    if (course) {
      const blocks = generateWeeklyBlocks(course)

      for (let i = 0; i < blocks.length; i++) {
        const block = blocks[i]
        block.courseInstance = course['_id']
        newTimelineBlock({...block}).unwrap().catch(error => {
          console.log(error)
          errors.push(`There was a problem with server while posting ${block.name}`)
        })
      }
      if (errors.length > 0) {
        errors.log(errors)
      }
    }
  }

  const onBlockMenuClick = eventId => {
    if (eventId != null) {
      setEvent(nestedEvents.filter(e => e.id === eventId)[0])
    } else {
      setEvent(null)
    }
    setSaved(false)
  }

  const setSavedAlert = id => {
    if (id === null) {
      setEvent(null)
    } else {
      setSaved(true)
    }
  }

  if (isLoading) {
    return (
      <Alert color="secondary" className="empty-message">
        Loading...
      </Alert>
    )
  }

  return (
    <div>
      <Container className="core-container">
        <Row className="timeline-row">
          <Col xs="3" className="create-timeline-left-col">
            <BlockMenu
              courseEvents={timelineBlocks}
              onClick={onBlockMenuClick}
              activeEvent={event}
            />
            <BlockMenuToggle
              courseEvents={timelineBlocks}
              onClick={onBlockMenuClick}
              activeEvent={event}
              scroll={false}
            />
            {timelineBlocks.length === 0 && (
              <Button
                className="timeline-block-button"
                disabled={disabled}
                onClick={postWeeklyBlocks}
              >
                {disabled ? 'Generatating...' : 'Generate Weekly Blocks'}
              </Button>
            )}
            <Button
              className="timeline-block-button"
              onClick={() => onBlockMenuClick(null)}
            >
              New Block
            </Button>
          </Col>
          <Col>
            {saved && (
              <Alert color="secondary">Event saved successfully!</Alert>
            )}
            <Card className="event-card">
              <CardHeader className="event-card-header">
                {event ? 'Edit Block' : 'New Event'}
              </CardHeader>
              <CardBody>
                {event ? (
                  <EventForm
                    typeOfForm="Edit"
                    {...event}
                    options={[event.type]}
                    callBack={setSavedAlert}
                  />
                ) : (
                  <EventForm
                    typeOfForm="Create"
                    {...INITIAL_EVENT_STATE}
                    options={[
                      'Block',
                      'Lab',
                      'Lecture',
                      'OralExam',
                      'TestTake',
                    ]}
                    callBack={setSavedAlert}
                  />
                )}
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  )
} 

const BlockMenu = ({ courseEvents, onClick, activeEvent }) => (
  <ListGroup className="block-menu block-menu-non-toggle">
    <ListGroupItem className="timeline block-menu-item">Timeline</ListGroupItem>
    {courseEvents.map(event => (
      <ListGroupItem
        id={event.id}
        key={event.id}
        className={
          activeEvent && event.id === activeEvent.id
            ? 'block-menu-item block-menu-item-active'
            : 'block-menu-item'
        }
        onClick={e => onClick(e.target.id)}
      >
        {event.name}
      </ListGroupItem>
    ))}
  </ListGroup>
)

const generateWeeklyBlocks = (course) => {
  const blocks = []

  if (course) {
    const courseStartDate = new Date(course.startDate.millis)
    const courseEndDate = new Date(course.endDate.millis)

    let startDate = nextDay(courseStartDate, 1)
    let endDate = addDays(startDate, 7)

    let i = 1
    if (startDate > courseStartDate) {
      const block = {
        name: `Week ${i}`,
        description: '...',
        startDate: courseStartDate,
        endDate: startDate,
      }
      blocks.push(block)
      i++
    }

    while (endDate < courseEndDate) {
      const block = {
        name: `Week ${i}`,
        description: '...',
        startDate,
        endDate,
      }
      blocks.push(block)
      startDate = endDate
      endDate = addDays(startDate, 7)
      i++
    }

    if (endDate > courseEndDate) {
      const block = {
        name: `Week ${i}`,
        description: '...',
        startDate,
        endDate: courseEndDate,
      }
      blocks.push(block)
    }
  }
  return blocks
}

const nextDay = (d, dow) => {
  d.setDate(d.getDate() + ((dow + (7 - d.getDay())) % 7))
  return d
}

const mapStateToProps = ({ authReducer, courseInstanceReducer }) => {
  return {
    user: authReducer.user,
    course: courseInstanceReducer.courseInstance,
  }
}

export default connect(mapStateToProps)(CreateTimeline)
