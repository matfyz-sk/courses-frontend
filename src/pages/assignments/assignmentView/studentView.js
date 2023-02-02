import React, { useState, useEffect } from 'react'
import { Alert, Table, Button, Label } from 'reactstrap'
import { connect } from 'react-redux'
import {
  getShortID,
  unixToString,
  periodHappening,
  getStudentName,
  afterNow,
} from '../../../helperFunctions'
import StudentTeamSubmissionsView from './studentTeamSubmissionsView'
import StudentSubmissionsView from './studentSubmissionsView'
import { 
  useGetSubmissionSubmitedByStudentQuery, 
  useGetSubmissionSubmitedByTeamQuery,
  useGetToReviewForStudentQuery,
  useGetToReviewForTeamQuery,
  useGetPeerReviewQuery,
  useGetPeerReviewForTeamQuery,
} from 'services/assignments'
import { useGetUserQuery } from 'services/user'
import { useGetTeamQuery } from 'services/team'

function StudentAssignmentView(props) {
  let assignment = props.assignment
  const [submissionsLoaded, setSubmissionsLoaded] = useState(false)
  const [reviewsLoaded, setReviewsLoaded] = useState(false)
  const [mySubmissionWasReviewed, setMySubmissionWasReviewed] = useState(false)
  const [initialSubmissions, setInitialSubmissions] = useState([])
  const [improvedSubmissions, setImprovedSubmissions] = useState([])
  const [toReviews, setToReviews] = useState([])
  const [reviewsTemporary, setReviewsTemporary] = useState([])

  useEffect(() =>{
    getSubmissions()
    getReviews()
  },[])

  const getSubmissions = () => {
    let submissions = []
    if (assignment.teamsDisabled) {
      const {data, isSuccess} = useGetSubmissionSubmitedByStudentQuery({
        id: getShortID(assignment['@id']),
        studentId: getShortID(props.user.fullURI),
        attr: '',
      })
      if(isSuccess && data) {
        submissions.push(data)
      }
      
    } else {
      props.teams.forEach(team => {
        const {data, isSuccess} = useGetSubmissionSubmitedByTeamQuery({
          id: getShortID(assignment['@id']),
          teamId: getShortID(team['@id']),
          attr: '',
        })

        if(isSuccess && data) {
          submissions.push(data)
        }
      })
    }

    submissions = submissions.reduce((acc, value) => {
      return acc.concat(value)
    }, [])

    const fetchedInitialSubmissions = submissions.filter(
      submission => !submission.isImproved
    )
    const fetchedImprovedSubmissions = submissions.filter(
      submission => submission.isImproved
    )

    setInitialSubmissions(fetchedInitialSubmissions)
    setImprovedSubmissions(fetchedImprovedSubmissions)
    setSubmissionsLoaded(true)
  }

  const getReviews = async () => {
    if (assignment.reviewsDisabled) {
      setReviewsLoaded(true)
      return
    }
    let ToReviewsResponses = []
    if (assignment.teamsDisabled) {
      const {data, isSuccess} = useGetToReviewForStudentQuery(getShortID(
        props.user.fullURI
      ))
      
      if(isSuccess && data) {
        ToReviewsResponses.push(data)
      }
    } else {
      props.teams.forEach(team => {
        const {data, isSuccess} = useGetToReviewForTeamQuery(getShortID(
          team['@id']
        ))
        
        if(isSuccess && data) {
          ToReviewsResponses.push(data)
        }
      })
    }

    let fetchedToReviews = ToReviewsResponses.reduce((acc, value) => {
      return acc.concat(value)
    }, []).filter(
      toReview =>
        toReview.submission[0].ofAssignment === assignment['@id']
    )

    let reviewsResponses = []
    let creatorsResponses = []
    if (assignment.teamsDisabled) {
      const {data: peerReviewData, isSuccess: peerReviewIsSuccess} = useGetPeerReviewQuery()
      if (peerReviewIsSuccess && peerReviewData) {
        reviewsResponses.push(peerReviewData)
      }
      
      const {data: userData, isSuccess: userDataIsSuccess} = useGetUserQuery(getShortID(
        toReview.submission[0].submittedByStudent
      ))
      if (userDataIsSuccess && userData) {
        creatorsResponses.push(userData)
      }
    } else {
      fetchedToReviews.forEach(toReview => {
        const {data: peerReviewData, isSuccess: peerReviewIsSuccess} = useGetPeerReviewForTeamQuery({
          teamId: getShortID(toReview.team[0]['@id']),
          id: getShortID(toReview.submission[0]['@id']),
        })
        if (peerReviewIsSuccess && peerReviewData) {
          reviewsResponses.push(peerReviewData)
        }
        
        const {data: teamData, isSuccess: teamDataIsSuccess} = useGetTeamQuery(getShortID(
          toReview.submission[0].submittedByTeam
        ))
        if (teamDataIsSuccess && teamData) {
          creatorsResponses.push(teamData)
        }
      })
    }

    let fetchedReviews = reviewsResponses.reduce((acc, value) => {
              return acc.concat(value)
            }, [])
    let fetchedCreators = creatorsResponses.reduce((acc, value) => {
              return acc.concat(value)
            }, [])
    fetchedToReviews = assignReviews(
      fetchedToReviews,
      fetchedReviews,
      fetchedCreators,
      assignment.teamsDisabled
    )
    setToReviews(fetchedToReviews)
    setReviewsLoaded(true)
    setReviewsTemporary(fetchedReviews)
  }

  const wasReviewed = getWasReviewed(reviewsTemporary, initialSubmissions)

  /*
  ak deadline na submission alebo team review pridat quick button, ak na review pridat text
  odkaz na submission - initial/improved - moznost view, submit, update (ratat s extra casom)
  pridat po skonceni team review tlacitko view team review
  ziskat reviews pre studenta alebo jeho tymu
  */
  let showInitialDeadline = periodHappening(
    assignment.initialSubmissionPeriod
  )
  let showImprovedDeadline =
    assignment.submissionImprovedSubmission &&
    periodHappening(assignment.improvedSubmissionPeriod)
  let showPeerDeadline =
    !assignment.reviewsDisabled &&
    periodHappening(assignment.peerReviewPeriod)
  let showTeamDeadline =
    !assignment.teamsDisabled &&
    !assignment.teamReviewsDisabled &&
    periodHappening(assignment.teamReviewPeriod)
 
  return (
    <>
      {showInitialDeadline && (
        <div>
          <Label className="mb-0 pt-0">Submission deadline: </Label>
          <span>
            {' ' + unixToString(assignment.initialSubmissionPeriod.deadline)}
          </span>
          <Button
            outline
            className="ml-2 mb-2 p-1"
            color={
              initialSubmissions.length === 0
                ? 'success'
                : 'primary'
            }
            onClick={() =>
              props.history.push(
                `./assignments/assignment/${getShortID(
                  assignment['@id']
                )}/submission/submission`
              )
            }
          >
            {initialSubmissions.length === 0 ? 'Submit' : 'Update'}
          </Button>
        </div>
      )}
      {showImprovedDeadline && (
        <div>
          <Label className="mb-0 pt-0">Improved submission deadline: </Label>
          <span>
            {' ' + unixToString(assignment.improvedSubmissionPeriod.deadline)}
          </span>
          <Button
            outline
            className="ml-2 mb-2 p-1"
            color={
              improvedSubmissions.length === 0
                ? 'success'
                : 'primary'
            }
            onClick={() =>
              props.history.push(
                `./assignments/assignment/${getShortID(
                  assignment['@id']
                )}/submission/submission`
              )
            }
          >
            {improvedSubmissions.length === 0
              ? 'Submit'
              : 'Update'}
          </Button>
        </div>
      )}
      {showPeerDeadline && (
        <div>
          <Label className="mb-0 pt-0">Peer review deadline: </Label>
          <span>
            {' ' + unixToString(assignment.peerReviewPeriod.deadline)}
          </span>
        </div>
      )}
      {showTeamDeadline && (
        <div>
          <Label className="mb-0 pt-0">Team review deadline: </Label>
          <span>
            {' ' + unixToString(assignment.teamReviewPeriod.deadline)}
          </span>
          <Button
            outline
            className="ml-2 mb-2 p-1"
            color="primary"
            onClick={() =>
              props.history.push(
                `./assignments/assignment/${getShortID(
                  assignment['@id']
                )}/submission/teamReview`
              )
            }
          >
            Review team
          </Button>
        </div>
      )}
      <h5>Your submissions</h5>
      <Alert
        color="primary"
        className="row"
        isOpen={!submissionsLoaded || !reviewsLoaded}
      >
        Loading submissions...
      </Alert>
      <Alert
        color="warning"
        className="row"
        isOpen={
          initialSubmissions.length === 0 &&
          improvedSubmissions.length === 0 &&
          (periodHappening(assignment.initialSubmissionPeriod) ||
            (assignment.submissionImprovedSubmission &&
              periodHappening(assignment.improvedSubmissionPeriod)))
        }
      >
        <div className="center-hor">No submissions yet!</div>{' '}
        <Button
          className="ml-auto"
          color="success"
          onClick={() =>
            props.history.push(
              `./assignments/assignment/${getShortID(
                props.assignment['@id']
              )}/submission/submission`
            )
          }
        >
          Submit
        </Button>
      </Alert>

      {!assignment.teamsDisabled &&
        (initialSubmissions !== 0 ||
          improvedSubmissions !== 0) && (
          <StudentTeamSubmissionsView
            history={props.history}
            initialSubmissions={initialSubmissions}
            improvedSubmissions={improvedSubmissions}
            teams={props.teams}
            assignment={assignment}
          />
        )}
      {assignment.teamsDisabled &&
        (initialSubmissions !== 0 ||
          improvedSubmissions !== 0) && (
          <StudentSubmissionsView
            history={props.history}
            initialSubmissions={initialSubmissions}
            improvedSubmissions={improvedSubmissions}
            teams={props.teams}
            assignment={assignment}
            wasReviewed={wasReviewed}
          />
        )}
      {!assignment.reviewsDisabled &&
        assignment.hasAssignedReviews &&
        !afterNow(assignment.peerReviewPeriod.openTime) && (
          <div style={{ display: 'table' }}>
            <h5>You should review</h5>
            <Table>
              <thead>
                <tr>
                  {['blind', 'open'].includes(
                    assignment.reviewsVisibility
                  ) && <th>Reviewing</th>}
                  <th width="150" className="center-cell">
                    Was reviewed
                  </th>
                  <th width="150">Actions</th>
                </tr>
              </thead>
              <tbody>
                {toReviews.map(toReview => (
                  <tr key={toReview['@id']}>
                    {['blind', 'open'].includes(
                      assignment.reviewsVisibility
                    ) && <td>{toReview.name}</td>}
                    <td className="center-cell">
                      {toReview.review &&
                      toReview.review.reviewedByStudent[0]['@id'] ==
                        props.user.fullURI ? (
                        <i className="fa fa-check green-color" />
                      ) : (
                        <i className="fa fa-times red-color" />
                      )}
                    </td>
                    {/* possible TODO in-progress */}
                    {/* <td className="center-cell">
                      {toReview.review !== undefined ? (
                        <i className="fa fa-check green-color" />
                      ) : this.props.inProgress ? (
                        <i class="fa fa-duotone fa-spinner blue-color"></i>
                      ) : (
                        <i className="fa fa-times red-color" />
                      )}
                    </td> */}
                    <td>
                      <Button
                        color={getToReviewButtonColor(toReview, assignment.peerReviewPeriod)}
                        onClick={() =>
                          props.history.push(
                            `./assignments/assignment/${getShortID(
                              props.assignment['@id']
                            )}/review/${getShortID(toReview['@id'])}/reviews`
                          )
                        }
                      >
                        {getToReviewButtonText(toReview.review, assignment.peerReviewPeriod, props.user.fullURI)}
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        )}
    </>
  )
}

const getCreatorsName = (creators, toReview, individual) => {
  if (individual) {
    return getStudentName(
      creators.find(
        creator =>
          creator['@id'] === toReview.submission[0].submittedByStudent
      )
    )
  }
  return creators.find(
    creator => creator['@id'] === toReview.submission[0].submittedByTeam
  ).name
}

const assignReviews = (toReviews, reviews, creators, individual) => {
  return toReviews.map(toReviewItem => ({
    ...toReviewItem,
    review: reviews.find(
      review =>
        review.ofSubmission[0]['@id'] === toReviewItem.submission[0]['@id']
    ),
    name: getCreatorsName(creators, toReviewItem, individual),
  }))
}

const getToReviewButtonText = (review, peerReviewPeriod, userFullURI) => {
  if (periodHappening(peerReviewPeriod)) {
    return review &&
      review.reviewedByStudent[0]['@id'] == userFullURI
      ? 'Update Review'
      : 'Review'
  }
  return 'View'
}

const getToReviewButtonColor = (toReview, peerReviewPeriod) => {
  if (periodHappening(peerReviewPeriod) && !toReview) {
    return 'success'
  }
  return 'primary'
}

const getWasReviewed = (reviews, initialSubmissions) => {
  if (initialSubmissions.length > 0) {
    const wasReviewed = reviews.find(
      review => review.ofSubmission[0]['@id'] === initialSubmissions[0]['@id']
    )
    if (wasReviewed) {
      return true
    }
  }
}

const mapStateToProps = ({
  assignStudentDataReducer,
  authReducer,
  assignAssignmentReducer,
}) => {
  const { teams } = assignStudentDataReducer
  const { user } = authReducer
  const { inProgress } = assignAssignmentReducer
  return {
    teams,
    user,
    inProgress,
  }
}

export default connect(mapStateToProps, {})(StudentAssignmentView)
