import React, { useState, useEffect } from 'react'
import { withRouter } from 'react-router-dom'
import { compose } from 'recompose'
import { Button, CardSubtitle, Col, Container, Form, FormGroup, Input, Label, Row, } from 'reactstrap'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import './EventForm.css'
import TextField from '@material-ui/core/TextField'
import Autocomplete from '@material-ui/lab/Autocomplete'
import { DATA_PREFIX } from 'constants/ontology'
import {
  COURSE_INSTANCE_URL,
  COURSE_URL,
  SESSIONS,
  TASKS_DEADLINES,
  TASKS_EXAMS,
} from '../constants'
import { getDisplayDateTime, getShortId } from '../Helper'
import ModalCreateEvent from '../ModalCreateEvent'
import { SubEventList } from '../Events'
import { getEvents, greater, greaterEqual, sortEventsFunction, } from '../Timeline/timeline-helper'
import { connect } from 'react-redux'
import { getFullID, getIRIFromAddResponse } from 'helperFunctions'
import DocumentReferencer from 'pages/documents/common/DocumentsReferencer'
import { useLazyGetEventQuery, useNewEventByTypeMutation } from 'services/event'
import { useDeleteEventByTypeMutation, useUpdateEventByTypeMutation } from 'services/event'
import { useUpdateCourseInstanceMutation } from 'services/course'
import { useNewCourseInstanceMutation } from 'services/courseTmp'
import { useNewFolderMutation, useGetMaterialsQuery } from 'services/documents'
import { useGetUserQuery } from 'services/user'

