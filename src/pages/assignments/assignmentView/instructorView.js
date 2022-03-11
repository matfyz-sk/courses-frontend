import React, { Component } from 'react'
import { Alert, Button, Table } from 'reactstrap';
import {
  addMinutesToUnix,
  afterNow,
  axiosAddEntity,
  axiosUpdateEntity,
  getShortID,
  getStudentName,
  periodHasEnded,
  shuffleArray,
  unixToString
} from '../../../helperFunctions';
import classnames from 'classnames';

export default class InstructorAssignmentView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      assigningReviews: false,
      assigningSuccess: false,
    }
  }

  getTimeCellClassNames(time) {
    return classnames({'upcomming-time': afterNow(time), 'time-has-passed': !afterNow(time)})
  }

  afterNow(date, extraMinutes) {
    return afterNow(addMinutesToUnix(date, extraMinutes))
  }

  assignReviews() {

    //review  - individual
    const assignment = this.props.assignment;
    let submissions = assignment.submissions.filter((submission) => !submission.isImproved);
    let howMany = assignment.reviewsPerSubmission;
    if(submissions.length < 2) {
      window.confirm(`You can't have peer review with less than 2 submissions (there are ${ submissions.length }) submissions.`);
      return;
    }
    if(submissions.length - 1 >= howMany && !window.confirm(` Everything looks fine! Proceed sending peer review requests?`)) {
      return;
    }
    if(submissions.length - 1 < howMany) {
      if(!window.confirm(`There are not enought submissions to have ${ howMany } reviews per submission. Maximum you can have is ${ submissions.length - 1 }, in which case everybody reviews everybody. Is this ok? `)) {
        return;
      } else {
        howMany = submissions.length - 1;
      }
    }
    this.setState({assigningReviews: true});
    submissions = shuffleArray(submissions);
    let toReviews = [];
    if(assignment.teamsDisabled) {
      submissions.forEach((submission, index) => {
        for(let count = 1; count <= howMany; count++) {
          let submissionToReview = submissions[(index + count) % (submissions.length)];
          toReviews.push({
            submission: submissionToReview['@id'],
            student: submission.submittedByStudent[0]['@id']
          })
        }
      })
    } else {
      submissions.forEach((submission, index) => {
        for(let count = 1; count <= howMany; count++) {
          let submissionToReview = submissions[(index + count) % (submissions.length)];
          toReviews.push({
            submission: submissionToReview['@id'],
            team: submission.submittedByTeam[0]['@id']
          })
        }
      })
    }
    Promise.all([ toReviews.map((toReview) => axiosAddEntity(toReview, 'toReview')) ]).then((responses) => {
      if(responses.every((response) => !response.failed)) {
        axiosUpdateEntity({hasAssignedReviews: true}, `assignment/${ getShortID(this.props.assignment['@id']) }`).then((response) => {
          this.props.updateAssignment(assignment['@id']);
        })
      }
    })
    this.setState({assigningReviews: false, assigningSuccess: true})
  }

  getSubmittedBy(submission) {
    if(submission.submittedByStudent.length > 0) {
      return getStudentName(submission.submittedByStudent[0])
    }
    return submission.submittedByTeam[0].name
  }

  groupSubmissions(submissions, individualGrouping) {
    let groupedSubmissions = [];
    submissions.forEach((submission) => {
      const id = individualGrouping ? submission.submittedByStudent[0]['@id'] : submission.submittedByTeam[0]['@id'];
      const index = groupedSubmissions.findIndex((gSubmission) => gSubmission.id === id)
      if(index === -1) {
        groupedSubmissions.push({
          id,
          name: this.getSubmittedBy(submission),
          submissions: [ submission ],
        })
      } else {
        groupedSubmissions[index].submissions.push(submission)
      }
    })
    return groupedSubmissions;
  }

  render() {
    const assignment = this.props.assignment;
    const submissions = this.groupSubmissions(assignment.submissions, assignment.teamsDisabled);
    const canAssignReviews = !this.afterNow(assignment.initialSubmissionPeriod.deadline, assignment.initialSubmissionPeriod.extraTime) && !assignment.reviewsDisabled && !assignment.hasAssignedReviews /*&& !this.state.assigningSuccess*/;
    const canBeRated = !this.afterNow(assignment.initialSubmissionPeriod.deadline, assignment.initialSubmissionPeriod.extraTime) &&
      (!assignment.submissionImprovedSubmission || !this.afterNow(assignment.improvedSubmissionPeriod.deadline, assignment.improvedSubmissionPeriod.extraTime))
    return (
      <>
        { canAssignReviews &&
          <Button color="warning" disabled={ this.state.assigningReviews } onClick={ this.assignReviews.bind(this) }>Assign
            reviews!</Button> }
        <Alert color="warning" className="m-t-3" isOpen={ this.state.assigningReviews }>
          Please wait and don't close this window.
        </Alert>
        <Alert color="success" className="m-t-3" isOpen={ this.state.assigningSuccess }>
          Peer Reviews successfully assigned!
        </Alert>
        <h5>Submissions by { assignment.teamsDisabled ? 'students' : 'teams' }</h5>
        <Alert color="warning" className="m-t-3" isOpen={ submissions.length === 0 }>
          No submissions yet...
        </Alert>
        <Alert color="warning" className="m-t-3 small-alert"
               isOpen={ !periodHasEnded(assignment.initialSubmissionPeriod) }>
          Initial submission must finish before you can view submissions
        </Alert>
        { submissions.length > 0 &&
          <Table>
            <thead>
            <tr>
              <th>{ assignment.teamsDisabled ? 'Student' : 'Team' }</th>
              { canBeRated && <th width="20">Rated</th> }
              { periodHasEnded(assignment.initialSubmissionPeriod) && <th width="20"></th> }
            </tr>
            </thead>
            <tbody>
            { submissions.map((submission) =>
              <tr key={ submission.id }>
                <td>{ submission.name }</td>
                { canBeRated &&
                  <td style={ {textAlign: 'center'} }>
                    { submission.submissions.some((submission) => submission.teacherRating !== undefined) ?
                      <i className="fa fa-check green-color"/> : <i className="fa fa-times red-color"/> }
                  </td>
                }
                {
                  periodHasEnded(assignment.initialSubmissionPeriod) &&
                  <td>
                    <Button
                      color="success"
                      onClick={ () => this.props.history.push(`./assignments/assignment/${ getShortID(assignment['@id']) }/${ getShortID(submission.id) }/submission`) }
                    >
                      { (submission.submissions.some((submission) => submission.teacherRating !== undefined) || !canBeRated) ? 'View' : 'Score' }
                    </Button>
                  </td>
                }
              </tr>
            ) }
            </tbody>
          </Table>
        }
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
              <span className={ this.getTimeCellClassNames(assignment.initialSubmissionPeriod.openTime) }>
                { unixToString(assignment.initialSubmissionPeriod.openTime) }
              </span>
            </td>
            <td>
              <span className={ this.getTimeCellClassNames(assignment.initialSubmissionPeriod.deadline) }>
                { unixToString(assignment.initialSubmissionPeriod.deadline) }
              </span>
            </td>
            <td>{ assignment.initialSubmissionPeriod.extraTime + ' minutes' }</td>
          </tr>
          { assignment.submissionImprovedSubmission &&
            <tr>
              <td>Improved submission</td>
              <td>
                <span className={ this.getTimeCellClassNames(assignment.improvedSubmissionPeriod.openTime) }>
                  { unixToString(assignment.improvedSubmissionPeriod.openTime) }
                </span>
              </td>
              <td>
                <span className={ this.getTimeCellClassNames(assignment.improvedSubmissionPeriod.deadline) }>
                  { unixToString(assignment.improvedSubmissionPeriod.deadline) }
                </span>
              </td>
              <td>{ assignment.improvedSubmissionPeriod.extraTime + ' minutes' }</td>
            </tr>
          }
          { !assignment.reviewsDisabled &&
            <tr>
              <td>Peer review</td>
              <td>
                <span className={ this.getTimeCellClassNames(assignment.peerReviewPeriod.openTime) }>
                  { unixToString(assignment.peerReviewPeriod.openTime) }
                </span>
              </td>
              <td>
                <span className={ this.getTimeCellClassNames(assignment.peerReviewPeriod.deadline) }>
                  { unixToString(assignment.peerReviewPeriod.deadline) }
                </span>
              </td>
              <td>{ assignment.peerReviewPeriod.extraTime + ' minutes' }</td>
            </tr>
          }
          { !assignment.teamReviewsDisabled && !assignment.teamsDisabled &&
            <tr>
              <td>Team review</td>
              <td>
                <span className={ this.getTimeCellClassNames(assignment.teamReviewPeriod.openTime) }>
                  { unixToString(assignment.teamReviewPeriod.openTime) }
                </span>
              </td>
              <td>
                <span className={ this.getTimeCellClassNames(assignment.teamReviewPeriod.deadline) }>
                  { unixToString(assignment.teamReviewPeriod.deadline) }
                </span>
              </td>
              <td>{ assignment.teamReviewPeriod.extraTime + ' minutes' }</td>
            </tr>
          }
          </tbody>
        </Table>
      </>
    )
  }
}
