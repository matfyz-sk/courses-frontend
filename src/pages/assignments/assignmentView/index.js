import React, { Component } from 'react';
import { Collapse, CardBody, Card, Button, Alert, Table } from 'reactstrap';
import { connect } from "react-redux";
import { inputToTimestamp, afterNow, axiosDeleteEntity, getShortID } from 'helperFunctions';
import InstructorAssignmentView from './instructorView';
import StudentAssignmentView from './studentView';
import classnames from 'classnames';

class AssignmentView extends Component{
  constructor(props){
    super(props);
    this.state={
      opened: this.getDefaultOpenState(),
      deleting: false,
    }
    this.getDefaultOpenState.bind(this);
  }

  getDefaultOpenState(){
    return afterNow(this.props.assignment.initialSubmissionPeriod.deadline) ||
    ( this.props.assignment.submissionImprovedSubmission && afterNow(this.props.assignment.improvedSubmissionPeriod.deadline)) ||
    ( !this.props.assignment.reviewsDisabled && afterNow(this.props.assignment.peerReviewPeriod.deadline)) ||
    ( !this.props.assignment.teamReviewsDisabled && !this.props.assignment.teamsDisabled && afterNow(this.props.assignment.teamReviewPeriod.deadline))||
    ( this.props.isInstructor && this.props.assignment.submissions.some((submission)=>!submission.rating) ) //bud prebiehaju alebo ich treba ohodnotit
  }

  deleteAssignment(){
    const assignment = this.props.assignment;
    if(window.confirm(`Are you sure you want to delete assignment "${assignment.name}"?`)){
      this.setState({ deleting: true });
      let periodsToDelete = [assignment.initialSubmissionPeriod];
      if(assignment.submissionImprovedSubmission){
        periodsToDelete.push(assignment.improvedSubmissionPeriod);
      }
      if(!assignment.reviewsDisabled){
        periodsToDelete.push(assignment.peerReviewPeriod);
      }
      if(!assignment.teamReviewsDisabled && !assignment.teamsDisabled){
        periodsToDelete.push(assignment.teamReviewPeriod);
      }
      let axiosPeriods = periodsToDelete.map((period)=>axiosDeleteEntity(`assignmentPeriod/${getShortID(period['@id'])}`));
      Promise.all([
        Promise.all(axiosPeriods),
        axiosDeleteEntity(`assignment/${getShortID(assignment['@id'])}`)
      ]).then(([periodResponses,assignmentResponse])=>{
        this.setState({ deleting: false });
        if(!assignmentResponse.failed){
          this.props.removeAssignment();
        }
      })
    }
  }

  render(){
    const assignment = this.props.assignment;
    return(
      <div className="assignmentViewContainer center-ver">
        <div className="row">
          <h3 className={classnames({'greyed-out': !this.getDefaultOpenState()})}>{assignment.name}</h3>
          { this.props.isInstructor &&
          <Button
            outline
            color="danger"
            className="ml-auto center-hor p-1"
            style={{width:34}}
            onClick={this.deleteAssignment.bind(this)}
            >
            <i className="fa fa-trash" />
          </Button>
          }
          <Button color="link"
            className={classnames({ 'ml-auto': !this.props.isInstructor })}
            onClick={()=>this.setState({opened:!this.state.opened})}
            style={ this.state.opened? {marginLeft:'0.35em'} : {} }
            >
            {this.state.opened?'Hide':'Show'}
          </Button>
        </div>
        <Collapse isOpen={this.state.opened}>
          <Card>
            <CardBody>
              <div dangerouslySetInnerHTML ={{__html:assignment.shortDescription}} />
              <h5>{assignment.teamsDisabled ? 'Individual' : 'Team based'}</h5>
              { this.props.isInstructor && <InstructorAssignmentView history={this.props.history} assignment={assignment} /> }
              { !this.props.isInstructor && <StudentAssignmentView history={this.props.history} assignment={assignment} /> }
            </CardBody>
          </Card>
        </Collapse>
      </div>
    )
  }
}

const mapStateToProps = ({assignCourseInstanceReducer, authReducer}) => {
  const { courseInstance } = assignCourseInstanceReducer;
  const { user } = authReducer;
  return {
    isInstructor: courseInstance.hasInstructor.some((instructor) => instructor['@id'] === user.fullURI)
  };
};

export default connect(mapStateToProps, {  })(AssignmentView);
