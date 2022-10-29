import React from 'react'
import { withRouter } from 'react-router-dom'
import { compose } from 'recompose'
import {
  Button,
  Form,
  Label,
  CardSubtitle,
} from 'reactstrap'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import TextField from '@material-ui/core/TextField'
import Autocomplete from '@material-ui/lab/Autocomplete'
import { connect } from 'react-redux'
import {
  setCourseMigrationState,
  setCourseMigrationStartDate,
  setCourseMigrationEndDate,
  setCourseMigrationInstructors,
} from '../../../redux/actions'
import { useGetUsersQuery } from 'services/user'


function CourseMigrationForm(props) {
  const { startDate: propStartDate, endDate: propEndDate, instructors: propInstructors } = props
  const { next } = props.navigation
  const { data, isSuccess } = useGetUsersQuery()
  const [startDate, setStartDate] = useState(propStartDate)
  const [endDate, setEndDate] = useState(propEndDate)
  const [instructors, setInstructors] = useState(propInstructors)

  let users = []
  if(isSuccess && data) {
    users = data.map(user => {
      return {
        fullId: user['@id'],
        name:
          user.firstName !== '' && user.lastName !== ''
            ? `${user.firstName} ${user.lastName}`
            : 'Noname',
      }
    })
  }

  onInstructorChange = (event, values) => {
    setInstructors(values)
    props.setCourseMigrationInstructors(values)
  }

  handleChangeFrom = date => {
    setStartDate(date)
    props.setCourseMigrationStartDate(date)
  }

  handleChangeTo = date => {
    setEndDate(date)
    props.setCourseMigrationEndDate(date)
  }

  return (
    <>
      <CardSubtitle className="card-subtitle-migrations">
        Course Details
      </CardSubtitle>
      <Form onSubmit={onSubmit} className="course-migration-container">
        <Label id="from-label" for="from" className="new-event-label">
          From
        </Label>
        <DatePicker
          name="from"
          id="from"
          selected={startDate}
          onChange={handleChangeFrom}
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
          onChange={handleChangeTo}
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
          onChange={onInstructorChange}
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
