import React, {useState} from 'react'
import { Form, Label } from 'reactstrap'
import Autocomplete from '@material-ui/lab/Autocomplete'
import TextField from '@material-ui/core/TextField'
import './AddInstructor.css'
import { connect } from 'react-redux'
import { useGetUsersQuery, useGetInstructorsOfCourseQuery } from 'services/user'

function AddInstructor(props) {
  const { courseInstanceId } = props
  const [instructors, setInstructors] = useState([])
  const { data: getUsersData, isSuccess: getUsersIsSuccess } = useGetUsersQuery()
  const { data: getInstructorsData, isSuccess: getInstructorsIsSuccess } = useGetInstructorsOfCourseQuery(courseInstanceId)

  let users = []
  if(getUsersIsSuccess && getUsersData) {
    users = processPersonData(getUsersData)
  }

  if(courseInstanceId != null && instructors === [] && getInstructorsIsSuccess && getInstructorsData) {
    setInstructors(processPersonData(getInstructorsData))
  }

  const handleSubmit = (event) => {
    console.log('submit')
  }

  const onInstructorChange = (event, values) => {
    setInstructors(values)
  }

  return (
    <Form className="add-instructors" onSubmit={handleSubmit}>
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
              InputProps={{ ...params.InputProps, disableUnderline: true }}
            />
          )}
        />
        <button type='submit' ref={ (button) => { activityFormButton = button } } >Submit</button>
      </Form>
  )
}

const processPersonData = (data) => {
  return data.map(user => {
    return {
      fullId: user['@id'],
      name:
        user.firstName !== '' && user.lastName !== ''
          ? `${user.firstName} ${user.lastName}`
          : 'Noname',
    }
  })
}

const mapStateToProps = ({ authReducer }) => {
  return {
    user: authReducer.user,
  }
}

export default connect(mapStateToProps)(AddInstructor)
