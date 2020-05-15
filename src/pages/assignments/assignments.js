import React, { Component } from 'react';
import { connect } from "react-redux";
import { Alert, Button } from 'reactstrap';

import AssignmentView from './assignmentView';
import AddAssignment from './addAssignment';
import { getResponseBody, inputToTimestamp, getShortID, axiosGetEntities, axiosUpdateEntity, afterNow } from 'helperFunctions';
import { assignmentsGetStudentTeams, assignmentsGetCourseInstance } from 'redux/actions';
import { getAssignmentPeriods, assignPeriods } from './reusableFunctions';

class Assignments extends Component{
  constructor(props){
    super(props);
    this.state={
      assignments:[],
      loadingAssignments:true,
    }
    this.getCourseInstance();
    this.refreshAssignments.bind(this);
  }

  getCourseInstance(){
    if(this.props.courseInstanceLoaded && !this.props.courseInstanceLoading && getShortID(this.props.courseInstance['@id']) === this.props.match.params.courseInstanceID){
      return;
    }
    this.props.assignmentsGetCourseInstance(this.props.match.params.courseInstanceID)
  }

  componentWillReceiveProps(props){
    if(
      (props.user!== null && this.props.user === null) ||
      (props.courseInstance !== null && this.props.courseInstance === null) ||
      (props.courseInstance !== null && this.props.courseInstance !== null && props.courseInstance['@id'] !== this.props.courseInstance['@id'] )
    ){
      this.refreshAssignments(props);
    }
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
      axiosGetEntities(`assignment?courseInstance=${getShortID(props.courseInstance['@id'])}`).then((response)=>{
        //console.log(response);
        if(!response.failed){
          let assignments = getResponseBody(response).filter((result) => result['@type'].endsWith('ontology#Assignment') );
          let periodsIDs = assignments.map(getAssignmentPeriods).reduce(
            (acc,value)=>{
              return acc.concat(value)
            },[]
          );
          if(props.isInstructor ){
            let axiosPeriods = periodsIDs.map((period) => axiosGetEntities(`assignmentPeriod/${getShortID(period)}`) );
            let axiosSubmissions = assignments.map((assignment) => axiosGetEntities(`submission?ofAssignment=${getShortID(assignment['@id'])}_join=submittedByStudent,submittedByTeam`) );
            Promise.all([
              Promise.all(axiosPeriods),
              Promise.all(axiosSubmissions),
            ]).then(([periodsResponses, submissionsResponses])=>{
              let periods = periodsResponses.map((response) => getResponseBody(response)[0]);
              let submissions = submissionsResponses.map((response) => getResponseBody(response));
              assignments = this.assignSubmissions( assignments, submissions );
              assignments = assignments.map( (assignment) => assignPeriods(assignment, periods) )
              assignments.sort((assignment1,assignment2) => inputToTimestamp(assignment1.createdAt) > inputToTimestamp(assignment2.createdAt) ? -1 : 1 );
              this.setState({ assignments, loadingAssignments: false })
            })
          }else{
            this.props.assignmentsGetStudentTeams(props.user.fullURI, props.courseInstance['@id'] );
            Promise.all(periodsIDs.map((period) => axiosGetEntities(`assignmentPeriod/${getShortID(period)}`) )).then((responses)=>{
              let periods = responses.map((response) => getResponseBody(response)[0]);
              assignments = assignments.map( (assignment) => assignPeriods(assignment, periods) );
              assignments.sort((assignment1,assignment2) => inputToTimestamp(assignment1.createdAt) > inputToTimestamp(assignment2.createdAt) ? -1 : 1 );
              this.setState({ assignments, loadingAssignments: false })
            })
          }
        }
      })
    }
  }

  updateAssignment(assignmentID){
    axiosGetEntities(`assignment/${getShortID(assignmentID)}`).then((response)=>{
      if(!response.failed){
        let assignment = getResponseBody(response)[0];
        let periodsIDs = getAssignmentPeriods(assignment);
        Promise.all([
          Promise.all(periodsIDs.map((period) => axiosGetEntities(`assignmentPeriod/${getShortID(period)}`) )),
          axiosGetEntities(`submission?ofAssignment=${assignmentID}_join=submittedByStudent,submittedByTeam`)
        ]).then(([periodsResponses, submissionsResponse])=>{
          let periods = periodsResponses.map((response) => getResponseBody(response)[0]);
          assignment.submissions = getResponseBody(submissionsResponse);
          let assignments = [assignPeriods(assignment, periods)].concat(this.state.assignments.filter((assignment) => assignment['@id'] !== assignmentID ));
          assignments.sort((assignment1,assignment2) => inputToTimestamp(assignment1.createdAt) > inputToTimestamp(assignment2.createdAt) ? -1 : 1 );
          this.setState({ assignments })
        })
      }
    })
  }

  componentWillMount(){
    this.refreshAssignments(this.props);
  }

  studentReadyAssignment(assignment){
    return !afterNow(assignment.initialSubmissionPeriod.openTime) ||
    ( assignment.submissionImprovedSubmission && !afterNow(assignment.improvedSubmissionPeriod.openTime) ) ||
    ( !assignment.reviewsDisabled && !afterNow(assignment.peerReviewPeriod.openTime) ) ||
    ( !assignment.teamsDisabled && !assignment.teamReviewsDisabled && !afterNow(assignment.peerReviewPeriod.openTime) )
  }

  render(){
    if(this.state.loadingAssignments || !this.props.courseInstance ||(!this.props.isInstructor && !this.props.teamsLoaded)){
      return(
        <div className="assignmentsContainer center-ver mt-3">
          <h1 className="row">
            Assignments
          </h1>
          <Alert color="primary" className="mt-3">
            Assignments are loading! Please wait...
          </Alert>
        </div>
      )
    }
    return(
      <div className="assignmentsContainer center-ver mt-3">
        <h1 className="row">
          Assignments { this.props.user !== null &&
            this.props.courseInstance.hasInstructor.some((instructor) => instructor['@id'] === this.props.user.fullURI ) &&
            <AddAssignment updateAssignment={this.updateAssignment.bind(this)} /> }
        </h1>
        { false &&
        <Button
          color="success"
          onClick={()=> axiosUpdateEntity({isSuperAdmin: true, nickNameTeamException:true},`user/${getShortID(this.props.user.fullURI)}`) }
          >
          Free superadmin here!
        </Button>
        }
        <Alert color="warning" className="mt-3" isOpen={this.state.assignments.length === 0 }>
          There are currently no assignments.
        </Alert>
        {
          (this.props.isInstructor ? this.state.assignments : this.state.assignments.filter(this.studentReadyAssignment) ).map((assignment)=>
          <AssignmentView key={assignment['@id']}
            assignment={assignment}
            history={this.props.history}
            removeAssignment={()=>{
              let newAssignments = this.state.assignments.filter((assignment2) => assignment2['@id'] !== assignment['@id'] )
              this.setState({ assignments: newAssignments })
            }}
            />)
        }
      </div>
    )
  }
}

const mapStateToProps = ({assignCourseInstanceReducer, authReducer, assignStudentDataReducer}) => {
  const { courseInstance, courseInstanceLoaded, courseInstanceLoading } = assignCourseInstanceReducer;
  const { user } = authReducer;
  const { teamsLoaded } = assignStudentDataReducer;
  const isInstructor = courseInstanceLoaded && user && courseInstance.hasInstructor.some((instructor) => instructor['@id'] === user.fullURI );
	return {
    courseInstance, courseInstanceLoaded, courseInstanceLoading,
    user,
    teamsLoaded,
    isInstructor
	};
};

export default connect(mapStateToProps, { assignmentsGetStudentTeams, assignmentsGetCourseInstance })(Assignments);
