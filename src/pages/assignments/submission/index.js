import React, { Component } from 'react'
import {
  Button,
  Card,
  CardHeader,
  CardBody,
  TabContent,
  TabPane,
  Nav,
  NavItem,
  NavLink,
  Alert,
} from 'reactstrap'
import classnames from 'classnames'
import { connect } from 'react-redux'
import Select from 'react-select'

import {
  axiosGetEntities,
  getResponseBody,
  getShortID,
  toSelectInput,
  periodHasEnded,
  periodStarted,
} from 'helperFunctions'
import {
  assignmentsGetStudentTeams,
  assignmentsEmptyStudentTeams,
  assignmentsGetCourseInstance,
} from 'redux/actions'
import { getAssignmentPeriods, assignPeriods } from '../reusableFunctions'
import { teamSelectStyle } from '../selectStyle'

import Submission from './submission'
import CodeReview from './codeReview'
import Reviews from './peerReview'
import TeamReview from './teamReview'
import { 
  useGetAssignmentHasFieldQuery, 
  useGetAssignmentPeriodQuery,
  useGetSubmittedFieldQuery,
  useGetSubmissionSubmitedByStudentQuery,
  useGetSubmissionSubmitedByTeamQuery,
} from 'services/assignments'
import { useGetToReviewQuery } from 'services/review'

