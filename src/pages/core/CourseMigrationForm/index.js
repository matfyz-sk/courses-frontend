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
  CardSubtitle,
} from 'reactstrap'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import TextField from '@material-ui/core/TextField'
import Autocomplete from '@material-ui/lab/Autocomplete'
import { BASE_URL, USER_URL } from '../constants'
import { axiosRequest, getData } from '../AxiosRequests'
import { connect } from 'react-redux'
import {
  setCourseMigrationState,
  setCourseMigrationStartDate,
  setCourseMigrationEndDate,
  setCourseMigrationInstructors,
} from '../../../redux/actions'

class CourseMigrationForm extends Component {
  constructor(props) {
    super(props)

    this.state = {
      users: [],
      startDate: new Date(),
      endDate: new Date(),
      instructors: [],
    }
  }

  componentDidMount() {
    const { startDate, endDate, instructors } = this.props
    this.setState({
      startDate,
      endDate,
      instructors,
    })

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
    if (prevProps.startDate !== this.props.startDate) {
      const { startDate, endDate, instructors } = this.props

      this.setState({
        startDate,
        endDate,
        instructors,
      })
    }
  }

  onInstructorChange = (event, values) => {
    this.setState({ instructors: values })
    this.props.setCourseMigrationInstructors(values)
  }

  handleChangeFrom = date => {
    this.setState({ startDate: date })
    this.props.setCourseMigrationStartDate(date)
  }

  handleChangeTo = date => {
    this.setState({ endDate: date })
    this.props.setCourseMigrationEndDate(date)
  }

  render() {
    const { startDate, endDate, users, instructors } = this.state
    const { next } = this.props.navigation

    return (
      <>
        <CardSubtitle className="card-subtitle-migrations">
          Course Details
        </CardSubtitle>
        <Form onSubmit={this.onSubmit} className="course-migration-container">
          <Label id="from-label" for="from" className="new-event-label">
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
          <Label for="to" className="new-event-label">
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
          <div className="button-container-migrations">
            <Button className="new-event-button" onClick={next}>
              Next
            </Button>
          </div>
        </Form>
      </>
    )
  }
}

const mapStateToProps = ({ courseMigrationReducer }) => {
  return {
    startDate: courseMigrationReducer.startDate,
    endDate: courseMigrationReducer.endDate,
    instructors: courseMigrationReducer.instructors,
  }
}

export default compose(
  withRouter,
  connect(mapStateToProps, {
    setCourseMigrationState,
    setCourseMigrationStartDate,
    setCourseMigrationEndDate,
    setCourseMigrationInstructors,
  })
)(CourseMigrationForm)
