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
  CardSubtitle,
} from 'reactstrap'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import './EventForm.css'
import TextField from '@material-ui/core/TextField'
import Autocomplete from '@material-ui/lab/Autocomplete'
import {
  BASE_URL,
  COURSE_INSTANCE_URL,
  COURSE_URL,
  EVENT_URL,
  INITIAL_EVENT_STATE,
  SESSIONS,
  TASKS_EXAMS,
  TASKS_DEADLINES,
  USER_URL,
  MATERIAL_URL,
} from '../constants'
import { axiosRequest, getData } from '../AxiosRequests'
import { getDisplayDateTime, getShortId } from '../Helper'
import ModalCreateEvent from '../ModalCreateEvent'
import { SubEventList } from '../Events'
import {
  getEvents,
  greaterEqual,
  greater,
  sortEventsFunction,
} from '../Timeline/timeline-helper'
import { connect } from 'react-redux'
import { axiosAddEntity, axiosUpdateEntity, getIRIFromAddResponse } from 'helperFunctions'
import DocumentReferencer from 'pages/documents/common/DocumentsReferencer'
class EventForm extends Component {
  constructor(props) {
    super(props)

    this.state = {
      ...INITIAL_EVENT_STATE,
      courseId: '',
      errors: [],
      users: [],
      docs: [],
      tasks: [],
      sessions: [],
    }
  }

  componentDidMount() {
    const {
      match: { params },
    } = this.props

    const { options } = this.props
    this.setState({ type: options[0] })

    this.setState({ ...this.props, courseId: params.course_id })

    this.getSubEvents()

    let url = BASE_URL + USER_URL
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

    url = BASE_URL + MATERIAL_URL
    axiosRequest('get', null, url).then(response => {
      const data = getData(response)
      if (data != null) {
        const docs = data.map(doc => {
          return {
            fullId: doc['@id'],
            name: doc.name,
          }
        })
        this.setState({
          docs,
        })
      }
    })
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (prevProps.name !== this.props.name) {
      //console.log(this.props)

      this.setState({ ...this.props })
    }
    if (
      prevState.startDate !== this.state.startDate ||
      prevState.endDate !== this.state.endDate
    ) {
      this.getSubEvents()
    }
  }

