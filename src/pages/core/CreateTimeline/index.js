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
  Alert,
} from 'reactstrap'
import { connect } from 'react-redux'
import EventForm from '../EventForm'
import { SubEventList } from '../Events'
import ModalCreateEvent from '../ModalCreateEvent'
import {
  BASE_URL,
  EVENT_URL,
  INITIAL_EVENT_STATE,
  BLOCK_URL,
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
      courseId: '',
      timelineBlocks: [],
      nestedEvents: [],
      saved: false,
      disabled: false,
    }
  }

  componentDidMount() {
    const {
      match: { params },
    } = this.props

    this.setState({
      courseId: params.course_id,
    })

    this.getBlockMenu()
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (prevState.courseId !== this.state.courseId) {
      this.getBlockMenu()
    }
  }

  getBlockMenu = () => {
    const { courseId } = this.state

    if (courseId !== '') {
      const url = `${
        BASE_URL + EVENT_URL
      }?courseInstance=${courseId}&_join=courseInstance,uses,recommends`

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
  }

  generateWeeklyBlocks = () => {
    const { course } = this.props
    const blocks = []

    if (course) {
      const courseStartDate = new Date(course.startDate)
      const courseEndDate = new Date(course.endDate)

      let startDate = this.nextDay(courseStartDate, 1)
      let endDate = this.addDays(startDate, 7)

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
        endDate = this.addDays(startDate, 7)
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
    }
    return blocks
  }

  postWeeklyBlocks = () => {
    this.setState({
      disabled: true,
    })

    const { course } = this.props
    let errors = []

    if (course) {
      const blocks = this.generateWeeklyBlocks()

      for (let i = 0; i < blocks.length; i++) {
        const block = blocks[i]
        block.courseInstance = course['@id']
        const url = BASE_URL + BLOCK_URL
        axiosRequest('post', JSON.stringify(block), url)
          .then(response => {
            if (response && response.status === 200) {
            } else {
              errors.push(
                `There was a problem with server while posting ${block.name}`
              )
            }
            if (i === blocks.length - 1) {
              this.getBlockMenu()
            }
          })
          .catch()
      }
      if (errors.length > 0) {
        //TODO nepodarilo sa vygenerovat vsetky bloky
        console.log(errors)
      }
    }
  }

  addDays = (date, days) => {
    let result = new Date(date)
    result.setDate(result.getDate() + days)
    return result
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
      saved: false,
    })
  }

  setSavedAlert = id => {
    if (id === null) {
      this.setState({
        event: null,
      })
    } else {
      this.setState({
        saved: true,
      })
    }
    this.getBlockMenu()
  }

  render() {
    const { timelineBlocks, event, saved, disabled } = this.state
    return (
      <div>
        <Container className="core-container">
          <Row>
            <Col xs="3">
              <BlockMenu
                courseEvents={timelineBlocks}
                onClick={this.onBlockMenuClick}
              />
              {timelineBlocks.length === 0 && (
                <Button disabled={disabled} onClick={this.postWeeklyBlocks}>
                  {disabled ? 'Generatating...' : 'Generate Weekly Blocks'}
                </Button>
              )}
              <Button onClick={() => this.onBlockMenuClick(null)}>
                New Block
              </Button>
            </Col>
            <Col>
              {saved && (
                <Alert color="secondary">Event saved successfully!</Alert>
              )}
              <Card>
                <CardHeader className="event-card-header">New Event</CardHeader>
                <CardBody>
                  {event ? (
                    <EventForm
                      typeOfForm="Edit"
                      {...event}
                      options={[event.type]}
                      callBack={this.setSavedAlert}
                    />
                  ) : (
                    <EventForm
                      typeOfForm="Create"
                      {...INITIAL_EVENT_STATE}
                      options={['Block', 'Lab', 'Lecture']}
                      callBack={this.setSavedAlert}
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

//   <Container className="sessions-tasks-container">
//   <Row>
//   <Col className="subevents-col-left">
//   <CardSubtitle className="subevents-title">Sessions</CardSubtitle>
// <SubEventList events={[]} />
// </Col>
// <Col className="subevents-col-right">
//   <CardSubtitle className="subevents-title">Tasks</CardSubtitle>
//   <SubEventList events={[]} />
// </Col>
// </Row>
// <Row>
//   <Col>
//     <div className="button-container">
//       <ModalCreateEvent from="" to="" />
//     </div>
//   </Col>
//   <Col>
//     <div className="button-container">
//       <Button className="new-event-button">Add Task</Button>
//     </div>
//   </Col>
// </Row>
// </Container>
// <CardSubtitle className="subevents-title">Materials</CardSubtitle>
// <Card body className="materials-card">
//   <CardBody> </CardBody>
// {/*<ListOfMaterials/>*/}
// </Card>
// <div className="button-container">
// <Button className="new-event-button">Add Material</Button>
// </div>

const mapStateToProps = ({ authReducer, courseInstanceReducer }) => {
  return {
    user: authReducer.user,
    course: courseInstanceReducer.courseInstance,
  }
}

export default connect(mapStateToProps)(CreateTimeline)
