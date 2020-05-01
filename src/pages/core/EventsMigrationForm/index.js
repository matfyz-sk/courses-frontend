import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import { compose } from 'recompose'
import {
  Button,
  Form,
  FormGroup,
  Label,
  Container,
  Row,
  Col,
  Input,
} from 'reactstrap'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import TextField from '@material-ui/core/TextField'
import Autocomplete from '@material-ui/lab/Autocomplete'
import {
  BASE_URL,
  COURSE_INSTANCE_URL,
  COURSE_URL,
  EVENT_URL,
} from '../constants'
import { axiosRequest, getData } from '../AxiosRequests'
import { getEvents, sortEventsFunction } from '../Timeline/timeline-helper'
import {getShortId} from "../Helper";

class EventsMigrationForm extends Component {
  constructor(props) {
    super(props)

    this.state = {
      events: [],
    }
  }

  componentDidMount() {
    const { courseInstance } = this.props

    if (courseInstance) {
      this.getEvents()
    }
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (prevProps.courseInstance !== this.props.courseInstance) {
      this.getEvents()
    }
  }

  getEvents = () => {
    const { courseInstance } = this.props

    const courseInstanceId = getShortId(courseInstance['@id'])

    const url = `${
      BASE_URL + EVENT_URL
    }?courseInstance=${courseInstanceId}&_join=uses,recommends`


    axiosRequest('get', null, url).then(response => {
      const data = getData(response)
      if (data != null && data !== []) {
        const events = getEvents(data).sort(sortEventsFunction)

        this.setState({
          events,
        })
      }
    })
  }

  onSubmit = event => {}

  onChange = event => {
    this.setState({ [event.target.name]: event.target.value })
  }

  render() {
    const { events } = this.state

    return (
      <>
        <Form onSubmit={this.onSubmit}>
          {events.map(event => (
            <FormGroup check key={event.id}>
              <Label for={`${event.id}`}>
                <Input name={event.id} id={event.id} type="checkbox" />{' '}
                {event.name}
              </Label>
            </FormGroup>
          ))}

          <div className="button-container">
            <Button className="new-event-button" type="submit">
              Next
            </Button>
          </div>
        </Form>
      </>
    )
  }
}

export default compose(withRouter)(EventsMigrationForm)
