import React, { Component } from 'react'
import { Alert, Table,Button, Label } from 'reactstrap';
import { connect } from "react-redux";
import { getShortID, timestampToString, axiosGetEntities, getResponseBody, periodHappening, getStudentName, afterNow } from '../../../helperFunctions';
import StudentTeamSubmissionsView from './studentTeamSubmissionsView';
import StudentSubmissionsView from './studentSubmissionsView';

class StudentAssignmentView extends Component {
  constructor(props){
    super(props);
    this.state={
      submissionsLoaded: false,
      reviewsLoaded: false,
      initialSubmissions: [],
      improvedSubmissions: [],
      toReviews: [],
    }
  }

  getSubmissions(){
    let axiosSubmissions = [];
    if(this.props.assignment.teamsDisabled){
      axiosSubmissions.push(axiosGetEntities(`submission?ofAssignment${getShortID(this.props.assignment['@id'])}&submittedByStudent=${getShortID(this.props.user.fullURI)}`));
    }else{
      axiosSubmissions = this.props.teams.map((team)=> axiosGetEntities(`submission?ofAssignment${getShortID(this.props.assignment['@id'])}&submittedByTeam=${getShortID(team['@id'])}`))
    }
    Promise.all(axiosSubmissions).then((responses)=>{
      let submissions = responses.map((response) => getResponseBody(response) ).reduce(
        (acc,value)=>{
          return acc.concat(value)
        },[]
      );
      let initialSubmissions = submissions.filter((submission)=>!submission.isImproved);
      let improvedSubmissions = submissions.filter((submission)=>submission.isImproved);
      this.setState({initialSubmissions, improvedSubmissions, submissionsLoaded: true })
    })
  }

  getReviews(){
    if(this.props.assignment.reviewsDisabled){
      this.setState({ reviewsLoaded: true })
      return;
    }
    let axiosToReviews = [];
    if(this.props.assignment.teamsDisabled){
      axiosToReviews.push(axiosGetEntities(`toReview?&student=${getShortID(this.props.user.fullURI)}&_join=student`));
    }else{
      axiosToReviews = this.props.teams.map((team)=> axiosGetEntities(`toReview?team=${getShortID(team['@id'])}&_join=team`))
    }
    Promise.all(axiosToReviews).then((responses)=>{
      let toReviews = responses.map((response) => getResponseBody(response) ).reduce(
        (acc,value)=>{
          return acc.concat(value)
        },[]
      );
      let axiosReviews = [];
      if(this.props.assignment.teamsDisabled){
        axiosReviews = toReviews.map((toReview)=> axiosGetEntities(`peerReview?reviewedByStudent=${getShortID(this.props.user.fullURI)}&ofSubmission=${getShortID(toReview.submission[0])}`))
      }else{
        axiosReviews = toReviews.map((toReview)=> axiosGetEntities(`peerReview?reviewedByTeam=${getShortID(toReview.team['@id'])}&ofSubmission=${getShortID(toReview.submission[0])}`))
      }
      Promise.all(axiosReviews).then((responses)=>{
        let reviews = responses.map((response)=> getResponseBody(response)).reduce(
          (acc,value)=>{
            return acc.concat(value)
          },[]
        );
        toReviews = this.assignReviews(toReviews, reviews);
        this.setState({ toReviews, reviewsLoaded: true })
      })
    })
  }

  assignReviews(toReviews, reviews){
    return toReviews.map((toReviewItem)=>({
      ...toReviewItem,
      review: reviews.find((review) => review.ofSubmission[0] === toReviewItem.submission[0])
    }))
  }


  componentWillMount(){
    this.getSubmissions();
    this.getReviews();
  }

