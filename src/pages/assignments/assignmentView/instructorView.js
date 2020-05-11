import React, { Component } from 'react'
import { Alert, Table,Button } from 'reactstrap';
import { getShortID, timestampToString, afterNow, addMinutesToDate, shuffleArray, axiosUpdateEntity, axiosAddEntity } from '../../../helperFunctions';
import classnames from 'classnames';

export default class InstructorAssignmentView extends Component {
  constructor(props){
    super(props);
    this.state={
      assigningReviews: false,
      assigningSuccess: false,
    }
  }

  getTimeCellClassNames(time){
    return classnames({ 'upcomming-time': afterNow(time), 'time-has-passed': !afterNow(time) })
  }

  afterNow(date, extraMinutes){
    return afterNow(addMinutesToDate(new Date(date), extraMinutes).getTime())
  }

  assignReviews(){
    //review  - individual
    const assignment = this.props.assignment;
    let howMany = assignment.reviewsPerSubmission;
    if(assignment.submissions.length < 2){
      window.confirm(`You can't have peer review with only ${assignment.submissions.length} submissions`);
      return;
    }
    if( assignment.submissions.length - 1 < howMany ){
      if(!window.confirm(`There are not enought submissions to have ${howMany} reviews per submission. Maximum you can have is ${assignment.submissions.length - 1}, in which case everybody reviews everybody. Is this ok? `)){
        return;
      }else{
        howMany = assignment.submissions.length - 1;
      }
    }
    this.setState({assigningReviews: true });
    let submissions = shuffleArray(assignment.submissions);
    let toReviews = [];
    if(assignment.teamsDisabled){
      submissions.forEach((submission,index)=>{
        for (let count = 1; count <= howMany; count++) {
          let submissionToReview = submissions[(index + count) % (submissions.length)];
          toReviews.push({
            submission: submissionToReview['@id'],
            student: submission.submittedByStudent
          })
        }
      })
    }else{
      submissions.forEach((submission,index)=>{
        for (let count = 1; count <= howMany; count++) {
          let submissionToReview = submissions[(index + count) % (submissions.length)];
          toReviews.push({
            submission: submissionToReview['@id'],
            team: submission.submittedByTeam
          })
        }
      })
    }
    Promise.all([toReviews.map((toReview) => axiosAddEntity( toReview,'toReview') )]).then((responses)=>{
      if(responses.every((response)=>!response.failed)){
        axiosUpdateEntity({hasAssignedReviews:true},`assingment/${getShortID(this.props.assignment['@id'])}`)
      }
    })
    this.setState({ assigningReviews: false, assigningSuccess: true })
  }

  render() {
    const assignment = this.props.assignment;
    const canAssignReviews = !this.afterNow(assignment.initialSubmissionPeriod.deadline, assignment.initialSubmissionPeriod.extraTime) && !assignment.reviewsDisabled && !assignment.hasAssignedReviews && !this.state.assigningSuccess;
    const canBeRated = !this.afterNow(assignment.initialSubmissionPeriod.deadline, assignment.initialSubmissionPeriod.extraTime) &&
    (!assignment.submissionImprovedSubmission || !this.afterNow(assignment.improvedSubmissionPeriod.deadline, assignment.improvedSubmissionPeriod.extraTime) )
    return (
      <>
      { canAssignReviews && <Button color="warning" disabled={this.state.assigningReviews} onClick={this.assignReviews.bind(this)}>Assign reviews!</Button> }
      <Alert color="warning" className="m-t-3" isOpen={this.state.assigningReviews}>
        Please wait and don't close this window.
      </Alert>
      <Alert color="success" className="m-t-3" isOpen={this.state.assigningSuccess}>
        Assingments successfully assigned!
      </Alert>
      <h5>Submissions by {assignment.teamsDisabled ? 'students' : 'teams'}</h5>
      {
        assignment.submissions.length === 0 &&
        <Alert color="warning" className="m-t-3">
          No submissions yet...
        </Alert>
      }
      { assignment.submissions.length > 0 &&
        <Table>
          <thead>
            <tr>
              <th>{assignment.teamsDisabled ? 'Student' : 'Team'}</th>
              { canBeRated && <th width="20">Rated</th> }
              <th width="20"></th>
            </tr>
          </thead>
          <tbody>
            {assignment.submissions.map((submission)=>
              <tr key={submission['@id']}>
                <td>
                  {assignment.teamsDisabled ? (submission.submittedByStudent[0].firstName + ' ' + submission.submittedByStudent[0].lastName) : submission.submittedByTeam.name }
                </td>
                { canBeRated &&
                  <td style={{ textAlign: 'center' }}>
                    { submission.teacherRating ? <i className="fa fa-check green-color" /> : <i className="fa fa-times red-color" /> }
                  </td>
                }
                <td>
                  <Button
                    color="success"
                    onClick={()=>this.props.history.push(`./assignments/assignment/${getShortID(assignment['@id'])}/submission/${getShortID(submission['@id'])}/submission`)}
                    >
                    {submission.teacherRating ? 'View' : 'View/Score' }
                  </Button>
                </td>
              </tr>
            )}
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
              <span className={this.getTimeCellClassNames(assignment.initialSubmissionPeriod.openTime)}>
                {timestampToString(assignment.initialSubmissionPeriod.openTime)}
              </span>
            </td>
            <td>
              <span className={this.getTimeCellClassNames(assignment.initialSubmissionPeriod.deadline)}>
                {timestampToString(assignment.initialSubmissionPeriod.deadline)}
              </span>
            </td>
            <td>{assignment.initialSubmissionPeriod.extraTime + ' minutes'}</td>
          </tr>
          { assignment.submissionImprovedSubmission &&
            <tr>
              <td>Improved submission</td>
              <td>
                <span className={this.getTimeCellClassNames(assignment.improvedSubmissionPeriod.openTime)}>
                  {timestampToString(assignment.improvedSubmissionPeriod.openTime)}
                </span>
              </td>
              <td>
                <span className={this.getTimeCellClassNames(assignment.improvedSubmissionPeriod.deadline)}>
                  {timestampToString(assignment.improvedSubmissionPeriod.deadline)}
                </span>
              </td>
              <td>{assignment.improvedSubmissionPeriod.extraTime + ' minutes'}</td>
            </tr>
          }
          { !assignment.reviewsDisabled &&
            <tr>
              <td>Peer review</td>
              <td>
                <span className={this.getTimeCellClassNames(assignment.peerReviewPeriod.openTime)}>
                  {timestampToString(assignment.peerReviewPeriod.openTime)}
                </span>
              </td>
              <td>
                <span className={this.getTimeCellClassNames(assignment.peerReviewPeriod.deadline)}>
                  {timestampToString(assignment.peerReviewPeriod.deadline)}
                </span>
              </td>
              <td>{assignment.peerReviewPeriod.extraTime + ' minutes'}</td>
            </tr>
          }
          { !assignment.teamReviewsDisabled && !assignment.teamsDisabled &&
            <tr>
              <td>Team review</td>
              <td>
                <span className={this.getTimeCellClassNames(assignment.teamReviewPeriod.openTime)}>
                  {timestampToString(assignment.teamReviewPeriod.openTime)}
                </span>
              </td>
              <td>
                <span className={this.getTimeCellClassNames(assignment.teamReviewPeriod.deadline)}>
                  {timestampToString(assignment.teamReviewPeriod.deadline)}
                </span>
              </td>
              <td>{assignment.teamReviewPeriod.extraTime + ' minutes'}</td>
            </tr>
          }
        </tbody>
      </Table>
      </>
  )
}
}
