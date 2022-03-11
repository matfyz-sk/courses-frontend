import React, { Component } from 'react'
import { Form, Label } from 'reactstrap'
import Autocomplete from '@material-ui/lab/Autocomplete'
import TextField from '@material-ui/core/TextField'
import { BASE_URL, USER_URL } from '../constants'
import { axiosRequest, getData } from '../AxiosRequests'
import './AddInstructor.css'
import { connect } from 'react-redux'

class AddInstructor extends Component {
  constructor(props) {
    super(props)
    this.state = {
      users: [],
      instructors: [],
    }
  }

  componentDidMount() {
    const {courseInstanceId} = this.props

    let url = BASE_URL + USER_URL
    axiosRequest('get', null, url).then(response => {
      const data = getData(response)
      if(data != null) {
        const users = data.map(user => {
          return {
            fullId: user['@id'],
            name:
              user.firstName !== '' && user.lastName !== ''
                ? `${ user.firstName } ${ user.lastName }`
                : 'Noname',
          }
        })
        this.setState({
          users,
        })
      }
    })

    if(courseInstanceId != null) {
      url += `?instructorOf=${ courseInstanceId }`
      axiosRequest('get', null, url).then(response => {
        const data = getData(response)
        if(data != null) {
          const instructors = data.map(user => {
            return {
              fullId: user['@id'],
              name:
                user.firstName !== '' && user.lastName !== ''
                  ? `${ user.firstName } ${ user.lastName }`
                  : 'Noname',
            }
          })
          this.setState({
            instructors,
          })
        }
      })
    }
  }

  handleSubmit = event => {
    console.log('submit')
  }

  onInstructorChange = (event, values) => {
    this.setState({instructors: values})
  }

  render() {
    const {users, instructors} = this.state

    return (
      <Form className="add-instructors" onSubmit={ this.handleSubmit }>
        <Label id="instructors-label" for="instructors">
          Instructors
        </Label>
        <Autocomplete
          multiple
          name="instructors"
          id="instructors"
          options={ users }
          getOptionLabel={ option => option.name }
          onChange={ this.onInstructorChange }
          value={ instructors }
          style={ {minWidth: 200, maxWidth: 500} }
          renderInput={ params => (
            <TextField
              { ...params }
              placeholder=""
              InputProps={ {...params.InputProps, disableUnderline: true} }
            />
          ) }
        />
        <button type='submit' ref={ (button) => {
          this.activityFormButton = button
        } }>Submit
        </button>
      </Form>
    )
  }
}

const mapStateToProps = ({authReducer}) => {
  return {
    user: authReducer.user,
  }
}

export default connect(mapStateToProps)(AddInstructor)