  render() {

    /*
    ak deadline na submission alebo team review pridat quick button, ak na review pridat text
    odkaz na submission - initial/improved - moznost view, submit, update (ratat s extra casom)
    pridat po skonceni team review tlacitko view team review
    ziskat reviews pre studenta alebo jeho tymu
    */
    let assignment = this.props.assignment;
    let showInitialDeadline = periodHappening(assignment.initialSubmissionPeriod);
    let showImprovedDeadline = assignment.submissionImprovedSubmission && periodHappening(assignment.improvedSubmissionPeriod);
    let showPeerDeadline = !assignment.reviewsDisabled && periodHappening(assignment.peerReviewPeriod);
    let showTeamDeadline = !assignment.teamsDisabled && !assignment.teamReviewsDisabled && periodHappening(assignment.teamReviewPeriod);
    return (
      <>
      {
        showInitialDeadline &&
        <div>
          <Label className="mb-0 pt-0">Submission deadline: </Label>
          <span>{' ' + timestampToString(assignment.initialSubmissionPeriod.deadline)}</span>
          <Button outline className="ml-2 mb-2 p-1" color="primary" onClick={()=>this.props.history.push(`./assignments/assignment/${getShortID(assignment['@id'])}/submission/submission`)}>
            {this.state.initialSubmissions.length === 0 ? 'Submit' : 'Update' }
          </Button>
        </div>
      }
      {
        showImprovedDeadline &&
        <div>
          <Label className="mb-0 pt-0">Improved submission deadline: </Label>
          <span>{' ' + timestampToString(assignment.improvedSubmissionPeriod.deadline)}</span>
          <Button outline className="ml-2 mb-2 p-1" color="primary" onClick={()=>this.props.history.push(`./assignments/assignment/${getShortID(assignment['@id'])}/submission/submission`)}>
            {this.state.improvedSubmissions.length === 0 ? 'Submit' : 'Update' }
          </Button>
        </div>
      }
      {
        showPeerDeadline &&
        <div>
          <Label className="mb-0 pt-0">Peer review deadline: </Label>
          <span>{' ' + timestampToString(assignment.peerReviewPeriod.deadline)}</span>
        </div>
      }
      {
        showTeamDeadline &&
        <div>
          <Label className="mb-0 pt-0">Team review deadline: </Label>
          <span>{' ' + timestampToString(assignment.teamReviewPeriod.deadline)}</span>
          <Button outline className="ml-2 mb-2 p-1" color="primary" onClick={()=>this.props.history.push(`./assignments/assignment/${getShortID(assignment['@id'])}/submission/teamReview`)}>Review team</Button>
        </div>
      }
      <h5>Your submissions</h5>
      <Alert color="primary" className="row" isOpen={!this.state.submissionsLoaded||!this.state.reviewsLoaded}>Loading submissions...</Alert>
      <Alert color="warning" className="row" isOpen={this.state.initialSubmissions.length === 0 && this.state.improvedSubmissions.length === 0}>
        <div className="center-hor">No submissions yet!</div> <Button className="ml-auto" color="success" onClick={()=>this.props.history.push(`./assignments/assignment/${getShortID(this.props.assignment['@id'])}/submission/submission`)}>Submit</Button>
      </Alert>

      { !assignment.teamsDisabled && ( this.state.initialSubmissions !== 0 || this.state.improvedSubmissions !== 0 ) &&
        <StudentTeamSubmissionsView
          history={this.props.history}
          initialSubmissions={this.state.initialSubmissions}
          improvedSubmissions={this.state.improvedSubmissions}
          teams={this.props.teams}
          assignment={assignment}
          />
      }
      { assignment.teamsDisabled && ( this.state.initialSubmissions !== 0 || this.state.improvedSubmissions !== 0 ) &&
        <StudentSubmissionsView
          history={this.props.history}
          initialSubmissions={this.state.initialSubmissions}
          improvedSubmissions={this.state.improvedSubmissions}
          teams={this.props.teams}
          assignment={assignment}
          />
      }
      {
        !assignment.reviewsDisabled && assignment.hasAssignedReviews && !afterNow(assignment.peerReviewPeriod.openTime) &&
        <div>
          <h5>You should review</h5>
            <Table>
              <thead>
                <tr>
                  { assignment.reviewsVisibility === 'open' && <th>Reviewing</th> }
                  <th width="150" className="center-cell">Was reviewed</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                { this.state.toReviews.map((toReview)=>
                  <tr>
                    { assignment.reviewsVisibility === 'open' && <td>{ !assignment.teamsDisabled && !assignment.reviewedByTeam ? toReview.team.name : getStudentName(toReview.student)}</td> }
                    <th className="center-cell">{ toReview.review !== undefined ? <i className="fa fa-check green-color" /> : <i className="fa fa-times red-color" /> }</th>
                    <th>
                      <Button
                        color={ toReview.review ? "primary" : "success" }
                        onClick={()=>this.props.history.push(`./assignments/assignment/${getShortID(this.props.assignment['@id'])}/review/submission/${getShortID(toReview.submission[0])}/reviews`)}
                        >
                        { toReview.review ? 'Update review':'Review'}
                      </Button>
                    </th>
                  </tr>
                )}
              </tbody>
            </Table>
        </div>
      }

      </>
  )
}
}

const mapStateToProps = ({ assignStudentDataReducer, authReducer }) => {
  const { teams } = assignStudentDataReducer;
  const { user } = authReducer;
  return {
    teams,
    user,
  };
};

export default connect(mapStateToProps, {  })(StudentAssignmentView);