function EventForm(props) {
  const {
    typeOfForm, 
    callBack,
    options, 
    from, 
    to, 
    user,
    match: {params},
  } = props
  const courseId = params.course_id
  //Event state
  const [id, setId] = useState('')
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [startDate, setStartDate] = useState(new Date())
  const [endDate, setEndDate] = useState(new Date())
  const [place, setPlace] = useState('')
  const [type, setType] = useState(options[0])
  const [instructors, setInstructors] = useState([])
  const [uses, setUses] = useState([])
  const [recommends, setRecommends] = useState([])
  const [documentReference, setDocumentReference] = useState([])

  const [errors, setErrors] = useState([])
  const [tasks, setTasks] = useState([])
  const [sessions, setSessions] = useState([])
  const [getEventRequest] = useLazyGetEventQuery()
  const {data: usersData, isSuccess: usersIsSuccess} = useGetUserQuery({})
  const {data: materialsData, isSuccess: materialsIsSuccess} = useGetMaterialsQuery()
  const [newEvent, newEventResult] = useNewEventByTypeMutation()
  const [newNewCourseInstance, newNewCourseInstanceResult] = useNewCourseInstanceMutation()
  const [newFolder, newFolderResult] = useNewFolderMutation()
  const [updateCourseInstance, updateCourseInstanceResult] = useUpdateCourseInstanceMutation()
  const [updateEventByType, updateEventByTypeResult] = useUpdateEventByTypeMutation()
  const [deleteEventByType, deleteEventByTypeResult] = useDeleteEventByTypeMutation()

  let users = []
  if(usersIsSuccess && usersData) {
    users = usersData.map(user => {
      return {
        fullId: user['_id'],
        name:
          user.firstName !== '' && user.lastName !== ''
            ? `${ user.firstName } ${ user.lastName }`
            : 'Noname',
      }
    })
  }

  let docs = []
  if(materialsIsSuccess && materialsData) {
    docs = materialsData.map(doc => {
      return {
        fullId: doc['_id'],
        name: doc.name,
      }
    })
  }


  // This does the same thing as componentDidMount
  useEffect(() => {
    getSubEvents()
  }, [])

  const getSubEvents = () => {
    if (courseId !== '') {
      getEventRequest({courseInstanceId: getFullID(courseId, "courseInstance")}).unwrap().then(subEventsData => {
        if(subEventsData && subEventsData !== []) {
          const events = getEvents(subEventsData).sort(sortEventsFunction)
          const newTasks = []
          const newSessions = []
  
          for (const event of events) {
            if (isEventInSession(event, startDate, endDate)) {
              event.displayDateTime = getDisplayDateTime(event.startDate, false)
              newSessions.push(event)
            } else if (isEventInTask(event, startDate, endDate)) {
              if(TASKS_EXAMS.includes(event.type)) {
                event.displayDateTime = getDisplayDateTime(
                  event.startDate,
                  false
                )
              } else {
                event.displayDateTime = getDisplayDateTime(event.endDate, false)
              }
              newTasks.push(event)
            }
          }
          setTasks(newTasks)
          setSessions(newSessions)
        }
      })
    }
  }

  const onSubmit = event => {
    event.preventDefault()
    const newErrors = validate(name, description, startDate, endDate)
    if(newErrors.length > 0) {
      setErrors(newErrors)
      return
    }

    const courseInstanceFullId = [
      `${ DATA_PREFIX }${ COURSE_INSTANCE_URL }/${ courseId }`,
    ]
    const courseFullId = [
      `${ DATA_PREFIX }${ COURSE_URL }/${ courseId }`,
    ]

    const hasInstructor = Array.isArray(instructors)
      ? instructors.map(instructor => {
        return instructor.fullId
      })
      : [ instructors ]

    const usedMaterials = uses.map(doc => {
      return doc.fullId
    })

    const recommendedMaterials = recommends.map(doc => {
      return doc.fullId
    })

    const typeLowerCase = lowerFirstLetter(type)
    const data = {
      name: name.split('"').join("'"),
      description: description.split('"').join("'").split('\n').join(''),
      startDate,
      endDate,
      location: place.split('"').join("'"),
      uses: usedMaterials,
      recommends: recommendedMaterials,
      documentReference: documentReference.map(doc => doc["_id"])
    }

    if(type === 'CourseInstance') {
      data.hasInstructor = hasInstructor
    }
    if(typeOfForm === 'Create') {
      // eslint-disable-next-line no-underscore-dangle
      data.courseInstance = courseInstanceFullId
      
      newEvent({type, body: data}).unwrap().then(response => {
        const newEventId = response["_id"]
        callBack(newEventId)
      }).catch(error => {
        newErrors.push('There was a problem with server while sending your form. Try again later.')
        setErrors(newErrors)
      })
    } else if(typeOfForm === 'New Course Instance') {
      data.instanceOf = courseFullId
      data.hasInstructor = hasInstructor
      newNewCourseInstance(data).unwrap().then(response => {
        const newEventId = getShortId(response.resource.iri)
        const folderData = {
          name: 'Home',
          courseInstance: response.resource.iri,
        }
        
        newFolder(folderData).unwrap().then(folderResponse => {
          const fileExplorerRoot = folderResponse.resource.iri
          updateCourseInstance({id: response.resource.iri, body: {fileExplorerRoot: fileExplorerRoot}}).unwrap()
        })
        callBack(newEventId)
      }).catch(error => {
        console.log(error)
        newErrors.push('There was a problem with server while sending your form. Try again later.')
        setErrors(newErrors)
      })
    } else {
      updateEventByType({
        id,
        type: typeLowerCase,
        body: data
      }).unwrap().then(response => {
        if (typeOfForm === 'Edit') {
          callBack(id)
        } else {
          const newEventId = response[type]["_id"]
          callBack(newEventId)
        }
      }).catch(error => {
        newErrors.push('There was a problem with server while sending your form. Try again later.')
        setErrors(newErrors)
      })
    }
  }

  const deleteEvent = () => {
    console.log("FAF")
    const typeLowerCase = lowerFirstLetter(type)
    deleteEventByType({id: id, type: typeLowerCase}).unwrap().then(response => {
      callBack(null)
    }).catch(error => {
      const newErrors = []
      newErrors.push('There was a problem with server while sending your form. Try again later.')
      setErrors(newErrors)
    })
  }

  const onInstructorChange = (event, values) => {
    setInstructors(values)
  }

  const onDocumentReferencesChange = documentReference => {
    setDocumentReference(documentReference)
  }

  const handleChangeFrom = date => {
    setStartDate(date)
  }

  const handleChangeTo = date => {
    setEndDate(date)
  }

  const isInvalid =
      name === '' ||
      description === '' ||
      startDate === null ||
      endDate === null

  return (
    <>
      { errors.map(error => (
        <p key={ error } className="form-error">
          Error: { error }
        </p>
      )) }
      <Form onSubmit={ onSubmit }>
        <FormGroup className="new-event-formGroup">
          <Label for="name" className="new-event-label">
            Name *
          </Label>
          <Input
            name="name"
            id="name"
            value={ name }
            onChange={ e => setName(e.target.value) }
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
            value={ type }
            onChange={ e => setType(e.target.value) }
          >
            { options.map(option => (
              <option value={ option } key={ option }>
                { option }
              </option>
            )) }
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
                  selected={ startDate }
                  onChange={ handleChangeFrom }
                  minDate={ from || '' }
                  maxDate={ to || endDate }
                  showTimeSelect
                  timeFormat="HH:mm"
                  timeIntervals={ 15 }
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
                  selected={ endDate }
                  onChange={ handleChangeTo }
                  minDate={ from || startDate }
                  maxDate={ to || '' }
                  showTimeSelect
                  timeFormat="HH:mm"
                  timeIntervals={ 15 }
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
            value={ description }
            onChange={ e => setDescription(e.target.value) }
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
            value={ place }
            onChange={ e => setPlace(e.target.value) }
            type="text"
          />
        </FormGroup>

        {['Create', 'Edit'].includes(typeOfForm) && (
          <FormGroup
              style={{ maxWidth: 700 }} className="new-event-formGroup">
            <DocumentReferencer
              label="Uses documents"
              documentReferences={documentReference}
              onDocumentReferencesChange={onDocumentReferencesChange}
            />
          </FormGroup>
        )}

        {/*<FormGroup className="new-event-formGroup">*/}
        {/*  <Label*/}
        {/*    id="usesMaterials"*/}
        {/*    for="usesMaterials"*/}
        {/*    className="new-event-label"*/}
        {/*  >*/}
        {/*    Used Materials*/}
        {/*  </Label>*/}
        {/*  <Autocomplete*/}
        {/*    multiple*/}
        {/*    name="usesMaterials"*/}
        {/*    id="usesMaterials"*/}
        {/*    options={docs}*/}
        {/*    getOptionLabel={option => option.name}*/}
        {/*    onChange={this.onUsesChange}*/}
        {/*    value={uses}*/}
        {/*    style={{ minWidth: 200, maxWidth: 700 }}*/}
        {/*    renderInput={params => (*/}
        {/*      <TextField*/}
        {/*        {...params}*/}
        {/*        placeholder=""*/}
        {/*        InputProps={{*/}
        {/*          ...params.InputProps,*/}
        {/*          disableUnderline: true,*/}
        {/*        }}*/}
        {/*      />*/}
        {/*    )}*/}
        {/*  />*/}
        {/*</FormGroup>*/}

        {/*<FormGroup className="new-event-formGroup">*/}
        {/*  <Label*/}
        {/*    id="recommendsMaterials"*/}
        {/*    for="recommendsMaterials"*/}
        {/*    className="new-event-label"*/}
        {/*  >*/}
        {/*    Recommended Materials*/}
        {/*  </Label>*/}
        {/*  <Autocomplete*/}
        {/*    multiple*/}
        {/*    name="recommendsMaterials"*/}
        {/*    id="recommendsMaterials"*/}
        {/*    options={docs}*/}
        {/*    getOptionLabel={option => option.name}*/}
        {/*    onChange={this.onRecommendsChange}*/}
        {/*    value={recommends}*/}
        {/*    style={{ minWidth: 200, maxWidth: 700 }}*/}
        {/*    renderInput={params => (*/}
        {/*      <TextField*/}
        {/*        {...params}*/}
        {/*        placeholder=""*/}
        {/*        InputProps={{*/}
        {/*          ...params.InputProps,*/}
        {/*          disableUnderline: true,*/}
        {/*        }}*/}
        {/*      />*/}
        {/*    )}*/}
        {/*  />*/}
        {/*</FormGroup>*/}

        { type === 'Block' && (
          <SubEvents
            sessions={ sessions }
            tasks={ tasks }
            from={ startDate }
            to={ endDate }
            typeOfForm={ typeOfForm }
            callBack={ getSubEvents }
          />
        ) }

        { type === 'CourseInstance' &&
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
                options={ users }
                getOptionLabel={ option => option.name }
                onChange={ onInstructorChange }
                value={ instructors }
                style={ {minWidth: 200, maxWidth: 700} }
                renderInput={ params => (
                  <TextField
                    { ...params }
                    placeholder=""
                    InputProps={ {
                      ...params.InputProps,
                      disableUnderline: true,
                    } }
                  />
                ) }
              />
            </FormGroup>
          ) }

        <div className="button-container">
          <Button
            className="new-event-button"
            disabled={ isInvalid }
            type="submit"
          >
            { typeOfForm }
          </Button>
          { typeOfForm === 'Edit' && type !== 'CourseInstance' && (
            <Button
              className="new-event-button"
              onClick={ e => deleteEvent() }
            >
              Delete
            </Button>
          ) }
        </div>
      </Form>
    </>
  )
} 

