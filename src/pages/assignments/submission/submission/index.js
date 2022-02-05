import React, { Component } from 'react'
import { Button, FormGroup, Label, Input, FormText, Alert } from 'reactstrap'
import classnames from 'classnames'
import { connect } from 'react-redux'

import {
  sameStringForms,
  axiosGetEntities,
  axiosAddEntity,
  axiosUpdateEntity,
  getResponseBody,
  getIRIFromAddResponse,
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

class Submission extends Component {
  constructor(props) {
    super(props)

    this.setSubmission.bind(this)
    this.setSubmission(props)
    this.state = {
      data: null,

      initialData: null,
      improvedData: null,

      materials: [],

      savingSubmission: false,
      showOldSubmission: true,

      hasTeacherComment:
        this.submission === null ||
        this.submission.hasTeacherComment === undefined
          ? ''
          : this.submission.hasTeacherComment,
      teacherRating:
        this.submission === null || this.submission.teacherRating === undefined
          ? 10
          : this.submission.teacherRating,
      savingScore: false,

      submissionBy: '',
    }
    this.loadForm.bind(this)
  }

  setSubmission(props) {
    this.submission = null
    if (props.initialSubmission !== null) {
      this.submission = props.initialSubmission
    } else if (props.improvedSubmission !== null) {
      this.submission = props.improvedSubmission
    }
  }

  componentWillReceiveProps(props) {
    if (
      !sameStringForms(props.assignment, this.props.assignment) ||
      !sameStringForms(this.props.initialSubmission, props.initialSubmission) ||
      !sameStringForms(this.props.improvedSubmission, props.improvedSubmission)
    ) {
      this.loadForms(props)
    }
    if (
      (this.props.initialSubmission === null &&
        props.initialSubmission !== null) ||
      (this.props.improvedSubmission === null &&
        props.improvedSubmission !== null)
    ) {
      this.setSubmission(props)
      this.setState({ savingSubmission: false })
    }
  }

  loadForm(initial, props) {
    console.log('PROPS:', props)
    props.refreshAssignment()
    console.log('PROPS:', props)
    let data = props.assignment.hasField.map(type => ({
      type,
      value: this.getTypeDefaultValue(type),
      error: false,
      exists: false,
    }))
    // let existingResource = null
    // if (!initial && props.improvedSubmission !== null) {
    //   existingResource = props.improvedSubmission.submittedField
    //   console.log('1:', existingResource)
    // } else if (
    //   (initial || props.improvedSubmission === null) &&
    //   props.initialSubmission !== null
    // ) {
    //   existingResource = props.initialSubmission.submittedField
    //   console.log('2:', existingResource)
    // }
    // if (existingResource !== null) {
    //   console.log(existingResource)

    //   console.log('DATA:', data)

    //   Array.new(existingResource).forEach(submittedField => {
    //     let field = data.find(
    //       field => field.type['@id'] === submittedField.field
    //     )
    //     if (field !== undefined) {
    //       field.value = submittedField.value
    //       field.exists = true
    //       field.fieldID = submittedField['@id']
    //     }
    //   })
    // }
    return data
  }

  loadForms(props) {
    const initialData = this.loadForm(true, props)
    const improvedData = this.loadForm(false, props)
    const isInitial =
      props.settings.myAssignment &&
      periodHappening(props.assignment.initialSubmissionPeriod)
    this.setState({
      data: isInitial ? initialData : improvedData,
      initialData,
      improvedData,
      formsLoaded: true,
    })
  }

  fetchMaterials() {
    const axiosMaterials = this.props.assignment.hasMaterial.map(material =>
      axiosGetEntities(`material/${getShortID(material['@id'])}`)
    )
    Promise.all(axiosMaterials).then(materialResponses => {
      let materials = materialResponses.map(
        response => getResponseBody(response)[0]
      )
      this.setState({ materials })
    })
  }

  fetchAnything = async (model, id) => {
    console.log('POKUS:')
    try {
      const axiosPokus = await axiosGetEntities(`${model}`)
      if (axiosPokus.failed) {
        console.log('it failed')
        console.log('FAIL:', axiosPokus)
      }
      console.log('PROCES:', axiosPokus)
      const data = await getResponseBody(axiosPokus)[0]
      console.log('AXIOS_DATA:', data)
    } catch (err) {
      console.log('ERROR:', err)
    }
  }

  fetchSubmissionBy() {
    //DELETE
    const ID = this.props.match.params.targetID || 'dvyaa'
    const entity = this.props.settings.teamAssignment ? 'team' : 'user'
    axiosGetEntities(`${entity}/${ID}`).then(response => {
      const submissionBy = getResponseBody(response)[0]
      if (this.props.settings.teamAssignment) {
        this.setState({
          submissionBy: `${submissionBy.firstName} ${submissionBy.lastName}`,
        })
      } else {
        this.setState({ submissionBy: submissionBy.name })
      }
    })
  }

  componentWillMount() {
    this.loadForms(this.props)
    this.fetchMaterials()
    if (this.props.isInstructor) {
      this.fetchSubmissionBy()
    }
  }

  getTypeDefaultValue(type) {
    if (type.fieldType === 'codeReview' || type.fieldType === 'file') {
      return null
    }
    return ''
  }

  onSubmit() {
    console.log('DATA', this.state.data)
    const filteredData = this.state.data
      .filter(field => !['file'].includes(field.type.fieldType))
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
    const assignment = this.props.assignment
    if (
      !periodHappening(assignment.initialSubmissionPeriod) &&
      !(
        assignment.submissionImprovedSubmission &&
        periodHappening(assignment.improvedSubmissionPeriod)
      )
    ) {
      return
    }
    this.setState({ savingSubmission: true })

    let update = null

    if (
      periodHappening(assignment.initialSubmissionPeriod) &&
      this.props.initialSubmission
    ) {
      update = this.props.initialSubmission['@id']
    } else if (
      assignment.submissionImprovedSubmission &&
      periodHappening(assignment.improvedSubmissionPeriod) &&
      this.props.improvedSubmission
    ) {
      update = this.props.improvedSubmission['@id']
    }

    if (update === null) {
      let axiosSubbmitedFields = filteredData.map(field =>
        axiosAddEntity(
          { field: field.type['@id'], value: field.value },
          'submittedField'
        )
      )
      Promise.all(axiosSubbmitedFields).then(responses => {
        const submittedField = responses.map(response =>
          getIRIFromAddResponse(response)
        )
        let newSubmission = {
          ofAssignment: assignment['@id'],
          submittedField,
          isImproved:
            assignment.submissionImprovedSubmission &&
            periodHappening(assignment.improvedSubmissionPeriod),
        }
        if (this.props.settings.teamAssignment) {
          newSubmission.submittedByTeam = this.props.teams.find(
            team => getShortID(team['@id']) === this.props.match.params.teamID
          )['@id']
        } else {
          newSubmission.submittedByStudent = this.props.user.fullURI
        }
        axiosAddEntity(newSubmission, 'submission').then(response => {
          this.props.refreshAssignment()
        })
      })
    } else {
      let axiosNewSubbmitedFields = filteredData
        .filter(field => !field.exists)
        .map(field =>
          axiosAddEntity(
            { field: field.type['@id'], value: field.value },
            'submittedField'
          )
        )
      let axiosExistingSubbmitedFields = filteredData
        .filter(field => field.exists)
        .map(field =>
          axiosUpdateEntity(
            { value: field.value },
            `submittedField/${getShortID(field.fieldID)}`
          )
        )

      Promise.all([
        Promise.all(axiosNewSubbmitedFields),
        Promise.all(axiosExistingSubbmitedFields),
      ]).then(([newResponses, updateResponses]) => {
        if (newResponses.length !== 0) {
          let submittedField = [
            ...newResponses.map(response => getIRIFromAddResponse(response)),
            ...updateResponses.map(response => getIRIFromAddResponse(response)),
          ]
          axiosUpdateEntity(
            { submittedField },
            `submission/${getShortID(update)}`
          ).then(response => {
            this.props.refreshAssignment()
            this.setState({ savingSubmission: false })
          })
        } else {
          this.setState({ savingSubmission: false })
        }
      })
    }
  }

  saveTeacherRating() {
    if (!this.props.settings.isInstructor || this.submission === null) {
      return
    }
    this.setState({ savingScore: true })
    axiosUpdateEntity(
      {
        teacherRating: this.state.teacherRating,
        hasTeacherComment: this.state.hasTeacherComment,
      },
      `submission/${getShortID(this.submission['@id'])}`
    ).then(response => {
      this.setState({ savingScore: false })
    })
  }

  render() {
    console.log(this.props)
    // this.fetchAnything('assignment', 'POhGl')
    const { assignment, settings, improvedSubmission, initialSubmission } =
      this.props
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
    // if (
    //   instructorViewing &&
    //   !periodHasEnded(assignment.initialSubmissionPeriod)
    // ) {
    //   return (
    //     <Alert color="danger" className="mt-3">
    //       Initial submission has not ended yet.
    //     </Alert>
    //   )
    // }
    if (studentViewing && !periodStarted(assignment.initialSubmissionPeriod)) {
      return (
        <Alert color="danger" className="mt-3">
          Submissions are not open yet.
        </Alert>
      )
    }
    return (
      <div className="submissionContainer">
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
        {this.state.submissionBy}
        {settings.myAssignment &&
          this.submission !== null &&
          this.submission.teacherRating !== undefined && (
            <>
              <Label>Score:</Label> {` ${this.state.teacherRating} points`}
              <FormGroup>
                <Label for="teacherComment">Instructor's comment</Label>
                <div
                  dangerouslySetInnerHTML={{
                    __html: this.state.hasTeacherComment.replace(
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
        {this.state.materials
          .filter(material => material.URL !== undefined)
          .map(material => (
            <div key={material['@id']}>
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
                    this.setState({
                      showOldSubmission: !this.state.showOldSubmission,
                    })
                  }
                >
                  {this.state.showOldSubmission
                    ? 'Hide old submission'
                    : 'Show old submission'}
                </Button>
              )}
            </h3>
            <div className="row">
              <div
                className={classnames({
                  'col-6': showStudentBoth && this.state.showOldSubmission,
                  'col-12': !showStudentBoth || !this.state.showOldSubmission,
                })}
              >
                {studentSubmitting && (
                  <SubmissionForm
                    assignment={assignment}
                    settings={settings}
                    isInitial={!showStudentBoth}
                    improvedSubmission={improvedSubmission}
                    initialSubmission={initialSubmission}
                    fields={this.state.data}
                    onChange={newField => {
                      let newData = [...this.state.data]
                      const index = newData.findIndex(
                        oldField =>
                          oldField.type['@id'] === newField.type['@id']
                      )
                      newData[index] = newField
                      this.setState({ data: newData })
                    }}
                    saving={this.state.savingSubmission}
                    onSubmit={this.onSubmit.bind(this)}
                  />
                )}
                {!studentSubmitting && (
                  <SubmissionView
                    assignment={assignment}
                    isInitial={true}
                    settings={settings}
                    improvedSubmission={improvedSubmission}
                    initialSubmission={initialSubmission}
                    fields={
                      showStudentBoth
                        ? this.state.improvedData
                        : this.state.initialData
                    }
                  />
                )}
              </div>
              {!initialSubmissionOpened &&
                showStudentBoth &&
                this.state.showOldSubmission && (
                  <div className="col-6">
                    <SubmissionView
                      assignment={assignment}
                      isInitial={true}
                      settings={settings}
                      improvedSubmission={improvedSubmission}
                      initialSubmission={initialSubmission}
                      fields={this.state.initialData}
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
                    this.setState({
                      showOldSubmission: !this.state.showOldSubmission,
                    })
                  }
                >
                  {this.state.showOldSubmission
                    ? 'Hide old submission'
                    : 'Show old submission'}
                </Button>
              )}
            </h3>
            <div className="row">
              <div
                className={classnames({
                  'col-6': showViewerBoth && this.state.showOldSubmission,
                  'col-12': !showViewerBoth || !this.state.showOldSubmission,
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
                      ? this.state.improvedData
                      : this.state.initialData
                  }
                />
              </div>
              {showViewerBoth && this.state.showOldSubmission && (
                <div className="col-6">
                  <SubmissionView
                    assignment={assignment}
                    isInitial={true}
                    settings={settings}
                    improvedSubmission={improvedSubmission}
                    initialSubmission={initialSubmission}
                    fields={this.state.initialData}
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
                    <Label>Score ({this.state.teacherRating})</Label>
                    <Slider
                      min={0}
                      max={10}
                      value={this.state.teacherRating}
                      onChange={teacherRating =>
                        this.setState({ teacherRating })
                      }
                    />
                  </FormGroup>
                  <FormGroup>
                    <Label for="teacherComment">Comment</Label>
                    <Input
                      type="textarea"
                      id="teacherComment"
                      value={this.state.hasTeacherComment}
                      onChange={e =>
                        this.setState({ hasTeacherComment: e.target.value })
                      }
                      placeholder="Enter voluntary comment for this submission"
                    />
                  </FormGroup>
                  <Button
                    color="primary"
                    disabled={this.state.savingScore}
                    onClick={this.saveTeacherRating.bind(this)}
                  >
                    {this.state.savingScore ? 'Saving score' : 'Save score'}
                  </Button>
                </div>
              )}
          </>
        )}
      </div>
    )
  }
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
