import React, { Component } from 'react';
import { connect } from "react-redux";
import { Alert } from 'reactstrap';

import AssignmentView from './assignmentView';
import AddAssignment from './addAssignment';
import { getResponseBody, inputToTimestamp, getShortID, axiosGetEntities } from '../../helperFunctions';

class Assignments extends Component{
  constructor(props){
    super(props);
    this.state={
      assignments:[],
      loadingAssignments:true,
    }
    this.refreshAssignments.bind(this);
  }

  componentWillReceiveProps(props){
    if(
      (props.user!== null && this.props.user === null) ||
      (props.courseInstance!== null && this.props.courseInstance === null) ||
      (props.courseInstance!== null && this.props.courseInstance !== null && props.courseInstance['@id'] !== this.props.courseInstance['@id'] )
    ){
      this.refreshAssignments(props);
    }
  }

  findPeriod(oldPeriod, periods){
    return periods.find( (period) => period['@id'] === oldPeriod[0]['@id'] )
  }

  assignPeriods(originalAssignment, periods){
    let assignment = {
      ...originalAssignment,
      initialSubmissionPeriod: this.findPeriod( originalAssignment.initialSubmissionPeriod, periods )
    }
    if(assignment.submissionImprovedSubmission){
      assignment.improvedSubmissionPeriod = this.findPeriod( originalAssignment.improvedSubmissionPeriod, periods );
    }
    if(!assignment.reviewsDisabled){
      assignment.peerReviewPeriod = this.findPeriod( originalAssignment.peerReviewPeriod, periods );
    }
    if(!assignment.teamReviewsDisabled && !assignment.teamsDisabled){
      assignment.teamReviewPeriod = this.findPeriod( originalAssignment.teamReviewPeriod, periods );
    }
    return assignment;
  }

  getAssignmentPeriods(assignment){
    let periods = [...assignment.initialSubmissionPeriod];
    if(assignment.submissionImprovedSubmission){
      periods.push(...assignment.improvedSubmissionPeriod);
    }
    if(!assignment.reviewsDisabled){
      periods.push(...assignment.peerReviewPeriod);
    }
    if(!assignment.teamReviewsDisabled && !assignment.teamsDisabled){
      periods.push(...assignment.teamReviewPeriod);
    }
    return periods.map((period) => period['@id'] );
  }

  assignSubmissions(assignments, submissions){
    return assignments.map((ass, index) => ({
      ...ass,
      submissions:submissions[index]
    }))
  }

  refreshAssignments(props){
    if(props.courseInstance !== null && props.user !== null){
      //?courseInstance=${props.courseInstance['@id']}
      //console.log(props.courseInstance['@id']);
      axiosGetEntities(`assignment?courseInstance=${getShortID(props.courseInstance['@id'])}&_join=ofAssignment`).then((response)=>{
        console.log(response);
        if(!response.failed){
          let assignments = getResponseBody(response);
          let periodsIDs = assignments.map(this.getAssignmentPeriods).reduce(
            (acc,value)=>{
              return acc.concat(value)
            },[]
          );
          if(this.props.courseInstance.hasInstructor.some((instructor) => instructor['@id'] === this.props.user.fullURI )){
            let axiosPeriods = periodsIDs.map((period) => axiosGetEntities(`assignmentPeriod/${getShortID(period)}`) );
            let axiosSubmissions = assignments.map((assignment) => axiosGetEntities(`submission?ofAssignment=${getShortID(assignment['@id'])}`) );
            Promise.all([
              Promise.all(axiosPeriods),
              Promise.all(axiosSubmissions),
            ]).then(([periodsResponses, submissionsResponses])=>{
              let periods = periodsResponses.map((response) => getResponseBody(response)[0]);
              let submissions = submissionsResponses.map((response) => getResponseBody(response));
              console.log(submissions);
              assignments = this.assignSubmissions( assignments, submissions );
              assignments = assignments.map( (assignment) => this.assignPeriods(assignment, periods) )
              .sort((assignment1,assignment2) => inputToTimestamp(assignment1.createdAt) > inputToTimestamp(assignment2.createdAt) );
              this.setState({ assignments, loadingAssignments: false })
            })
          }else{
            Promise.all(periodsIDs.map((period) => axiosGetEntities(`assignmentPeriod/${getShortID(period)}`) )).then((responses)=>{
              let periods = responses.map((response) => getResponseBody(response)[0]);
              assignments = assignments.map( (assignment) => this.assignPeriods(assignment, periods) )
              .sort((assignment1,assignment2) => inputToTimestamp(assignment1.createdAt) > inputToTimestamp(assignment2.createdAt) );
              this.setState({ assignments, loadingAssignments: false })
            })
          }
        }
      })
    }
  }

  updateAssignment(assignmentID){
    if(this.props.courseInstance !== null){
      axiosGetEntities(`assignment/${getShortID(assignmentID)}`).then((response)=>{
        if(!response.failed){
          let assignment = getResponseBody(response)[0];
          let periodsIDs = this.getAssignmentPeriods(assignment);
          Promise.all(periodsIDs.map((period) => axiosGetEntities(`assignmentPeriod/${getShortID(period)}`) )).then((responses)=>{
            let periods = responses.map((response) => getResponseBody(response)[0]);
            let assignments = [this.assignPeriods(assignment, periods)].concat(this.state.assignments.filter((assignment) => assignment['@id'] !== assignmentID ))
              .sort((assignment1,assignment2) => inputToTimestamp(assignment1.createdAt) > inputToTimestamp(assignment2.createdAt) );
            this.setState({ assignments })
          })
        }
      })
    }
  }

  componentWillMount(){
    this.refreshAssignments(this.props);
  }

  render(){
    if(this.state.loadingAssignments){
      return(
        <div className="assignmentsContainer center-ver mt-3">
          <h1 className="row">
            Assignments
          </h1>
          <Alert color="primary" className="m-t-3">
            Assignments are loading! Please wait...
          </Alert>
        </div>
      )
    }
    console.log(this.state.assignments);
    return(
      <div className="assignmentsContainer center-ver mt-3">
        <h1 className="row">
          Assignments { this.props.user !== null &&
            this.props.courseInstance.hasInstructor.some((instructor) => instructor['@id'] === this.props.user.fullURI ) &&
            <AddAssignment updateAssignment={this.updateAssignment.bind(this)} /> }
        </h1>
        {
          this.state.assignments.map((assignment)=> <AssignmentView key={assignment['@id']} assignment={assignment} history={this.props.history}/>)
        }
      </div>
    )
  }
}

const mapStateToProps = ({courseInstanceReducer, authReducer}) => {
  const { courseInstance } = courseInstanceReducer;
  const { user } = authReducer;
	return {
    courseInstance,
    user,
	};
};

export default connect(mapStateToProps, {  })(Assignments);
