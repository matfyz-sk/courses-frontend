import React, { useState } from 'react';
import { Collapse, CardBody, Card, Button } from 'reactstrap';
import { connect } from "react-redux";
import classnames from 'classnames';
import { afterNow, getShortID } from 'helperFunctions';

import InstructorAssignmentView from './instructorView';
import StudentAssignmentView from './studentView';
import EditAssignment from '../assignment/edit';
import { useDeleteAssignmentMutation, useDeleteAssignmentPeriodMutation } from 'services/assignments';

function AssignmentView(props) {
  const [opened, setOpened] = useState(getDefaultOpenState())
  const [deleting, setDeleting] = useState(false)
  const [deleteAssignmentRequest, deleteAssignmentRequestResult] = useDeleteAssignmentMutation()
  const [deleteAssignmentPeriodRequest, deleteAssignmentPeriodRequestResult] = useDeleteAssignmentPeriodMutation()

  const getDefaultOpenState = () => {
    return afterNow(props.assignment.initialSubmissionPeriod.deadline) 
    || (props.assignment.submissionImprovedSubmission && afterNow(props.assignment.improvedSubmissionPeriod.deadline)) 
    || (!props.assignment.reviewsDisabled && afterNow(props.assignment.peerReviewPeriod.deadline)) 
    || (!props.assignment.teamReviewsDisabled && !props.assignment.teamsDisabled && afterNow(props.assignment.teamReviewPeriod.deadline))
    || (instructorWillRate()) //bud prebiehaju alebo ich treba ohodnotit
  }

  const instructorWillRate = () => {
    if(!props.isInstructor){
      return false
    }
    let groupedSubmissions = groupSubmissions(props.assignment.submissions, props.assignment.teamsDisabled )
    return groupedSubmissions.some((group) => !group.submissions.some((submission) => submission.teacherRating !== undefined ))
  }

  const groupSubmissions = (submissions, individualGrouping) => {
    let groupedSubmissions = [];
    submissions.forEach((submission)=>{
      const id = individualGrouping ? submission.submittedByStudent[0]['@id'] : submission.submittedByTeam[0]['@id'];
      const index = groupedSubmissions.findIndex( (gSubmission) => gSubmission.id === id )
      if(index === -1){
        groupedSubmissions.push({
          id,
          submissions: [submission],
        })
      }else{
        groupedSubmissions[index].submissions.push(submission)
      }
    })
    return groupedSubmissions;
  }

  const deleteAssignment = () => {
    const assignment = props.assignment;
    if(window.confirm(`Are you sure you want to delete assignment "${assignment.name}"?`)){
      setDeleting(true)
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
      periodsToDelete.forEach(period => {
        deleteAssignmentPeriodRequest(getShortID(period['@id'])).unwrap()
      })
      deleteAssignmentRequest(getShortID(assignment['@id'])).unwrap().then(response => {
        setDeleting(false)
        props.removeAssignment();
      })
    }
  }

  return(
    <div className="assignmentViewContainer center-ver">
      <div className="row">
        <h3 className={classnames({'greyed-out': !getDefaultOpenState()})}>{props.assignment.name}</h3>
        { props.isInstructor &&
          <EditAssignment updateAssignment={props.updateAssignment} assignment={props.assignment} />
        }
        { props.isInstructor &&
        <Button
          outline
          color="danger"
          className="ml-1 center-hor p-1"
          style={{width:34}}
          onClick={deleteAssignment}
          >
          <i className="fa fa-trash" />
        </Button>
        }
        <Button color="link"
          className={classnames({ 'ml-auto': !props.isInstructor })}
          onClick={() => setOpened(!opened)}
          style={ opened ? {marginLeft:'0.35em'} : {} }
          >
          {opened ? 'Hide' : 'Show'}
        </Button>
      </div>
      <Collapse isOpen={opened}>
        <Card>
          <CardBody>
            <div dangerouslySetInnerHTML ={{__html: props.assignment.shortDescription }} />
            <h5>{props.assignment.teamsDisabled ? 'Individual' : 'Team based'}</h5>
            { props.isInstructor && <InstructorAssignmentView history={props.history} updateAssignment={props.updateAssignment} assignment={props.assignment} /> }
            { !props.isInstructor && <StudentAssignmentView history={props.history} assignment={props.assignment} /> }
          </CardBody>
        </Card>
      </Collapse>
    </div>
  )
}

const mapStateToProps = ({assignCourseInstanceReducer, authReducer}) => {
  const { courseInstance } = assignCourseInstanceReducer;
  const { user } = authReducer;
  return {
    isInstructor: courseInstance.hasInstructor.some((instructor) => instructor['@id'] === user.fullURI)
  };
};

export default connect(mapStateToProps, {  })(AssignmentView);