function SubmissionContainer(props) {
  getCourseInstance(props)
  const [assignment, setAssignment] = useState(null)
  const [assignmentLoaded, setAssignmentLoaded] = useState(false)

  const [initialSubmission, setInitialSubmission] = useState(null)
  const [improvedSubmission, setImprovedSubmission] = useState(null)
  const [submissionsLoaded, setSubmissionsLoaded] = useState(false)
  const [toReview, setToReview] = useState(null)

  const [settings, setSettings] = useState(null)
  const [error, setError] = useState('')
  const [errorShow, setErrorShow] = useState(false)
  const [tabID, setTabID] = useState(getTabId(props))

  useEffect(() => {
    refreshAssignment()
  }, [])

  useEffect(() => {
    if (props.user !== null && !submissionsLoaded 
        && assignmentLoaded) {
      refreshSubmissions(settings, assignment, props)
    }
    if (!props.teamsLoaded && props.user !== null 
      && props.courseInstanceLoaded && assignmentLoaded 
      && !props.isInstructor && settings.teamAssignment) {
      props.assignmentsGetStudentTeams(
        props.user.fullURI,
        props.courseInstance['@id']
      )
    }
  }, [
    props.user, 
    submissionsLoaded, 
    assignmentLoaded, 
    props.teamsLoaded, 
    props.courseInstanceLoaded, 
    props.isInstructor, settings
  ])

  const refreshAssignment = () => {
    //always get assignment
    const {
      data: assignmentData, 
      isSuccess: assignmentIsSuccess
    } = useGetAssignmentHasFieldQuery(props.match.params.assignmentID)
    if (assignmentIsSuccess && assignmentData) { 
      let assignment = assignmentData[0]
      let periodsIDs = getAssignmentPeriods(assignment)
      let periods = []
      periodsIDs.forEach(period => {
        const {data, isSuccess} = useGetAssignmentPeriodQuery(getShortID(period))
        if (isSuccess && data) {
          periods.push(data[0])
        }
      })

      assignment = assignPeriods(assignment, periods)
      const settings = getAssignmentSettings(assignment, props)
      if (!props.isInstructor 
          && settings.teamAssignment 
          && props.courseInstanceLoaded 
          && props.user !== null) {
        props.assignmentsGetStudentTeams(
          props.user.fullURI,
          props.courseInstance['@id']
        )
      }
      refreshSubmissions(settings, assignment, props)
      setAssignment(assignment)
      setSettings(settings)
      setAssignmentLoaded(true)
    } else {
      setError('Assignment not found')
      setErrorShow(true)
    }
  }

  const refreshSubmissions = (settings, assignment, props) => {
    if (props.user === null) {
      return
    }
    if (settings.peerReview && props.match.params.toReviewID) {
      const {data, isSuccess} = useGetToReviewQuery(props.match.params.toReviewID)
      if (isSuccess && data) {
        const toReview = data[0]
        const initialSubmission =
          toReview.submission.length > 0 ? toReview.submission[0] : null
        const improvedSubmission = null
        const {
          data: submittedFieldData, 
          isSuccess: submittedFieldIsSuccess
        } = useGetSubmittedFieldQuery(getShortID(initialSubmission.submittedField))
        if (submittedFieldIsSuccess && submittedFieldData) {
          const submittedField = submittedFieldData[0]
          setToReview(toReview)
          setSubmissionsLoaded(true)
          setInitialSubmission(initialSubmission !== undefined
            ? { ...initialSubmission, submittedField: [submittedField] }
            : null)
          setImprovedSubmission(improvedSubmission !== undefined ? improvedSubmission : null)
        }
      }
      return
    }
    const ID = getID(settings, props)
    if (ID === null) {
      setError('Please select your team.')
      setErrorShow(true)
      return
    }

    const {data, isSuccess} = getSubmissionSubmittedBy(settings, ID, assignment)
    if (isSuccess && data) {
      const initialSubmission = data.find(
        submission => !submission.isImproved
      )

      const improvedSubmission = data.find(
        submission => submission.isImproved
      )
      setSubmissionsLoaded(true)
      setInitialSubmission(initialSubmission !== undefined ? initialSubmission : null)
      setImprovedSubmission(improvedSubmission !== undefined ? improvedSubmission : null)
    }
  }

  let loading = !assignmentLoaded || !submissionsLoaded || props.courseInstanceLoading 
    || (!settings.isInstructor && settings.teamAssignment && !props.teamsLoaded)
  if (loading) {
    return (
      <div className="assignmentContainer center-ver mt-3">
        <Card className="assignmentsContainer center-ver">
          <CardHeader className="row">
            <Button
              size="sm"
              color=""
              onClick={() => props.history.goBack()}
            >
              <i className="fa fa-arrow-left clickable" />
            </Button>
            <h4 className="center-hor ml-5 mr-auto">{'Loading...'}</h4>
            {props.teamsLoaded &&
              settings !== null &&
              settings.myAssignment &&
              props.match.params.teamID === undefined && (
                <Select
                  styles={teamSelectStyle}
                  value={toSelectInput(props.teams, 'name', '@id').find(
                    team =>
                      getShortID(team.value) ===
                      props.match.params.teamID
                  )}
                  options={toSelectInput(props.teams, 'name', '@id')}
                  onChange={newTeam => {
                    if (
                      props.match.params.teamID !== undefined &&
                      !window.confirm(
                        'Changing team will not save your current progress!'
                      )
                    ) {
                      return
                    }
                    props.history.push(
                      `../team/${getShortID(newTeam['@id'])}/submission/${
                        tabID
                      }`
                    )
                  }}
                />
              )}
          </CardHeader>
          <CardBody>
            <Alert color="danger" isOpen={errorShow}>
              {error}
            </Alert>
            <Alert color="primary" isOpen={loading && !errorShow}>
              Data is loading!
            </Alert>
          </CardBody>
        </Card>
      </div>
    )
  }

  return (
    <div className="assignmentContainer center-ver mt-3">
      <Card className="assignmentsContainer center-ver">
        <CardHeader className="row">
          <Button
            size="sm"
            color=""
            onClick={() => props.history.goBack()}
          >
            <i className="fa fa-arrow-left clickable" />
          </Button>
          <h4 className="center-hor ml-5 mr-auto">
            {getAssignmentName(assignment, initialSubmission, improvedSubmission)}
          </h4>
          {settings.myAssignment && settings.teamAssignment && (
            <Select
              styles={teamSelectStyle}
              value={toSelectInput(props.teams, 'name', '@id').find(
                team =>
                  getShortID(team.value) === props.match.params.teamID
              )}
              options={toSelectInput(props.teams, 'name', '@id')}
              onChange={newTeam => {
                if (
                  props.match.params.teamID !== undefined &&
                  !window.confirm(
                    'Changing team will not save your current progress!'
                  )
                ) {
                  return
                }
                props.history.push(
                  `../../${getShortID(newTeam['@id'])}/submission/${
                    tabID
                  }`
                )
              }}
            />
          )}
        </CardHeader>
        <CardBody>
          <Nav tabs>
            <NavItem>
              <NavLink
                className={classnames({
                  active: tabID === 'submission',
                  clickable: true,
                })}
                onClick={() => setTabID('submission')}
              >
                Submissions
              </NavLink>
            </NavItem>
            {settings.peerReviewEnabled &&
              (((settings.myAssignment || settings.isInstructor) &&
                periodHasEnded(assignment.peerReviewPeriod)) ||
                (settings.peerReview &&
                  periodStarted(assignment.peerReviewPeriod))) && (
                <NavItem>
                  <NavLink
                    className={classnames({
                      active: tabID === 'reviews',
                      clickable: true,
                    })}
                    onClick={() => setTabID('reviews')}
                  >
                    Reviews
                  </NavLink>
                </NavItem>
              )}

            {settings.isInstructor &&
              periodHasEnded(assignment.improvedSubmissionPeriod) && (
                <NavItem>
                  <NavLink
                    className={classnames({
                      active: tabID === 'codeReviewInitial',
                      clickable: true,
                    })}
                    onClick={() => setTabID('codeReviewInitial')}
                  >
                    Code review (initial)
                  </NavLink>
                </NavItem>
              )}
            {settings.peerReviewEnabled &&
              (((settings.myAssignment || settings.isInstructor) &&
                periodHasEnded(assignment.peerReviewPeriod)) ||
                (settings.peerReview &&
                  periodStarted(assignment.peerReviewPeriod))) && (
                <NavItem>
                  <NavLink
                    className={classnames({
                      active: tabID === 'codeReview',
                      clickable: true,
                    })}
                    onClick={() => setTabID('codeReview')}
                  >
                    Code review
                  </NavLink>
                </NavItem>
              )}
            {settings.teamReviewEnabled &&
              ((settings.myAssignment &&
                periodStarted(assignment.teamReviewPeriod)) ||
                (settings.isInstructor &&
                  periodHasEnded(assignment.teamReviewPeriod))) && (
                <NavItem>
                  <NavLink
                    className={classnames({
                      active: tabID === 'teamReview',
                      clickable: true,
                    })}
                    onClick={() => setTabID('teamReview')}
                  >
                    Team review
                  </NavLink>
                </NavItem>
              )}
          </Nav>

          <TabContent activeTab={tabID}>
            <TabPane tabId={'submission'}>
              <Submission
                assignment={assignment}
                settings={settings}
                initialSubmission={initialSubmission}
                improvedSubmission={improvedSubmission}
                refreshAssignment={refreshAssignment}
                history={props.history}
                match={props.match}
              />
            </TabPane>
            {settings.peerReviewEnabled &&
              (((settings.myAssignment || settings.isInstructor) &&
                periodHasEnded(assignment.peerReviewPeriod)) ||
                (settings.peerReview &&
                  periodStarted(assignment.peerReviewPeriod))) && (
                <TabPane tabId={'reviews'}>
                  <Reviews
                    history={props.history}
                    match={props.match}
                    assignment={assignment}
                    settings={settings}
                    toReview={toReview}
                    initialSubmission={initialSubmission}
                  />
                </TabPane>
              )}
            {settings.isInstructor &&
              periodHasEnded(assignment.improvedSubmissionPeriod) && (
                // TWO CODE REVIEWS
                <TabPane tabId={'codeReviewInitial'}>
                  <CodeReview
                    history={props.history}
                    match={props.match}
                    tabID={tabID}
                    assignment={assignment}
                    settings={settings}
                    initialSubmission={initialSubmission}
                    improvedSubmission={null}
                  />
                </TabPane>
              )}
            {settings.peerReviewEnabled &&
              (((settings.myAssignment || settings.isInstructor) &&
                periodHasEnded(assignment.peerReviewPeriod)) ||
                (settings.peerReview &&
                  periodStarted(assignment.peerReviewPeriod))) && (
                <TabPane tabId={'codeReview'}>
                  <CodeReview
                    history={props.history}
                    match={props.match}
                    tabID={tabID}
                    assignment={assignment}
                    settings={settings}
                    initialSubmission={initialSubmission}
                    improvedSubmission={improvedSubmission}
                  />
                </TabPane>
              )}
            {/* <TabPane tabId={'codeReview'}>
              <CodeReview
                history={this.props.history}
                match={this.props.match}
                tabID={this.state.tabID}
                assignment={this.state.assignment}
                settings={this.state.settings}
                initialSubmission={this.state.initialSubmission}
                improvedSubmission={this.state.improvedSubmission}
              />
            </TabPane> */}
            {settings.teamReviewEnabled &&
              ((settings.myAssignment &&
                periodStarted(assignment.teamReviewPeriod)) ||
                (settings.isInstructor &&
                  periodHasEnded(assignment.teamReviewPeriod))) && (
                <TabPane tabId={'teamReview'}>
                  <TeamReview
                    history={props.history}
                    match={props.match}
                    assignment={assignment}
                    settings={settings}
                    initialSubmission={initialSubmission}
                    improvedSubmission={improvedSubmission}
                  />
                </TabPane>
              )}
          </TabContent>
        </CardBody>
      </Card>
    </div>
  )
}

