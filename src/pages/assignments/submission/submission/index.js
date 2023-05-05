import React, { useState, useEffect } from 'react'
import { Button, FormGroup, Label, Input, FormText, Alert } from 'reactstrap'
import classnames from 'classnames'
import { connect } from 'react-redux'
import {
  getShortID,
  periodHasEnded,
  periodStarted,
  prepareMultiline,
  htmlRemoveNewLines,
  periodHappening,
} from 'helperFunctions'
import SubmissionForm from './form'
import SubmissionView from './view'
import Slider from 'components/slider'
import { useGetMaterialQuery } from 'services/documents'
import { useLazyGetTeamQuery } from 'services/teamGraph'
import { 
  useNewSubmittedFieldMutation,
  useNewSubmissionMutation,
  useUpdateSubmittedFieldMutation,
  useUpdateSubmissionMutation
} from 'services/assignmentsGraph'
import { useLazyGetUserQuery } from 'services/user'

function Submission(props) {
  const { assignment, settings, improvedSubmission, initialSubmission } = props
  const [submission, setSubmission] = useState(getSubmissionByState(props))
  const [data, setData] = useState(null)
  const [initialData, setInitialData] = useState(null)
  const [improvedData, setImprovedData] = useState(null)
  const [materials, setMaterials] = useState([])

  const [savingSubmission, setSavingSubmission] = useState(false)
  const [savedSubmission, setSavedSubmission] = useState(false)
  const [showOldSubmission, setShowOldSubmission] = useState(true)

  const [hasTeacherComment, setHasTeacherComment] = useState(getHasTeacherComment(submission))
  const [teacherRating, setTeacherRating] = useState(getTeacherRating(submission))
  const [savingScore, setSavingScore] = useState(false)
  const [submissionBy, setSubmissionBy] = useState('')

  const [getUser, getUserResult] = useLazyGetUserQuery()
  const [addSubmittedField, addSubmittedFieldResult] = useNewSubmittedFieldMutation()
  const [addSubmission, addSubmissionResult] = useNewSubmissionMutation()
  const [updateSubmittedField, updateSubmittedFieldResult] = useUpdateSubmittedFieldMutation()
  const [updateSubmission, updateSubmissionResult] = useUpdateSubmissionMutation()
  const [getTeam] = useLazyGetTeamQuery()

  const studentSubmitting =
      settings.myAssignment &&
      (periodHappening(assignment.initialSubmissionPeriod) ||
        (assignment.submissionImprovedSubmission &&
          periodHappening(assignment.improvedSubmissionPeriod)))
    const initialSubmissionOpened =
      studentSubmitting && periodHappening(assignment.initialSubmissionPeriod)
    const studentViewing = !studentSubmitting && !settings.isInstructor
    const instructorViewing = settings.isInstructor
    const showStudentBoth =
      assignment.submissionImprovedSubmission &&
      periodStarted(assignment.improvedSubmissionPeriod)
    const showViewerBoth =
      assignment.submissionImprovedSubmission &&
      periodHasEnded(assignment.improvedSubmissionPeriod)

  //ComponentWillReceiveProps
  useEffect( () => {
    loadForms(props)
    if (props.initialSubmission !== null 
        || props.improvedSubmission !== null) {
      setSubmission(getSubmissionByState(props))
      props.refreshAssignment()
      setSavingSubmission(false)
      setSavedSubmission(true)
      this.setState({ savingSubmission: false, savedSubmission: true })
      setTimeout(() => {
        setSavedSubmission(false)
      }, 3000)
    }
  }, [props.assignment, props.initialSubmission, props.improvedSubmission])

  //ComponentWillMount
  useEffect( () => {
    loadForms()
    fetchMaterials()

    if (props.settings.isInstructor) {
      fetchSubmissionBy()
    }
  }, []);

  const loadForm = (initial) => {
    props.refreshAssignment()

    let data = props.assignment.hasField.map(type => ({
      type,
      value: getTypeDefaultValue(type),
      error: false,
      exists: false,
    }))
    let existingResource = null
    if (!initial && props.improvedSubmission !== null) {
      existingResource = props.improvedSubmission.submittedField
    } else if (
      (initial || props.improvedSubmission === null) &&
      props.initialSubmission !== null
    ) {
      existingResource = props.initialSubmission.submittedField
    }
    if (existingResource !== null) {
      existingResource.forEach(submittedField => {
        let field = data.find(
          field =>
            field.type['_id'] === submittedField.field ||
            field.type['_id'] === submittedField.field[0]['_id']
        )
        if (field !== undefined) {
          field.value = submittedField.value
          field.exists = true
          field.fieldID = submittedField['_id']
        }
      })
    }
    return data
  }

  const loadForms = () => {
    const initialData = loadForm(true)
    const improvedData = loadForm(false)
    const isInitial =
      props.settings.myAssignment &&
      periodHappening(props.assignment.initialSubmissionPeriod)
    setData(isInitial ? initialData : improvedData)
    setInitialData(initialData)
    setImprovedData(improvedData)
  }

  const fetchMaterials = () => {
    let materials = []
    props.assignment.hasMaterial.forEach(material => {
      const {data: materialData, isSuccess: materialDataIsSuccess} = useGetMaterialQuery(getShortID(material['_id']))
      if(materialDataIsSuccess && materialData) {
        materials.push(materialData[0])
      }
    })
    setMaterials(materials)
  }

  const fetchSubmissionBy = () => {
    const ID =
      props.initialSubmission.submittedByStudent[0]['_id'] ||
      props.improvedSubmission.submittedByStudent[0]['_id']
    // const ID = this.props.match.params.targetID || 'dvyaa'
    if(props.settings.teamAssignment) {
      getTeam({id: ID}).unwrap().then(teamData => {
        setSubmissionBy(`${teamData[0].name}`)
      }) 
    } else {
      getUser({
        id: ID
      }).unwrap().then(response => {
        if (getUserResult.isSuccess && response) {
          setSubmissionBy(`${response[0].firstName} ${response[0].lastName}`)
        }
      })
    }
  }

  const onSubmit = () => {
    const filteredData = getFilteredData(data)
    if (!periodHappening(assignment.initialSubmissionPeriod) 
        && !(assignment.submissionImprovedSubmission 
             && periodHappening(assignment.improvedSubmissionPeriod))) {
      return
    }
    setSavingSubmission(true)

    let update = getUpdate(assignment, props)
    if (update === null) {
      const submittedField = []
      filteredData.forEach(field =>
        addSubmittedField({ 
          field: field.type['_id'], 
          value: field.value 
        }).unwrap().then(response => {
          submittedField.push(response.data.resource.iri)
        })
      )

      let newSubmission = {
        ofAssignment: assignment['_id'],
        submittedField,
        isImproved:
          assignment.submissionImprovedSubmission &&
          periodHappening(assignment.improvedSubmissionPeriod),
      }
      if (props.settings.teamAssignment) {
        newSubmission.submittedByTeam = props.teams.find(
          team => getShortID(team['_id']) === props.match.params.teamID
        )['_id']
      } else {
        newSubmission.submittedByStudent = props.user.fullURI
      }
      addSubmission(newSubmission).unwrap().then(response => {
        props.refreshAssignment()
      })
    } else {
      const submittedField = []
      filteredData.filter(field => !field.exists)
        .forEach(field => {
          addSubmittedField({ 
            field: field.type['_id'], 
            value: field.value 
          }).unwrap().then(response => {
            submittedField.push(response.data.resource.iri)
          })
      })
      filteredData.filter(field => field.exists)
        .forEach(field => {
          updateSubmittedField({
            id: getShortID(field.fieldID),
            body: { value: field.value }
          }).unwrap().then(response => {
            submittedField.push(response.data.resource.iri)
          })
      })
      if (submittedField.length !== 0) {
        updateSubmission({
          id: getShortID(update),
          body: submittedField
        }).unwrap().then(response => {
          props.refreshAssignment()
          setSavingSubmission(false)
          setSavedSubmission(true)
          setTimeout(() => {
            setSavedSubmission(false)
          }, 3000)
        })
      } else {
        setSavingSubmission(false)
        setSavedSubmission(true)
        setTimeout(() => {
          setSavedSubmission(false)
        }, 3000)
      }
    }
  }

  const saveTeacherRating = () => {
    if (!props.settings.isInstructor || submission === null) {
      return
    }
    setSavingScore(true)
    updateSubmission({
      id: getShortID(submission['_id']),
      body: {
        teacherRating: teacherRating,
        hasTeacherComment: hasTeacherComment,
      }
    }).unwrap().then(response => {
      setSavingScore(false)
    })
  }

  if (
    instructorViewing &&
    !periodHasEnded(assignment.initialSubmissionPeriod)
  ) {
    return (
      <Alert color="danger" className="mt-3">
        Initial submission has not ended yet.
      </Alert>
    )
  }
  if (studentViewing && !periodStarted(assignment.initialSubmissionPeriod)) {
    return (
      <Alert color="danger" className="mt-3">
        Submissions are not open yet.
      </Alert>
    )
  }

  return (
    <div className="submissionContainer">
      <Alert
        style={{ marginTop: '20px' }}
        isOpen={savedSubmission}
      >
        Submission was saved successfully.
      </Alert>
      {instructorViewing &&
        !periodHasEnded(assignment.initialSubmissionPeriod) && (
          <Alert color="danger" className="mt-3">
            Initial submission has not ended yet.
          </Alert>
        )}
      <h3>Assignment</h3>
      {instructorViewing && (
        <Label>{settings.teamAssignment ? 'Team' : 'Student'}:</Label>
      )}{' '}
      {submissionBy}
      {settings.myAssignment &&
        submission !== null &&
        submission.teacherRating !== undefined && (
          <>
            <Label>Score:</Label> {` ${teacherRating} points`}
            <FormGroup>
              <Label for="teacherComment">Instructor's comment</Label>
              <div
                dangerouslySetInnerHTML={{
                  __html: hasTeacherComment.replace(
                    /(?:\r\n|\r|\n)/g,
                    '<br>'
                  ),
                }}
              />
            </FormGroup>
          </>
        )}
      <FormText color="muted">
        <div
          dangerouslySetInnerHTML={{ __html: assignment.shortDescription }}
        />
      </FormText>
      <div dangerouslySetInnerHTML={{ __html: assignment.description }} />
      <hr />
      <h4>Documents</h4>
      {materials
        .filter(material => material.URL !== undefined)
        .map(material => (
          <div key={material['_id']}>
            <a
              href={material.URL}
              target="_blank"
              without="true"
              rel="noopener noreferrer"
            >
              <Label className="clickable">{material.name}</Label>
            </a>
          </div>
        ))}
      <hr />
      {/*
        ak je moj a initial otvoreny, je len jeden
        aj je moj a improved otvoreny, jeden zobrazit a jeden form

        ak je cudzi zobrazit len ukoncene, oboje alebo jeden
        */}
      {settings.myAssignment && (
        <>
          <h3 className="row flex">
            <span>Submissions</span>
            {showStudentBoth && (
              <Button
                color="link"
                className="ml-auto"
                onClick={() =>
                  setShowOldSubmission(!showOldSubmission)
                }
              >
                {showOldSubmission
                  ? 'Hide old submission'
                  : 'Show old submission'}
              </Button>
            )}
          </h3>
          <div className="row">
            <div
              className={classnames({
                'col-6': showStudentBoth && showOldSubmission,
                'col-12': !showStudentBoth || !showOldSubmission,
              })}
            >
              {studentSubmitting && (
                <SubmissionForm
                  assignment={assignment}
                  settings={settings}
                  isInitial={!showStudentBoth}
                  improvedSubmission={improvedSubmission}
                  initialSubmission={initialSubmission}
                  fields={data}
                  onChange={newField => {
                    let newData = [...data]
                    const index = newData.findIndex(
                      oldField =>
                        oldField.type['_id'] === newField.type['_id']
                    )
                    newData[index] = newField
                    setData(newData)
                  }}
                  saving={savingSubmission}
                  onSubmit={onSubmit}
                />
              )}
              {!studentSubmitting && (
                <SubmissionView
                  assignment={assignment}
                  isInitial={!showViewerBoth}
                  settings={settings}
                  improvedSubmission={improvedSubmission}
                  initialSubmission={initialSubmission}
                  fields={
                    showStudentBoth
                      ? improvedData
                      : initialData
                  }
                />
              )}
            </div>
            {!initialSubmissionOpened &&
              showStudentBoth &&
              showOldSubmission && (
                <div className="col-6">
                  <SubmissionView
                    assignment={assignment}
                    isInitial={true}
                    settings={settings}
                    improvedSubmission={improvedSubmission}
                    initialSubmission={initialSubmission}
                    fields={initialData}
                  />
                </div>
              )}
          </div>
        </>
      )}
      {!settings.myAssignment && (
        <>
          <h3 className="row flex">
            <span>Submissions</span>
            {showViewerBoth && (
              <Button
                color="link"
                className="ml-auto"
                onClick={() =>
                  setShowOldSubmission(!showOldSubmission)
                }
              >
                {showOldSubmission
                  ? 'Hide old submission'
                  : 'Show old submission'}
              </Button>
            )}
          </h3>
          <div className="row">
            <div
              className={classnames({
                'col-6': showViewerBoth && showOldSubmission,
                'col-12': !showViewerBoth || !showOldSubmission,
              })}
            >
              <SubmissionView
                assignment={assignment}
                isInitial={!showViewerBoth}
                settings={settings}
                improvedSubmission={improvedSubmission}
                initialSubmission={initialSubmission}
                fields={
                  showViewerBoth
                    ? improvedData
                    : initialData
                }
              />
            </div>
            {showViewerBoth && showOldSubmission && (
              <div className="col-6">
                <SubmissionView
                  assignment={assignment}
                  isInitial={true}
                  settings={settings}
                  improvedSubmission={improvedSubmission}
                  initialSubmission={initialSubmission}
                  fields={initialData}
                />
              </div>
            )}
          </div>
          {instructorViewing &&
            periodHasEnded(assignment.initialSubmissionPeriod) &&
            (!assignment.submissionImprovedSubmission ||
              periodHasEnded(assignment.improvedSubmissionPeriod)) && (
              <div>
                <FormGroup>
                  <Label>Score ({teacherRating})</Label>
                  <Slider
                    min={0}
                    max={10}
                    value={teacherRating}
                    onChange={teacherRating =>
                      setTeacherRating(teacherRating)
                    }
                  />
                </FormGroup>
                <FormGroup>
                  <Label for="teacherComment">Comment</Label>
                  <Input
                    type="textarea"
                    id="teacherComment"
                    value={hasTeacherComment}
                    onChange={e =>
                      setHasTeacherComment(e.target.value)
                    }
                    placeholder="Enter voluntary comment for this submission"
                  />
                </FormGroup>
                <Button
                  color="primary"
                  disabled={savingScore}
                  onClick={saveTeacherRating}
                >
                  {savingScore ? 'Saving score' : 'Save score'}
                </Button>
              </div>
            )}
        </>
      )}
    </div>
  )
}

