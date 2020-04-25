import React, { Component } from 'react'
import { Button, Form, FormGroup, Input, Label } from 'reactstrap'
import Autocomplete from '@material-ui/lab/Autocomplete'
import TextField from '@material-ui/core/TextField'
import './CourseForm.css'
import { axiosRequest, getData } from '../AxiosRequests'
import {
  INITIAL_COURSE_STATE,
  BASE_URL,
  COURSE_URL,
  USER_URL,
} from '../constants'
import { getShortId } from '../Helper'
import { Redirect } from 'react-router-dom'

class CourseForm extends Component {
  constructor(props) {
    super(props)
    this.state = {
      ...INITIAL_COURSE_STATE,
      courses: [],
      users: [],
      redirect: null,
      errors: [],
    }
  }

  componentDidMount() {
    this.setState({ ...this.props })

    let url = BASE_URL + COURSE_URL
    axiosRequest('get', null, url).then(response => {
      const data = getData(response)
      if (data != null) {
        const courses = data.map(course => {
          return {
            fullId: course['@id'],
            name: course.name ? course.name : '',
          }
        })
        this.setState({
          courses,
        })
      }
    })

    url = BASE_URL + USER_URL
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
      id,
      name,
      description,
      abbreviation,
      prerequisites,
      admins,
    } = this.state
    const { typeOfForm } = this.props

    const errors = this.validate(name, description, abbreviation)
    if (errors.length > 0) {
      this.setState({ errors })
      event.preventDefault()
      return
    }

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
      method = 'patch'
    }

    axiosRequest(
      method,
      JSON.stringify({
        name,
        description,
        abbreviation,
        hasPrerequisite,
        hasAdmin,
      }),
      url
    ).then(response => {
      if (response && response.status === 200) {
        let newUrl
        if (typeOfForm === 'Create') {
          const newCourseId = getShortId(response.data.resource.iri)
          newUrl = {
            pathname: `/newcourseinstance/${newCourseId}`,
            state: { courseName: name },
          }
        } else {
          newUrl = `/course/${id}`
        }
        this.setState({
          redirect: newUrl,
        })
      } else {
        errors.push(
          'There was a problem with server while sending your form. Try again later.'
        )
        this.setState({
          errors,
        })
      }
    })
    event.preventDefault()
  }

  validate = (name, description, abbreviation) => {
    const errors = []
    if (name.length === 0) {
      errors.push("Name can't be empty.")
    }
    if (description.length === 0) {
      errors.push("Description can't be empty.")
    }
    if (abbreviation.length === 0) {
      errors.push("Abbreviation can't be empty.")
    }
    return errors
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
    const {
      name,
      description,
      abbreviation,
      prerequisites,
      admins,
      courses,
      users,
      redirect,
      errors,
    } = this.state
    const { typeOfForm } = this.props

    if (redirect) {
      return <Redirect to={redirect} />
    }

    const isInvalid = name === '' || description === '' || abbreviation === ''
    return (
      <>
        {errors.map(error => (
          <p key={error}>Error: {error}</p>
        ))}
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

            <Label for="admins">Admins</Label>
            <Autocomplete
              multiple
              name="admins"
              id="admins"
              options={users}
              getOptionLabel={option => option.name}
              onChange={this.onAdminsChange}
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
            <Button
              disabled={isInvalid}
              type="submit"
              className="create-button"
            >
              {typeOfForm}
            </Button>
          </div>
        </Form>
      </>
    )
  }
}

export default CourseForm