const getTabId = (props) => {
   return props.match.params.tabID
        ? props.match.params.tabID
        : 'submission'
}

const getAssignmentSettings = (assignment, props) => {
  const teamAssignment = !assignment.teamsDisabled
  const teamReviewEnabled = teamAssignment && !assignment.teamReviewsDisabled
  const peerReviewEnabled = !assignment.reviewsDisabled
  const myAssignment =
    !props.match.params.targetID && !props.match.params.toReviewID
  const isInstructor = props.isInstructor
  const peerReview =
    peerReviewEnabled && props.match.params.toReviewID !== undefined
  return {
    teamAssignment,
    teamReviewEnabled,
    peerReviewEnabled,
    myAssignment,
    isInstructor,
    peerReview,
  }
}

const getID = (settings, props) => {
  let ID = null
  if (settings.myAssignment 
      && settings.teamAssignment 
      && props.match.params.teamID) {
    ID = props.match.params.teamID
  } else if (settings.myAssignment && !settings.teamAssignment) {
    ID = props.user.id
  } else if (settings.isInstructor && props.match.params.targetID) {
    ID = props.match.params.targetID
  }
  return ID
}

const getCourseInstance = (props) => {
  if (props.courseInstanceLoaded 
      && !props.courseInstanceLoading 
      && getShortID(props.courseInstance['@id']) === props.match.params.courseInstanceID) {
    return
  }
  props.assignmentsGetCourseInstance(props.match.params.courseInstanceID)
}

