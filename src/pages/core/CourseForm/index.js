import React, {useState} from 'react'
import {Button, Form, FormGroup, Input, Label} from 'reactstrap'
import Autocomplete from '@material-ui/lab/Autocomplete'
import TextField from '@material-ui/core/TextField'
import './CourseForm.css'
import {getShortId} from '../Helper'
import {Redirect} from 'react-router-dom'
import {connect} from 'react-redux'
import {useGetCoursesQuery, useUpdateCourseMutation, useNewCourseMutation} from 'services/course'
import {useGetUsersQuery} from 'services/user'

function CourseForm(props) {
  const { typeOfForm, user, id } = props
  const [name, setName] = useState(props.name)
  const [description, setDescription] = useState(props.description)
  const [abbreviation, setAbbreviation] = useState(props.abbreviation)
  const [prerequisites, setPrerequisites] = useState(props.prerequisites)
  const [admins, setAdmins] = useState(props.admins)
  const [errors, setErrors] = useState([])
  const [redirectTo, setRedirectTo] = useState(null)
  const {data: coursesData, isSuccess: coursesIsSuccess} = useGetCoursesQuery()
  const {data: usersData, isSuccess: usersIsSuccess} = useGetUsersQuery()
  const [updateCurse, updateCurseResult] = useUpdateCourseMutation()
  const [newCourse, newCourseResult] = useNewCourseMutation()

  let courses = []
  if(coursesIsSuccess && coursesData) {
    courses = coursesData.map(course => {
      return {
        fullId: course['@id'],
        name: course.name ? course.name : '',
      }
    })
  }

  let users = []
  if(usersIsSuccess && usersData) {
    users = usersData.map(user => {
      return {
        fullId: user['@id'],
        name:
          user.firstName !== '' && user.lastName !== ''
            ? `${user.firstName} ${user.lastName}`
            : 'Noname',
      }
    })
  }

  const onSubmit = (event) => {
    event.preventDefault()
    const newErrors = validate(name, description, abbreviation)
    if (newErrors.length > 0) {
      setErrors(newErrors)
      return
    }

    const hasPrerequisite = prerequisites.map(prerequisite => {
      return prerequisite.fullId
    })

    const hasAdmin = admins.map(admin => {
      return admin.fullId
    })

    const body = {
      name: name.split('"').join("'"),
      description: description.split('"').join("'").split('\n').join(''),
      abbreviation: abbreviation.split('"').join("'"),
      hasPrerequisite,
      hasAdmin,
    }

    try {
      let newUrl
      if (typeOfForm === 'Edit') {
        updateCurse({id, patch: body}).unwrap()
        newUrl = `/course/${id}`
        setRedirectTo(newUrl)
      } else {
        newCourse(body).unwrap().then(response => {
          const newCourseId = getShortId(response.resource.iri)
          newUrl = {
            pathname: `/newcourseinstance/${newCourseId}`,
            state: {courseName: name},
          }
          console.log(response)
          setRedirectTo(newUrl)
        })
      }
    } catch {
      newErrors.push(
        'There was a problem with server while sending your form. Try again later.'
      )
      setErrors(newErrors)
    }
  }

  const validate = (name, description, abbreviation) => {
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

  const onPrerequisitesChange = (event, values) => {
    setPrerequisites(values)
  }

  const onAdminsChange = (event, values) => {
    setAdmins(values)
  }

  if (redirectTo) {
    return <Redirect to={redirectTo}/>
  }

  const isInvalid = name === '' || description === '' || abbreviation === ''
  return (
    <>
      {errors.map(error => (
        <p key={error}>Error: {error}</p>
      ))}
      <Form className="new-course-form" onSubmit={onSubmit}>
        <FormGroup>
          <Label for="name" className="form-label-subtitle">
            Name *
          </Label>
          <Input
            name="name"
            id="name"
            value={name}
            onChange={e => setName(e.target.value)}
            type="text"
            className="form-input"
          />
          <Label for="abbreviation" className="form-label-subtitle">
            Abbreviation *
          </Label>
          <Input
            name="abbreviation"
            id="abbreviation"
            value={abbreviation}
            onChange={e => setAbbreviation(e.target.value)}
            type="text"
            className="form-input"
          />
          <Label for="description" className="form-label-subtitle">
            Description *
          </Label>
          <Input
            name="description"
            id="description"
            value={description}
            onChange={e => setDescription(e.target.value)}
            type="textarea"
            className="form-input"
          />
        </FormGroup>
        <FormGroup>
          <Label for="prerequisites" className="form-label-subtitle">
            Prerequisites
          </Label>
          <Autocomplete
            multiple
            name="prerequisites"
            id="prerequisites"
            options={courses}
            getOptionLabel={option => option.name}
            value={prerequisites}
            onChange={onPrerequisitesChange}
            style={{maxWidth: 700}}
            renderInput={params => (
              <TextField
                {...params}
                placeholder=""
                InputProps={{...params.InputProps, disableUnderline: true}}
              />
            )}
            className="form-input"
          />
          {user && user.isSuperAdmin && (
            <>
              <Label for="admins" className="form-label-subtitle">
                Admins
              </Label>
              <Autocomplete
                multiple
                name="admins"
                id="admins"
                className="form-input"
                options={users}
                getOptionLabel={option => option.name}
                onChange={onAdminsChange}
                value={admins}
                style={{maxWidth: 700}}
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
            </>
          )}
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

const mapStateToProps = ({authReducer}) => {
  return {
    user: authReducer.user,
  }
}

export default connect(mapStateToProps)(CourseForm)
