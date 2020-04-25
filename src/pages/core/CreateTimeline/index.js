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
  ListGroup,
  ListGroupItem,
} from 'reactstrap'
import { connect } from 'react-redux'
import EventForm from '../EventForm'
import { SubEventList } from '../Events'
import ModalCreateEvent from '../ModalCreateEvent'
import {
  BASE_URL,
  EVENT_URL,
  INITIAL_EVENT_STATE,
} from '../constants'
import { axiosRequest, getData } from '../AxiosRequests'
import {
  getCourseInstances,
  getNestedEvents,
  getTimelineBlocks,
  sortEventsFunction,
} from '../Timeline/timeline-helper'

class CreateTimeline extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      event: null,
      timelineBlocks: [],
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

    axiosRequest('get', null, url).then(response => {
      const data = getData(response)
      if (data != null && data !== []) {
        const events = getCourseInstances(data).sort(sortEventsFunction)

        const timelineBlocks = getTimelineBlocks(events)
        const nestedEvents = getNestedEvents(events, timelineBlocks)

        this.setState({
          timelineBlocks,
          nestedEvents,
        })
      }
    })
  }

  generateWeeklyBlocks = () => {
    const { course } = this.props
    const blocks = []

    const courseStartDate = new Date(course.startDate)
    const courseEndDate = new Date(course.endDate)

    let startDate = this.nextDay(courseStartDate, 1)
    let endDate = startDate + 7

    let i = 1
    if (startDate > courseStartDate) {
      const block = {
        name: `Week ${i}`,
        desc: '...',
        startDate: courseStartDate,
        endDate: startDate,
      }
      blocks.push(block)
      i++
    }

    while (endDate < courseEndDate) {
      const block = {
        name: `Week ${i}`,
        desc: '...',
        startDate,
        endDate,
      }
      blocks.push(block)
      startDate = endDate
      endDate += 7
      i++
    }

    if (endDate > courseEndDate) {
      const block = {
        name: `Week ${i}`,
        desc: '...',
        startDate,
        endDate: courseEndDate,
      }
      blocks.push(block)
    }

    return blocks
  }

  postWeeklyBlocks = () => {
    const { course } = this.props
    let errors = []

    if (course) {
      const blocks = this.generateWeeklyBlocks()
      for (const block of blocks) {
        block.courseInstance = course.id

        // const url = BASE_URL + BLOCK_URL
        // axiosRequest('post', JSON.stringify(block), url)
        //   .then(response => {
        //     if (response && response.status === 200) {
        //     } else {
        //       errors.push(
        //         `There was a problem with server while posting ${block.name}`
        //       )
        //     }
        //   })
        //   .catch()
      }
      if (errors.length > 0) {
        //TODO nepodarilo sa vygenerovat vsetky bloky
      }
    }
  }

  nextDay = (d, dow) => {
    d.setDate(d.getDate() + ((dow + (7 - d.getDay())) % 7))
    return d
  }

  onBlockMenuClick = eventId => {
    const { nestedEvents } = this.state
    let event

    if (eventId != null) {
      event = nestedEvents.filter(e => e.id === eventId)[0]
    } else {
      event = null
    }
    this.setState({
      event,
    })
  }

  render() {
    const { timelineBlocks, event } = this.state

    return (
      <div>
        <Container className="core-container">
          <Row>
            <Col xs="3">
              <BlockMenu
                courseEvents={timelineBlocks}
                onClick={this.onBlockMenuClick}
              />
              <Button onClick={() => this.onBlockMenuClick(null)}>New Block</Button>
            </Col>
            <Col>
              <BlockEventTimelineCard event={event} />
            </Col>
          </Row>
        </Container>
      </div>
    )
  }
}

const BlockMenu = ({ courseEvents, onClick }) => (
  <ListGroup className="block-menu">
    <ListGroupItem className="timeline block-menu-item">Timeline</ListGroupItem>
    {courseEvents.map(event => (
      <ListGroupItem
        id={event.id}
        key={event.id}
        className="block-menu-item"
        onClick={e => onClick(e.target.id)}
      >
        {event.name}
      </ListGroupItem>
    ))}
  </ListGroup>
)

const BlockEventTimelineCard = event => {
  // if (event) { console.log(event.event) } else { console.log('null') }

  return (
    <Card>
      <CardHeader className="event-card-header">New Event</CardHeader>
      <CardBody>
        {event.event ? (
          <EventForm
            typeOfForm="Edit"
            {...event.event}
            options={[event.type]}
          />
        ) : (
          <EventForm
            typeOfForm="Create"
            {...INITIAL_EVENT_STATE}
            options={['Block', 'Lab', 'Lecture']}
          />
        )}

        {/*  <Container className="sessions-tasks-container">*/}
        {/*    <Row>*/}
        {/*      <Col className="subevents-col-left">*/}
        {/*        <CardSubtitle className="subevents-title">Sessions</CardSubtitle>*/}
        {/*        <SubEventList events={[]} />*/}
        {/*      </Col>*/}
        {/*      <Col className="subevents-col-right">*/}
        {/*        <CardSubtitle className="subevents-title">Tasks</CardSubtitle>*/}
        {/*        <SubEventList events={[]} />*/}
        {/*      </Col>*/}
        {/*    </Row>*/}
        {/*    <Row>*/}
        {/*      <Col>*/}
        {/*        <div className="button-container">*/}
        {/*          <ModalCreateEvent from="" to="" />*/}
        {/*        </div>*/}
        {/*      </Col>*/}
        {/*      <Col>*/}
        {/*        <div className="button-container">*/}
        {/*          <Button className="new-event-button">Add Task</Button>*/}
        {/*        </div>*/}
        {/*      </Col>*/}
        {/*    </Row>*/}
        {/*  </Container>*/}
        {/*  <CardSubtitle className="subevents-title">Materials</CardSubtitle>*/}
        {/*  <Card body className="materials-card">*/}
        {/*    <CardBody> </CardBody>*/}
        {/*    /!*<ListOfMaterials/>*!/*/}
        {/*  </Card>*/}
        {/*  <div className="button-container">*/}
        {/*    <Button className="new-event-button">Add Material</Button>*/}
        {/*  </div>*/}
      </CardBody>
    </Card>
  )
}

const mapStateToProps = ({ authReducer, courseInstanceReducer }) => {
  return {
    user: authReducer.user,
    course: courseInstanceReducer.courseInstance,
  }
}

export default connect(mapStateToProps)(CreateTimeline)