const getAssignmentName = (assignment, initialSubmission, improvedSubmission) => {
  let name = assignment.name
  let fieldType = assignment.hasField.find(
    field => field.fieldType === 'title'
  )
  if (fieldType !== undefined 
      && (initialSubmission !== null 
          || improvedSubmission !== null)) {
    if (initialSubmission) {
      name = initialSubmission.submittedField.find(
        submittedField => submittedField.field[0]['@id'] === fieldType['@id']
      ).value
    }
    if (improvedSubmission) {
      name = improvedSubmission.submittedField.find(
        submittedField => submittedField.field[0]['@id'] === fieldType['@id']
      ).value
    }
  }
  return name
}

const getSubmissionSubmittedBy = (settings, id, assignment) => {
  if (settings.teamAssignment) {
    return useGetSubmissionSubmitedByTeamQuery({
      id: getShortID(assignment['@id']),
      teamId: id,
      attr: '&_join=submittedField',
    })
  }
  return useGetSubmissionSubmitedByStudentQuery({
    id: getShortID(assignment['@id']),
    studentId: id,
    attr: '&_join=submittedField',
  })
}

const mapStateToProps = ({
  assignCourseInstanceReducer,
  authReducer,
  assignStudentDataReducer,
}) => {
  const { courseInstance, courseInstanceLoaded, courseInstanceLoading } =
    assignCourseInstanceReducer
  const { user } = authReducer
  const { teamsLoaded, teams } = assignStudentDataReducer
  const isInstructor =
    courseInstanceLoaded &&
    user &&
    courseInstance.hasInstructor.some(
      instructor => instructor['@id'] === user.fullURI
    )
  return {
    courseInstance,
    courseInstanceLoaded,
    courseInstanceLoading,
    teamsLoaded,
    teams,
    user,
    isInstructor,
  }
}

export default connect(mapStateToProps, {
  assignmentsGetStudentTeams,
  assignmentsEmptyStudentTeams,
  assignmentsGetCourseInstance,
})(SubmissionContainer)
