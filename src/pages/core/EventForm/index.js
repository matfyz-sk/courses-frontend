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
import { BASE_URL, EVENT_URL, INITIAL_EVENT_STATE, TOKEN } from '../constants'
import { axiosRequest } from '../AxiosRequests'

class EventForm extends Component {
  constructor(props) {
    super(props)

    this.state = { ...INITIAL_EVENT_STATE }
  }

  componentDidMount() {
    this.setState({ ...this.props })
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
    } = this.state
    const { typeOfForm } = this.props

    let url = BASE_URL + EVENT_URL
    let method = 'post'
    if (typeOfForm === 'Edit') {
      url += `/${id}`
      method = 'patch'
    }
    axiosRequest(
      method,
      TOKEN,
      JSON.stringify({
        name,
        description,
        startDate,
        endDate,
        location: place,
        //TODO type when implemented
      }),
      url
    ).then(response => {
      if (response.status === 200) {
        // TODO redirect to event/id
        console.log('Hooray!')
      } else {
        // TODO
        console.log('Ooops!')
      }
    })
    event.preventDefault()
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
    const { typeOfForm } = this.props

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
            <option value="Lecture">Lecture</option>
            <option value="Lab">Lab</option>
            <option value="Block">Block</option>
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