const getSubmissionByState = (props) => {
  if (props.initialSubmission !== null) {
    return props.initialSubmission
  } else if (props.improvedSubmission !== null) {
    return props.improvedSubmission
  }
}

const getHasTeacherComment = (submission) => {
  if (submission === null || submission.hasTeacherComment === undefined) {
    return ''
  } else {
    return submission.hasTeacherComment
  }
}

const getTypeDefaultValue = (type) => {
  if (type.fieldType === 'codeReview' || type.fieldType === 'file') {
    return null
  }
  return ''
}

const getTeacherRating = (submission) => {
  if (submission === null || submission.teacherRating === undefined) {
    return 10
  } else {
    return submission.teacherRating
  }
}

const getFilteredData = (data) => {
  return data.filter(field => !['file'].includes(field.type.fieldType))
              .map(field => {
                if (field.type.fieldType === 'text area') {
                  return {
                    ...field,
                    value: prepareMultiline(field.value),
                  }
                } else if (field.type.fieldType === 'Rich text') {
                  return {
                    ...field,
                    value: htmlRemoveNewLines(field.value),
                  }
                }
                return field
              })
}

const getUpdate = (assignment, props) => {
  if (periodHappening(assignment.initialSubmissionPeriod) 
      && props.initialSubmission) {
    return props.initialSubmission['_id']
  } else if (assignment.submissionImprovedSubmission 
            && periodHappening(assignment.improvedSubmissionPeriod) 
            && props.improvedSubmission) {
    return props.improvedSubmission['_id']
  }
  return null
}

const mapStateToProps = ({
  assignCourseInstanceReducer,
  authReducer,
  assignStudentDataReducer,
}) => {
  const { user } = authReducer
  const { teams } = assignStudentDataReducer
  return {
    user,
    teams,
  }
}

export default connect(mapStateToProps, {})(Submission)
