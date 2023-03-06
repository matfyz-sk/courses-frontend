import React, { useState } from 'react'
import { Alert, Table, Button } from 'reactstrap'
import {
  getShortID,
  unixToString,
  afterNow,
  addMinutesToUnix,
  shuffleArray,
  getStudentName,
  periodHasEnded,
} from '../../../helperFunctions'
import classnames from 'classnames'
import { useUpdateAssignmentMutation } from 'services/assignments'
import { useAddSubmissionToReviewMutation } from 'services/review'

export default function InstructorAssignmentView(props) {
  const assignment = props.assignment
  const [assigningReviews, setAssigningReviews] = useState(false)
  const [assigningSuccess, setAssigningSuccess] = useState(false)
  const [addSubmissionToReview, addSubmissionToReviewResult] = useAddSubmissionToReviewMutation()
  const [updateAssignment, updateAssignmentResult] = useUpdateAssignmentMutation()
  
  const submissions = groupSubmissions(
    assignment.submissions,
    assignment.teamsDisabled
  )
  const canAssignReviews = getCanAssignReviews(assignment)
  const canBeRated = getCanBeRated(assignment)

  const assignReviews = () => {
    //review  - individual
    let submissions = assignment.submissions.filter(
      submission => !submission.isImproved
    )
    console.log('ASSI_:', assignment)
    console.log('SUBMI_:', submissions)

    let howMany = assignment.reviewsPerSubmission
    if (submissions.length < 2) {
      window.confirm(
        `You can't have peer review with less than 2 submissions (there are ${submissions.length}) submissions.`
      )
      return
    }
    if (
      submissions.length - 1 >= howMany &&
      !window.confirm(
        ` Everything looks fine! Proceed sending peer review requests?`
      )
    ) {
      return
    }
    if (submissions.length - 1 < howMany) {
      if (
        !window.confirm(
          `There are not enought submissions to have ${howMany} reviews per submission. Maximum you can have is ${
            submissions.length - 1
          }, in which case everybody reviews everybody. Is this ok? `
        )
      ) {
        return
      } else {
        howMany = submissions.length - 1
      }
    }
    setAssigningReviews(true)
    submissions = shuffleArray(submissions)
    console.log('SHUFFLED:', submissions)
    let toReviews = []
    if (assignment.teamsDisabled) {
      submissions.forEach((submission, index) => {
        for (let count = 1; count <= howMany; count++) {
          let submissionToReview =
            submissions[(index + count) % submissions.length]
          console.log('TO REVIEW_:', {
            submission: submissionToReview['@id'],
            student: submission.submittedByStudent[0]['@id'],
          })
          toReviews.push({
            submission: submissionToReview['@id'],
            student: submission.submittedByStudent[0]['@id'],
          })
        }
      })
    } else {
      submissions.forEach((submission, index) => {
        for (let count = 1; count <= howMany; count++) {
          let submissionToReview =
            submissions[(index + count) % submissions.length]
          toReviews.push({
            submission: submissionToReview['@id'],
            team: submission.submittedByTeam[0]['@id'],
          })
        }
      })
    }

    toReviews.forEach(toReview => {
      addSubmissionToReview(toReview).unwrap().then(response => {
        updateAssignment({
          id: getShortID(props.assignment['@id']),
          patch: { hasAssignedReviews: true },
        }).unwrap().then(responseFromUpdate => {
          props.updateAssignment(assignment['@id'])
        })
      })
    })
    
    setAssigningReviews(false)
    setAssigningSuccess(true)
  }

  return (
    <>
      {canAssignReviews && (
        <Button
          color="warning"
          disabled={assigningReviews}
          onClick={assignReviews}
        >
          Assign reviews!
        </Button>
      )}
      <Alert
        color="warning"
        className="m-t-3"
        isOpen={assigningReviews}
      >
        Please wait and don't close this window.
      </Alert>
      <Alert
        color="success"
        className="m-t-3"
        isOpen={assigningSuccess}
      >
        Peer Reviews successfully assigned!
      </Alert>
      <h5>
        Submissions by {assignment.teamsDisabled ? 'students' : 'teams'}
      </h5>
      <Alert
        color="warning"
        className="m-t-3"
        isOpen={submissions.length === 0}
      >
        No submissions yet...
      </Alert>
      <Alert
        color="warning"
        className="m-t-3 small-alert"
        isOpen={!periodHasEnded(assignment.initialSubmissionPeriod)}
      >
        Initial submission must finish before you can review submissions
      </Alert>
      {submissions.length > 0 && (
        <Table>
          <thead>
            <tr>
              <th>{assignment.teamsDisabled ? 'Student' : 'Team'}</th>
              {canBeRated && <th width="20">Rated</th>}
              <th width="20"></th>
            </tr>
          </thead>
          <tbody>
            {submissions.map(submission => (
              <tr key={submission.id}>
                <td>{submission.name}</td>
                {canBeRated && (
                  <td style={{ textAlign: 'center' }}>
                    {submission.submissions.some(
                      submission => submission.teacherRating !== undefined
                    ) ? (
                      <i className="fa fa-check green-color" />
                    ) : (
                      <i className="fa fa-times red-color" />
                    )}
                  </td>
                )}

                <td>
                  <Button
                    color="success"
                    onClick={() =>
                      props.history.push(
                        `./assignments/assignment/${getShortID(
                          assignment['@id']
                        )}/${getShortID(submission.id)}/submission`
                      )
                    }
                  >
                    {submission.submissions.some(
                      submission => submission.teacherRating !== undefined
                    ) || !canBeRated
                      ? 'View'
                      : 'Score'}
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
      <h5>Schedule</h5>
      <Table borderless>
        <thead>
          <tr>
            <th>Event</th>
            <th>Open time</th>
            <th>Deadline</th>
            <th>Extra time</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Initial submission</td>
            <td>
              <span
                className={getTimeCellClassNames(
                  assignment.initialSubmissionPeriod.openTime
                )}
              >
                {unixToString(assignment.initialSubmissionPeriod.openTime)}
              </span>
            </td>
            <td>
              <span
                className={getTimeCellClassNames(
                  assignment.initialSubmissionPeriod.deadline
                )}
              >
                {unixToString(assignment.initialSubmissionPeriod.deadline)}
              </span>
            </td>
            <td>
              {assignment.initialSubmissionPeriod.extraTime + ' minutes'}
            </td>
          </tr>
          {!assignment.reviewsDisabled && (
            <tr>
              <td>Peer review</td>
              <td>
                <span
                  className={getTimeCellClassNames(
                    assignment.peerReviewPeriod.openTime
                  )}
                >
                  {unixToString(assignment.peerReviewPeriod.openTime)}
                </span>
              </td>
              <td>
                <span
                  className={getTimeCellClassNames(
                    assignment.peerReviewPeriod.deadline
                  )}
                >
                  {unixToString(assignment.peerReviewPeriod.deadline)}
                </span>
              </td>
              <td>{assignment.peerReviewPeriod.extraTime + ' minutes'}</td>
            </tr>
          )}
          {!assignment.teamReviewsDisabled && !assignment.teamsDisabled && (
            <tr>
              <td>Team review</td>
              <td>
                <span
                  className={getTimeCellClassNames(
                    assignment.teamReviewPeriod.openTime
                  )}
                >
                  {unixToString(assignment.teamReviewPeriod.openTime)}
                </span>
              </td>
              <td>
                <span
                  className={getTimeCellClassNames(
                    assignment.teamReviewPeriod.deadline
                  )}
                >
                  {unixToString(assignment.teamReviewPeriod.deadline)}
                </span>
              </td>
              <td>{assignment.teamReviewPeriod.extraTime + ' minutes'}</td>
            </tr>
          )}
          {assignment.submissionImprovedSubmission && (
            <tr>
              <td>Improved submission</td>
              <td>
                <span
                  className={getTimeCellClassNames(
                    assignment.improvedSubmissionPeriod.openTime
                  )}
                >
                  {unixToString(assignment.improvedSubmissionPeriod.openTime)}
                </span>
              </td>
              <td>
                <span
                  className={getTimeCellClassNames(
                    assignment.improvedSubmissionPeriod.deadline
                  )}
                >
                  {unixToString(assignment.improvedSubmissionPeriod.deadline)}
                </span>
              </td>
              <td>
                {assignment.improvedSubmissionPeriod.extraTime + ' minutes'}
              </td>
            </tr>
          )}
        </tbody>
      </Table>
    </>
  )
}

const getTimeCellClassNames = (time) => {
  return classnames({
    'upcomming-time': afterNow(time),
    'time-has-passed': !afterNow(time),
  })
}

const getAfterNow = (date, extraMinutes) => {
  return afterNow(addMinutesToUnix(date, extraMinutes))
}

const getSubmittedBy = (submission) => {
  if (submission.submittedByStudent.length > 0) {
    return getStudentName(submission.submittedByStudent[0])
  }
  return submission.submittedByTeam[0].name
}

const groupSubmissions = (submissions, individualGrouping) => {
  let groupedSubmissions = []
  submissions.forEach(submission => {
    const id = individualGrouping
      ? submission.submittedByStudent[0]['@id']
      : submission.submittedByTeam[0]['@id']
    const index = groupedSubmissions.findIndex(
      gSubmission => gSubmission.id === id
    )
    if (index === -1) {
      groupedSubmissions.push({
        id,
        name: getSubmittedBy(submission),
        submissions: [submission],
      })
    } else {
      groupedSubmissions[index].submissions.push(submission)
    }
  })
  return groupedSubmissions
}

const getCanAssignReviews = (assignment) => {
  return !getAfterNow(assignment.initialSubmissionPeriod.deadline,
            assignment.initialSubmissionPeriod.extraTime) 
        && !assignment.reviewsDisabled 
        && !assignment.hasAssignedReviews 
      /*&& !this.state.assigningSuccess*/
}

const getCanBeRated = (assignment) => {
  return !getAfterNow(assignment.initialSubmissionPeriod.deadline,
                  assignment.initialSubmissionPeriod.extraTime) 
        && (!assignment.submissionImprovedSubmission 
            || !getAfterNow(assignment.improvedSubmissionPeriod.deadline,
                        assignment.improvedSubmissionPeriod.extraTime)
          )
}