  getSubEvents = () => {
    const { startDate, endDate, courseId } = this.state

    if (courseId !== '') {
      const url = `${BASE_URL + EVENT_URL}?courseInstance=${courseId}&_join=documentReference`

      axiosRequest('get', null, url).then(response => {
        const data = getData(response)
        if (data != null && data !== []) {
          const events = getEvents(data).sort(sortEventsFunction)
          const tasks = []
          const sessions = []

          for (const event of events) {
            if (
              SESSIONS.includes(event.type) &&
              ((greaterEqual(event.startDate, startDate) &&
                !greaterEqual(event.startDate, startDate)) ||
                (greater(event.endDate, startDate) &&
                  !greater(event.endDate, endDate)))
            ) {
              event.displayDateTime = getDisplayDateTime(event.startDate, false)
              sessions.push(event)
            } else if (
              (TASKS_EXAMS.includes(event.type) &&
                greaterEqual(event.startDate, startDate) &&
                !greaterEqual(event.startDate, endDate)) ||
              (TASKS_DEADLINES.includes(event.type) &&
                greater(event.endDate, startDate) &&
                !greater(event.endDate, endDate))
            ) {
              if (TASKS_EXAMS.includes(event.type)) {
                event.displayDateTime = getDisplayDateTime(
                  event.startDate,
                  false
                )
              } else {
                event.displayDateTime = getDisplayDateTime(event.endDate, false)
              }
              tasks.push(event)
            }
          }

          this.setState({
            tasks,
            sessions,
          })
        }
      })
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
      courseId,
      instructors,
      uses,
      recommends,
      documentReference,
    } = this.state
    const { typeOfForm, callBack } = this.props

    const errors = this.validate(name, description, startDate, endDate)
    if (errors.length > 0) {
      this.setState({ errors })
      event.preventDefault()
      return
    }

    const courseInstanceFullId = [
      `http://www.courses.matfyz.sk/data${COURSE_INSTANCE_URL}/${courseId}`,
    ]
    const courseFullId = [
      `http://www.courses.matfyz.sk/data${COURSE_URL}/${courseId}`,
    ]

    //console.log(instructors)
    const hasInstructor = Array.isArray(instructors)
      ? instructors.map(instructor => {
          return instructor.fullId
        })
      : [instructors]

    const usedMaterials = uses.map(doc => {
      return doc.fullId
    })

    const recommendedMaterials = recommends.map(doc => {
      return doc.fullId
    })

    const typeLowerCase = this.lowerFirstLetter(type)
    let url = `${BASE_URL}/${typeLowerCase}/${id}`

    let method = 'patch'
    const data = {
      name: name.split('"').join("'"),
      description: description.split('"').join("'").split('\n').join(''),
      startDate,
      endDate,
      location: place.split('"').join("'"),
      uses: usedMaterials,
      recommends: recommendedMaterials,
      documentReference: documentReference.map(doc => doc["@id"])
    }

    if (type === 'CourseInstance') {
      data.hasInstructor = hasInstructor
    }
    if (typeOfForm === 'Create') {
      url = BASE_URL + EVENT_URL
      method = 'post'
      // eslint-disable-next-line no-underscore-dangle
      data._type = type
      data.courseInstance = courseInstanceFullId
    } else if (typeOfForm === 'New Course Instance') {
      url = BASE_URL + COURSE_INSTANCE_URL
      method = 'post'
      data.instanceOf = courseFullId
      data.hasInstructor = hasInstructor
    }
    axiosRequest(method, data, url)
      .then(async response => {
        if (response && response.status === 200) {
          console.log(typeOfForm)
          if (typeOfForm === 'Edit') {
            callBack(id)
          } else {
            const newEventId = getShortId(response.data.resource.iri)

            if (typeOfForm === 'New Course Instance') {
              const folderData = {
                name: 'Home',
                courseInstance: response.data.resource.iri,
              }
              const fileExplorerRoot = await axiosAddEntity(
                folderData,
                'folder'
              ).then(response => {
                if (response.failed) return null
                return getIRIFromAddResponse(response)
              })
              axiosUpdateEntity(
                { fileExplorerRoot },
                `courseInstance/${newEventId}`
              )
            }            

            callBack(newEventId)
          }
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

  lowerFirstLetter = s => {
    return s.charAt(0).toLowerCase() + s.slice(1)
  }

  validate = (name, description, startDate, endDate) => {
    const errors = []
    if (name.length === 0) {
      errors.push("Name can't be empty.")
    }
    if (description.length === 0) {
      errors.push("Description can't be empty.")
    }
    if (new Date(startDate) > new Date(endDate)) {
      errors.push('The End date must be greater than the Start date.')
    }
    return errors
  }

  deleteEvent = () => {
    const { type, id } = this.state
    const { callBack } = this.props

    const typeLowerCase = this.lowerFirstLetter(type)
    const url = `${BASE_URL}/${typeLowerCase}/${id}`

    axiosRequest('delete', null, url).then(response => {
      if (response && response.status === 200) {
        callBack(null)
      } else {
        const errors = []
        errors.push('There was a problem with server. Try again later.')
        this.setState({
          errors,
        })
      }
    })
  }

  onInstructorChange = (event, values) => {
    this.setState({ instructors: values })
  }

  onUsesChange = (event, values) => {
    this.setState({ uses: values })
  }

  onRecommendsChange = (event, values) => {
    this.setState({ recommends: values })
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

  onDocumentReferencesChange = documentReference => {
    this.setState({ documentReference })
  }

  render() {
    const {
      name,
      description,
      startDate,
      endDate,
      place,
      type,
      errors,
      users,
      instructors,
      tasks,
      sessions,
      docs,
      uses,
      recommends,
      documentReference
    } = this.state
    const { typeOfForm, options, from, to, user } = this.props

    const isInvalid =
      name === '' ||
      description === '' ||
      startDate === null ||
      endDate === null

    return (
      <>
        {errors.map(error => (
          <p key={error} className="form-error">
            Error: {error}
          </p>
        ))}
        <Form onSubmit={this.onSubmit}>
          <FormGroup className="new-event-formGroup">
            <Label for="name" className="new-event-label">
              Name *
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
              {options.map(option => (
                <option value={option} key={option}>
                  {option}
                </option>
              ))}
            </Input>
          </FormGroup>

          <FormGroup>
            <Container className="event-form-dateTime-container">
              <Row>
                <Col className="event-form-dateTime-col">
                  <Label
                    id="from-label"
                    for="from"
                    className="label-dateTime new-event-label"
                  >
                    From
                  </Label>
                  <DatePicker
                    name="from"
                    id="from"
                    selected={startDate}
                    onChange={this.handleChangeFrom}
                    minDate={from || ''}
                    maxDate={to || endDate}
                    showTimeSelect
                    timeFormat="HH:mm"
                    timeIntervals={15}
                    dateFormat="dd/MM/yyyy HH:mm"
                    timeCaption="time"
                  />
                </Col>
                <Col className="event-form-dateTime-col">
                  <Label for="to" className="label-dateTime new-event-label">
                    To
                  </Label>
                  <DatePicker
                    name="to"
                    id="to"
                    selected={endDate}
                    onChange={this.handleChangeTo}
                    minDate={from || startDate}
                    maxDate={to || ''}
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
              Description *
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

          <FormGroup 
              style={{ maxWidth: 700 }} className="new-event-formGroup">
            <DocumentReferencer
              label="Uses documents"
              documentReferences={documentReference}
              onDocumentReferencesChange={this.onDocumentReferencesChange}
            />
          </FormGroup>

          <FormGroup className="new-event-formGroup">
            <Label
              id="usesMaterials"
              for="usesMaterials"
              className="new-event-label"
            >
              Used Materials
            </Label>
            <Autocomplete
              multiple
              name="usesMaterials"
              id="usesMaterials"
              options={docs}
              getOptionLabel={option => option.name}
              onChange={this.onUsesChange}
              value={uses}
              style={{ minWidth: 200, maxWidth: 700 }}
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

          <FormGroup className="new-event-formGroup">
            <Label
              id="recommendsMaterials"
              for="recommendsMaterials"
              className="new-event-label"
            >
              Recommended Materials
            </Label>
            <Autocomplete
              multiple
              name="recommendsMaterials"
              id="recommendsMaterials"
              options={docs}
              getOptionLabel={option => option.name}
              onChange={this.onRecommendsChange}
              value={recommends}
              style={{ minWidth: 200, maxWidth: 700 }}
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

          {type === 'Block' && (
            <SubEvents
              sessions={sessions}
              tasks={tasks}
              from={startDate}
              to={endDate}
              typeOfForm={typeOfForm}
              callBack={this.getSubEvents}
            />
          )}

          {type === 'CourseInstance' &&
            user != null &&
            (instructors.findIndex(i => i.fullId === user.fullURI) === -1 ||
              user.isSuperAdmin) && (
              <FormGroup className="new-event-formGroup">
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
                  style={{ minWidth: 200, maxWidth: 700 }}
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
            )}

          <div className="button-container">
            <Button
              className="new-event-button"
              disabled={isInvalid}
              type="submit"
            >
              {typeOfForm}
            </Button>
            {typeOfForm === 'Edit' && type !== 'CourseInstance' && (
              <Button
                className="new-event-button"
                onClick={e => this.deleteEvent()}
              >
                Delete
              </Button>
            )}
          </div>
        </Form>
      </>
    )
  }
}

const SubEvents = ({ sessions, tasks, from, to, typeOfForm, callBack }) => (
  <div className="sessions-tasks-container">
    <div className="subevents-col-left">
      <CardSubtitle className="subevents-title">Sessions</CardSubtitle>
      <SubEventList events={sessions} />
      {typeOfForm === 'Edit' && (
        <div className="button-container">
          <ModalCreateEvent from={from} to={to} callBack={callBack} />
        </div>
      )}
    </div>
    <div
      className={
        typeOfForm === 'Edit'
          ? 'subevents-col-right subevents-col-right-w-button'
          : 'subevents-col-right'
      }
    >
      <CardSubtitle className="subevents-title">Tasks</CardSubtitle>
      <SubEventList events={tasks} />
    </div>
  </div>
)

const mapStateToProps = ({ authReducer }) => {
  return {
    user: authReducer.user,
  }
}

export default compose(withRouter, connect(mapStateToProps))(EventForm)
