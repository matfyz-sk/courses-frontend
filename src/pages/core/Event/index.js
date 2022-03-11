import React from 'react'
import { Alert, Card, CardBody, CardHeader, CardSubtitle, Container, Table, } from 'reactstrap'
import { connect } from 'react-redux'
import { NavLink, Redirect } from 'react-router-dom'
import './Event.css'
import { SubEventList } from '../Events'
import { getDisplayDateTime, getIcon, getInstructorRights, getShortId, mergeMaterials, } from '../Helper'
import { BASE_URL, EVENT_URL, INITIAL_EVENT_STATE, SESSIONS, TASKS_EXAMS, } from '../constants'
import { axiosRequest, getData } from '../AxiosRequests'
import { redirect } from '../../../constants/redirect'
import * as ROUTES from '../../../constants/routes'

class Event extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      event: INITIAL_EVENT_STATE,
      redirectTo: null,
      hasAccess: false,
      loading: true,
    }
  }

  componentDidMount() {
    const {
      match: {params},
    } = this.props

    const {user, courseInstance} = this.props

    if(courseInstance && user && getInstructorRights(user, courseInstance)) {
      this.setState({
        hasAccess: true,
      })
    }

    const url = `${ BASE_URL + EVENT_URL }/${
      params.event_id
    }?_join=courseInstance,uses,recommends`
    axiosRequest('get', null, url).then(response => {
      const data = getData(response)
      this.setState({
        loading: false,
      })
      if(data != null && data !== []) {
        const event = data.map(eventData => {
          return {
            id: getShortId(eventData['@id']),
            name: eventData.name,
            description: eventData.description,
            startDate: new Date(eventData.startDate),
            endDate: new Date(eventData.endDate),
            place: eventData.location,
            type: eventData['@type'].split('#')[1],
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
            courseInstance: eventData.courseInstance[0]
              ? eventData.courseInstance[0]['@id']
              : eventData['@id'],
            instructors: eventData.courseInstance[0]
              ? eventData.courseInstance[0].hasInstructor
              : eventData.hasInstructor,
          }
        })[0]

        if(
          event.courseInstance !== '' &&
          params.course_id !== getShortId(event.courseInstance)
        ) {
          this.setState({
            redirectTo: ROUTES.NOT_FOUND,
          })
        }

        event.materials = mergeMaterials(event.uses, event.recommends)
        this.setState({
          event,
        })
      } else {
        this.setState({
          redirectTo: ROUTES.NOT_FOUND,
        })
      }
    })
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    const {user, courseInstance} = this.props
    if(
      prevProps.user !== user ||
      prevProps.courseInstance !== courseInstance
    ) {
      if(courseInstance && user && getInstructorRights(user, courseInstance)) {
        this.setState({
          hasAccess: true,
        })
      }
    }
  }

  render() {
    const {event, redirectTo, hasAccess, loading} = this.state

    if(redirectTo) {
      return <Redirect to={ redirectTo }/>
    }

    if(loading) {
      return (
        <Alert color="secondary" className="empty-message">
          Loading...
        </Alert>
      )
    }

    // const isAdmin = user ? user.isSuperAdmin : false
    return (
      <div>
        <Container className="container-view">
          { event && <EventCard event={ event } isAdmin={ hasAccess } detail/> }
        </Container>
      </div>
    )
  }
}

const EventCard = ({event, isAdmin, detail}) => (
  <Card id={ `${ event.id }` } name={ `${ event.id }` } className="event-card">
    <CardHeader className="event-card-header-flex">
      <NavLink
        to={ redirect(ROUTES.EVENT_ID, [
          {key: 'course_id', value: getShortId(event.courseInstance)},
          {key: 'event_id', value: event.id},
        ]) }
        className="subevent-name"
      >
        <div className="event-card-name">
          { event.name } ({ event.type })
        </div>
      </NavLink>
      { isAdmin &&
        (SESSIONS.includes(event.type) ||
          TASKS_EXAMS.includes(event.type) ||
          event.type === 'Block') && (
          <NavLink
            to={ redirect(ROUTES.EDIT_EVENT_ID, [
              {key: 'course_id', value: getShortId(event.courseInstance)},
              {key: 'event_id', value: event.id},
            ]) }
            className="edit-delete-buttons"
          >
            Edit
          </NavLink>
        ) }
    </CardHeader>
    <CardBody>
      <div className="event-dates-container">
        <div className="event-dates-col">
          <CardSubtitle className="event-card-subtitle-double">
            <div className="event-subtitle-double">From</div>
            { getDisplayDateTime(event.startDate, true) }
          </CardSubtitle>
        </div>
        <div className="event-dates-col">
          <CardSubtitle className="event-card-subtitle-double">
            <div className="event-subtitle-double">To</div>
            { getDisplayDateTime(event.endDate, true) }
          </CardSubtitle>
        </div>
      </div>
      {/*<CardText className="event-card-text">{event.description}</CardText>*/ }
      <CardSubtitle className="event-card-subtitle">Description</CardSubtitle>
      <div className="fake-table">{ event.description }</div>
      { event.place && (
        <>
          <CardSubtitle className="event-card-subtitle-one-line">
            <div className="event-subtitle">Location</div>
            <div className="event-one-line-text">{ event.place }</div>
          </CardSubtitle>
        </>
      ) }

      { event.type === 'Block' && !detail && (
        <div className="timeline-sessions-tasks-container">
          <div className="subevents-col-left">
            <CardSubtitle className="subevents-title">Sessions</CardSubtitle>
            <SubEventList events={ event.sessions }/>
          </div>
          <div className="subevents-col-right">
            <CardSubtitle className="subevents-title">Tasks</CardSubtitle>
            <SubEventList events={ event.tasks }/>
          </div>
        </div>
      ) }
      { event.materials && event.materials.length > 0 && (
        <>
          <CardSubtitle className="event-card-table-subtitle">
            Materials
          </CardSubtitle>
          <Table key={ event.id } className="materials-table">
            <tbody>
            { event.materials.map(material => (
              <tr key={ material.id } className="event-list-group-item">
                <td className="materials-td">
                  { getIcon('Material') }
                  <div className="material-name">{ material.name }</div>
                </td>
              </tr>
            )) }
            </tbody>
          </Table>
        </>
      ) }
    </CardBody>
  </Card>
)

const mapStateToProps = ({authReducer, courseInstanceReducer}) => {
  return {
    user: authReducer.user,
    courseInstance: courseInstanceReducer.courseInstance,
  }
}

export default connect(mapStateToProps)(Event)

export { EventCard }
