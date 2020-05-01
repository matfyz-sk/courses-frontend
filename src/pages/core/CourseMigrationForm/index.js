import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import { compose } from 'recompose'
import { Button, Form, FormGroup, Label, Container, Row, Col } from 'reactstrap'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import TextField from '@material-ui/core/TextField'
import Autocomplete from '@material-ui/lab/Autocomplete'
import {
  BASE_URL,
  COURSE_INSTANCE_URL,
  COURSE_URL,
  INITIAL_EVENT_STATE,
  USER_URL,
} from '../constants'
import { axiosRequest, getData } from '../AxiosRequests'

class CourseMigrationForm extends Component {
  constructor(props) {
    super(props)

    this.state = {
      ...INITIAL_EVENT_STATE,
      errors: [],
      users: [],
    }
  }

  componentDidMount() {
    this.setState({ ...this.props })

    const url = BASE_URL + USER_URL
    axiosRequest('get', null, url).then(response => {
      const data = getData(response)
      if (data != null) {
        const users = data.map(user => {
          return {
            fullId: user['@id'],
            name:
              user.firstName !== '' && user.lastName !== ''
                ? `${user.firstName} ${user.lastName}`
                : 'Noname',
          }
        })
        this.setState({
          users,
        })
      }
    })
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (prevProps.name !== this.props.name) {
      this.setState({ ...this.props })
    }
  }

  onSubmit = event => {
    const {
      name,
      description,
      startDate,
      endDate,
      place,
      courseId,
      instructors,
    } = this.state

    const errors = this.validate(description, startDate, endDate)
    if (errors.length > 0) {
      this.setState({ errors })
      event.preventDefault()
      return
    }

    const courseFullId = [
      `http://www.courses.matfyz.sk/data${COURSE_URL}/${courseId}`,
    ]

    const hasInstructor = instructors.map(instructor => {
      return instructor.fullId
    })

    const data = {
      name,
      description,
      startDate,
      endDate,
      location: place,
      hasInstructor,
      instanceOf: courseFullId,
    }

    const url = BASE_URL + COURSE_INSTANCE_URL

    axiosRequest('post', JSON.stringify(data), url)
      .then(response => {
        if (response && response.status === 200) {
          //TODO
        } else {
          errors.push(
            'There was a problem with server while sending your form. Try again later.'
          )
          this.setState({
            errors,
          })
        }
      })
      .catch()
    event.preventDefault()
  }

  validate = (name, description, startDate, endDate) => {
    const errors = []
    if (new Date(startDate) > new Date(endDate)) {
      errors.push('The End date must be greater than the Start date.')
    }
    return errors
  }

  onInstructorChange = (event, values) => {
    this.setState({ instructors: values })
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
    const { startDate, endDate, errors, users, instructors } = this.state

    const isInvalid = startDate === null || endDate === null

    return (
      <>
        {errors.map(error => (
          <p key={error} className="form-error">
            Error: {error}
          </p>
        ))}
        <Form onSubmit={this.onSubmit}>
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
                    maxDate={endDate}
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
                    minDate={startDate}
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

          <FormGroup className="add-instructors">
            <Label id="instructors-label" for="instructors">
              Instructors
            </Label>
            <Autocomplete
              multiple
              name="instructors"
              id="instructors"
              options={users}
              getOptionLabel={option => option.name}
              onChange={this.onInstructorChange}
              value={instructors}
              style={{ minWidth: 200, maxWidth: 500 }}
              renderInput={params => (
                <TextField
                  {...params}
                  placeholder=""
                  InputProps={{
                    ...params.InputProps,
                    disableUnderline: true,
                  }}
                />
              )}
            />
          </FormGroup>

          <div className="button-container">
            <Button
              className="new-event-button"
              disabled={isInvalid}
              type="submit"
            >
              Next
            </Button>
          </div>
        </Form>
      </>
    )
  }
}

export default compose(withRouter)(CourseMigrationForm)
