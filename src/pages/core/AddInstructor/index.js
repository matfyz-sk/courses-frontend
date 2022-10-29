import React from 'react'
import { Form, Label } from 'reactstrap'
import Autocomplete from '@material-ui/lab/Autocomplete'
import TextField from '@material-ui/core/TextField'
import './AddInstructor.css'
import { connect } from 'react-redux'
import { useGetUsersQuery, useGetInstructorsOfCourseQuery } from 'services/user'


function AddInstructor(props) {
  const { courseInstanceId } = props
  const { data: getUsersData, isSuccess: getUsersIsSuccess } = useGetUsersQuery()
  const { data: getInstructorsData, isSuccess: getInstructorsIsSuccess } = useGetInstructorsOfCourseQuery(courseInstanceId)
  const [users, setUsers] = useState([])
  const [instructors, setInstructors] = useState([])

  // ComponentDidMount
  useEffect(()=>{
    if(getUsersIsSuccess && getUsersData) {
      const currentUsers = getUsersData.map(user => {
        return {
          fullId: user['@id'],
          name:
            user.firstName !== '' && user.lastName !== ''
              ? `${user.firstName} ${user.lastName}`
              : 'Noname',
        }
      })
      setUsers(currentUsers)
    }

    if(courseInstanceId != null && getInstructorsIsSuccess && getInstructorsData) {
      const currentInstructors = getInstructorsData.map(user => {
        return {
          fullId: user['@id'],
          name:
            user.firstName !== '' && user.lastName !== ''
              ? `${user.firstName} ${user.lastName}`
              : 'Noname',
        }
      })
      setInstructors(currentInstructors)
    }

  },[])

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

// TODO ask what does activityFormButton do and why was it saved like: this.activityFormButton = button

const mapStateToProps = ({ authReducer }) => {
  return {
    user: authReducer.user,
  }
}

export default connect(mapStateToProps)(AddInstructor)