const SubEvents = ({sessions, tasks, from, to, typeOfForm, callBack}) => (
  <div className="sessions-tasks-container">
    <div className="subevents-col-left">
      <CardSubtitle className="subevents-title">Sessions</CardSubtitle>
      <SubEventList events={ sessions }/>
      { typeOfForm === 'Edit' && (
        <div className="button-container">
          <ModalCreateEvent from={ from } to={ to } callBack={ callBack }/>
        </div>
      ) }
    </div>
    <div
      className={
        typeOfForm === 'Edit'
          ? 'subevents-col-right subevents-col-right-w-button'
          : 'subevents-col-right'
      }
    >
      <CardSubtitle className="subevents-title">Tasks</CardSubtitle>
      <SubEventList events={ tasks }/>
    </div>
  </div>
)

const validate = (name, description, startDate, endDate) => {
  const errors = []
  if(name.length === 0) {
    errors.push("Name can't be empty.")
  }
  if(description.length === 0) {
    errors.push("Description can't be empty.")
  }
  if(new Date(startDate) > new Date(endDate)) {
    errors.push('The End date must be greater than the Start date.')
  }
  return errors
}

const lowerFirstLetter = s => {
  return s.charAt(0).toLowerCase() + s.slice(1)
}

const isEventInSession = (event, startDate, endDate) => {
  return SESSIONS.includes(event.type) 
          && ((greaterEqual(event.startDate, startDate) 
                  && !greaterEqual(event.startDate, startDate)) 
              || (greater(event.endDate, startDate) 
                  && !greater(event.endDate, endDate))
              )
}

const isEventInTask = (event, startDate, endDate) => {
  return (TASKS_EXAMS.includes(event.type) 
            && greaterEqual(event.startDate, startDate) 
            && !greaterEqual(event.startDate, endDate)) 
      || (TASKS_DEADLINES.includes(event.type) 
            && greater(event.endDate, startDate) 
            && !greater(event.endDate, endDate))
}

const mapStateToProps = ({authReducer}) => {
  return {
    user: authReducer.user,
  }
}

export default compose(withRouter, connect(mapStateToProps))(EventForm)
