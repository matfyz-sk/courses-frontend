import React, { Component } from 'react'
import { NavLink, withRouter } from 'react-router-dom'
import { compose } from 'recompose'
import { Button, CardSubtitle, Col, Container, Form, FormGroup, Input, Label, Row, } from 'reactstrap'
import 'react-datepicker/dist/react-datepicker.css'
import { connect } from 'react-redux'
import { setCourseMigrationEvents } from '../../../redux/actions'
import { redirect } from '../../../constants/redirect'
import * as ROUTES from '../../../constants/routes'
import { getShortId } from '../Helper'

class EventsMigrationForm extends Component {
  constructor(props) {
    super(props)

    this.state = {
      allEvents: [],
      checkedEvents: [],
    }
  }

  componentDidMount() {
    const {allEvents} = this.props
    const {checkedEvents} = this.props

    this.setState({
      allEvents,
      checkedEvents,
      migrateAll: false,
    })
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if(prevProps.events !== this.props.events) {
      this.setState({
        allEvents: this.props.events,
        checkedEvents: this.props.checkedEvents,
      })
    }
  }

  onChange = event => {
    let {checkedEvents} = this.state
    const {allEvents, migrateAll} = this.state
    if(event.target.name === 'migrateAll') {
      if(!migrateAll) {
        checkedEvents = allEvents.map(e => e.id)
      } else {
        checkedEvents = []
      }
      this.setState({
        migrateAll: !migrateAll,
      })
    } else {
      const index = checkedEvents.indexOf(event.target.name)
      if(index > -1) {
        checkedEvents.splice(index, 1)
      } else {
        checkedEvents.push(event.target.name)
      }
      if(migrateAll) {
        this.setState({
          migrateAll: false,
        })
      }
    }
    this.setState({
      checkedEvents,
    })
    this.props.setCourseMigrationEvents(checkedEvents)
  }

  render() {
    const {allEvents, checkedEvents, migrateAll} = this.state
    const {previous, next} = this.props.navigation

    return (
      <>
        <CardSubtitle className="card-subtitle-migrations">Events Migration</CardSubtitle>
        <Form onSubmit={ this.onSubmit } className="course-migration-container">
          <div>
            { allEvents && allEvents.length > 0 && (
              <FormGroup className="migrateAll-formgroup">
                <Label for="migrateAll">
                  <Input
                    name="migrateAll"
                    id="migrateAll"
                    type="checkbox"
                    onChange={ this.onChange }
                    checked={ migrateAll }
                  />{ ' ' }
                  Migrate all events from this course instance.
                </Label>
              </FormGroup>
            ) }
            <Container className="events-container-migrations">
              { allEvents &&
                allEvents.map(event => (
                  <FormGroup check key={ event.id }>
                    <Label for={ `${ event.id }` } className="event-row-migrations">
                      <Input
                        name={ event.id }
                        id={ event.id }
                        type="checkbox"
                        checked={ checkedEvents.includes(event.id) }
                        onChange={ this.onChange }
                      />{ ' ' }
                      <Row>
                        <Col>
                          <NavLink
                            to={ redirect(ROUTES.EVENT_ID, [
                              {
                                key: 'course_id',
                                value: getShortId(event.courseInstance),
                              },
                              {key: 'event_id', value: event.id},
                            ]) }
                            className="event-link-migrations"
                          >
                            { event.name }
                          </NavLink>
                        </Col>
                        <Col>{ event.type }</Col>
                        {/*<Col>{event.startDate}</Col>*/ }
                        {/*<Col>{event.endDate}</Col>*/ }
                      </Row>
                    </Label>
                  </FormGroup>
                )) }
            </Container>
          </div>

          <div className="button-container-migrations">
            <Button className="new-event-button" onClick={ previous }>
              Previous
            </Button>
            <Button className="new-event-button" onClick={ next }>
              Next
            </Button>
          </div>
        </Form>
      </>
    )
  }
}

const mapStateToProps = ({courseMigrationReducer}) => {
  return {
    allEvents: courseMigrationReducer.allEvents,
    checkedEvents: courseMigrationReducer.checkedEvents,
  }
}

export default compose(
  withRouter,
  connect(mapStateToProps, {setCourseMigrationEvents})
)(EventsMigrationForm)
