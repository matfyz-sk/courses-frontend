import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import { compose } from 'recompose'
import {
  Button,
  Form,
  FormGroup,
  Label,
  Input,
  Container,
  Row,
  Col,
} from 'reactstrap'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import './NewEventFormStyle.css'
import {
  BASE_URL,
  COURSE_INSTANCE_URL, COURSE_URL,
  EVENT_URL,
  INITIAL_EVENT_STATE,
  TOKEN,
} from '../constants'
import { axiosRequest } from '../AxiosRequests'

class EventForm extends Component {
  constructor(props) {
    super(props)

    this.state = { ...INITIAL_EVENT_STATE, courseId: '' }
  }

  componentDidMount() {
    const {
      match: { params },
    } = this.props

    this.setState({ ...this.props, courseId: params.course_id })
    //TODO get instanceOf course
    //TODO redirect if type != session
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (prevProps.name !== this.props.name) {
      this.setState({ ...this.props })
    }
  }

  onSubmit = event => {
    const {
      id,
      name,
      description,
      startDate,
      endDate,
      place,
      type,
      courseInstance,
      courseId,
    } = this.state
    const { typeOfForm } = this.props

    const courseInstanceFullId = [
      `http://www.courses.matfyz.sk/data${COURSE_INSTANCE_URL}/${courseId}`,
    ]
    const courseFullId = [
      `http://www.courses.matfyz.sk/data${COURSE_URL}/${courseId}`,
    ]


    const typeLowerCase = this.lowerFirstLetter(type)
    let url = `${BASE_URL}/${typeLowerCase}/${id}`
    console.log(url)

    let method = 'patch'
    let data = {
      name,
      description,
      startDate,
      endDate,
      location: place,
    }

    if (typeOfForm === 'Create') {
      url = BASE_URL + EVENT_URL
      method = 'post'
      // eslint-disable-next-line no-underscore-dangle
      data._type = type
      data.courseInstance = courseInstanceFullId
    } else if (typeOfForm === 'New Course Instance') {
      url = BASE_URL + COURSE_INSTANCE_URL
      method = 'post'
      data.instanceOf = courseFullId
    }

    console.log(data)
    axiosRequest(
      method,
      TOKEN,
      JSON.stringify(data),
      url
    )
      .then(response => {
        if (response && response.status === 200) {
          // TODO redirect to event/id
          console.log('Hooray!')
        } else {
          // TODO
          console.log('Ooops!')
        }
      })
      .catch()
    event.preventDefault()
  }

  lowerFirstLetter = (s) => {
    return s.charAt(0).toLowerCase() + s.slice(1)
  }


  onChange = event => {
    this.setState({ [event.target.name]: event.target.value })
  }

  handleChangeFrom = date => {
    this.setState({ startDate: date })
  }

  handleChangeTo = date => {
    this.setState({ endDate: date })
  }

  render() {
    const { name, description, startDate, endDate, place, type } = this.state
    const { typeOfForm, options } = this.props

    const isInvalid =
      name === '' ||
      description === '' ||
      startDate === null ||
      endDate === null
    // ||
    // endDate<startDate

    return (
      <Form onSubmit={this.onSubmit}>
        <FormGroup className="new-event-formGroup">
          <Label for="name" className="new-event-label">
            Name
          </Label>
          <Input
            name="name"
            id="name"
            value={name}
            onChange={this.onChange}
            type="text"
          />
        </FormGroup>
        <FormGroup className="new-event-formGroup">
          <Label for="type" className="new-event-label">
            Type
          </Label>
          <Input
            id="type"
            type="select"
            name="type"
            value={type}
            onChange={this.onChange}
          >
            {options.map(option => (
              <option value={option}>{option}</option>
            ))}
          </Input>
        </FormGroup>

        <FormGroup>
          <Container className="event-form-dateTime-container">
            <Row>
              <Col className="event-form-dateTime-col">
                <Label id="from-label" for="from" className="label-dateTime">
                  From
                </Label>
                <DatePicker
                  name="from"
                  id="from"
                  selected={startDate}
                  onChange={this.handleChangeFrom}
                  showTimeSelect
                  timeFormat="HH:mm"
                  timeIntervals={15}
                  dateFormat="dd/MM/yyyy HH:mm"
                  timeCaption="time"
                />
              </Col>
              <Col className="event-form-dateTime-col">
                <Label for="to" className="label-dateTime">
                  To
                </Label>
                <DatePicker
                  name="to"
                  id="to"
                  selected={endDate}
                  onChange={this.handleChangeTo}
                  showTimeSelect
                  timeFormat="HH:mm"
                  timeIntervals={15}
                  dateFormat="dd/MM/yyyy HH:mm"
                  timeCaption="time"
                />
              </Col>
            </Row>
          </Container>
        </FormGroup>
        <FormGroup className="new-event-formGroup">
          <Label for="description" className="new-event-label">
            Description
          </Label>
          <Input
            name="description"
            id="description"
            value={description}
            onChange={this.onChange}
            type="textarea"
          />
        </FormGroup>
        <FormGroup className="new-event-formGroup">
          <Label for="place" className="new-event-label">
            Location
          </Label>
          <Input
            name="place"
            id="place"
            value={place}
            onChange={this.onChange}
            type="text"
          />
        </FormGroup>
        <div className="button-container">
          <Button
            className="new-event-button"
            disabled={isInvalid}
            type="submit"
          >
            {typeOfForm}
          </Button>
        </div>
      </Form>
    )
  }
}

export default compose(withRouter)(EventForm)
