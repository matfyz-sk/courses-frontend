import React, { Component } from 'react'
import { Button, Form, FormGroup, Input, Label } from 'reactstrap'
import { Redirect } from 'react-router-dom'
import Autocomplete from '@material-ui/lab/Autocomplete'
import TextField from '@material-ui/core/TextField'
import { Courses } from '../Courses/courses-data'
// import Chip from "@material-ui/core/Chip";
import './CourseForm.css'
import { GRAPH_URI } from '../../../constants/constants'
import { COURSES } from '../../../constants/routes'
import { axiosRequest, getData } from '../AxiosRequests'
import {
  TOKEN,
  INITIAL_COURSE_STATE,
  BASE_URL,
  COURSE_URL,
  USER_URL,
} from '../constants'

class CourseForm extends Component {
  constructor(props) {
    super(props)
    this.state = { ...INITIAL_COURSE_STATE, courses: [], users: [] }
  }

  componentDidMount() {
    this.setState({ ...this.props })

    let url = BASE_URL + COURSE_URL
    axiosRequest('get', TOKEN, null, url).then(response => {
      const data = getData(response)
      if (data != null) {
        const courses = data.map(course => {
          return {
            fullId: course['@id'],
            name: course.name,
          }
        })
        this.setState({
          courses,
        })
      }
    })

    url = BASE_URL + USER_URL
    axiosRequest('get', TOKEN, null, url).then(response => {
      const data = getData(response)
      if (data != null) {
        const users = data.map(user => {
          return {
            fullId: user['@id'],
            name: user.name,
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
      id,
      name,
      description,
      abbreviation,
      prerequisites,
      admins,
    } = this.state
    const { typeOfForm } = this.props

    const hasPrerequisite = prerequisites.map(prerequisite => {
      return prerequisite.fullId
    })

    const hasAdmin = admins.map(admin => {
      return admin.fullId
    })

    let url = BASE_URL + COURSE_URL
    let method = 'post'

    if (typeOfForm === 'Edit') {
      url += `/${id}`
      method = 'put'
    }

    axiosRequest(
      method,
      TOKEN,
      JSON.stringify({
        name,
        description,
        abbreviation,
        hasPrerequisite,
        // TODO uncomment when implemented
        // hasAdmin
      }),
      url
    ).then(response => {
      if (response.status === 200) {
        // TODO
        console.log('Hurray!')
        if (typeOfForm === 'Create') {
          // redirect to new Instance
        } else {
          // redirect to courses
        }
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

  onPrerequisitesChange = (event, values) => {
    this.setState({ prerequisites: values })
  }

  onAdminsChange = (event, values) => {
    this.setState({ admins: values })
  }

  render() {
    console.log(this.state)
    const {
      name,
      description,
      abbreviation,
      prerequisites,
      admins,
      courses,
      users,
    } = this.state
    const { typeOfForm } = this.props

    const isInvalid = name === '' || description === '' || abbreviation === ''
    return (
      <Form className="new-course-form" onSubmit={this.onSubmit}>
        <FormGroup>
          <Label for="name">Name</Label>
          <Input
            name="name"
            id="name"
            value={name}
            onChange={this.onChange}
            type="text"
          />
          <Label for="abbreviation">Abbreviation</Label>
          <Input
            name="abbreviation"
            id="abbreviation"
            value={abbreviation}
            onChange={this.onChange}
            type="text"
          />
          <Label for="description">Description</Label>
          <Input
            name="description"
            id="description"
            value={description}
            onChange={this.onChange}
            type="textarea"
          />
        </FormGroup>
        <FormGroup>
          <Label for="prerequisites">Prerequisites</Label>
          <Autocomplete
            multiple
            name="prerequisites"
            id="prerequisites"
            options={courses}
            getOptionLabel={option => option.name}
            value={prerequisites}
            onChange={this.onPrerequisitesChange}
            style={{ maxWidth: 500 }}
            renderInput={params => (
              <TextField
                {...params}
                placeholder=""
                InputProps={{ ...params.InputProps, disableUnderline: true }}
              />
            )}
          />

          <Label for="admins">Admin</Label>
          <Autocomplete
            multiple
            name="admins"
            id="admins"
            options={users}
            getOptionLabel={option => option.name}
            onChange={this.onAdminsChange}
            filterSelectedOptions
            value={admins}
            style={{ maxWidth: 500 }}
            renderInput={params => (
              <TextField
                {...params}
                placeholder=""
                InputProps={{ ...params.InputProps, disableUnderline: true }}
              />
            )}
          />
        </FormGroup>
        <div className="button-container">
          <Button disabled={isInvalid} type="submit" className="create-button">
            {typeOfForm}
          </Button>
        </div>
      </Form>
    )
  }
}

export default CourseForm
