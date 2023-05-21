import React, { useState, useEffect } from 'react';
import { connect } from "react-redux";
import { Alert } from 'reactstrap';

import AssignmentView from './assignmentView';
import AddAssignment from './assignment/add';
import { inputToTimestamp, getShortID, afterNow } from 'helperFunctions';
import { assignmentsGetStudentTeams, assignmentsGetCourseInstance } from 'redux/actions';
import { getAssignmentPeriods, assignPeriods } from './reusableFunctions';
import { 
  useLazyGetAssignmentQuery,
  useLazyGetAssignmentPeriodQuery,
  useLazyGetSubmissionForAssignmentQuery,
  useLazyGetAssignmentByCourseInstanceQuery,
} from 'services/assignments';


function Assignments(props) {
  const [assignments, setAssignments] = useState([])
  const [loadingAssignments, setLoadingAssignments] = useState(true)
  const [getAssignmentRequest] = useLazyGetAssignmentQuery()
  const [getAssignmentPeriodRequest] = useLazyGetAssignmentPeriodQuery()
  const [getSubmissionForAssignmentRequest] = useLazyGetSubmissionForAssignmentQuery()
  const [getAssignmentForCourseInstanceRequest] = useLazyGetAssignmentByCourseInstanceQuery()

  useEffect(() => {
    refreshAssignments(props)
  }, [props.user, props.courseInstance])

  useEffect(() =>{
    getCourseInstance()
    refreshAssignments(props)
  },[])

  const getCourseInstance = () => {
    if(props.courseInstanceLoaded 
      && !props.courseInstanceLoading 
      && getShortID(props.courseInstance['@id']) === props.match.params.courseInstanceID){
      return
    }
    props.assignmentsGetCourseInstance(props.match.params.courseInstanceID)
  }

  const assignSubmissions = (assignments, submissions) => {
    return assignments.map((ass, index) => ({
      ...ass,
      submissions:submissions[index]
    }))
  }

  const updateAssignment = (assignmentID) => {
    getAssignmentRequest(getShortID(assignmentID)).unwrap().then(assignmentData => {
      if(assignmentData) {
        let assignment = assignmentData[0]
        const periodsIDs = getAssignmentPeriods(assignment)
        let periods = []
        periodsIDs.forEach(periodsId => {
          getAssignmentPeriodRequest(getShortID(periodsId)).unwrap().then(data => {
            if(data) {
              periods.push(data[0])
            }
          })
        })
        
        getSubmissionForAssignmentRequest(getShortID(assignmentID)).unwrap().then(submissionData => {
          if(submissionData) {
            assignment.submissions = submissionData
          }
        })
  
        let newAssignments = [assignPeriods(assignment, periods)].concat(assignments.filter((assignment) => assignment['@id'] !== assignmentID ));
        newAssignments.sort((assignment1,assignment2) => inputToTimestamp(assignment1.createdAt) > inputToTimestamp(assignment2.createdAt) ? -1 : 1 );
        setAssignments(newAssignments)
      }
    })
  }

  const refreshAssignments = (argProps) => {
    if (argProps.courseInstance !== null && argProps.user !== null) {
      getAssignmentForCourseInstanceRequest(getShortID(argProps.courseInstance['@id'])).unwrap().then(assignmentData => {
        if (assignmentData) {
          let newAssignments = assignmentData.filter((result) => result['@type'].endsWith('ontology#Assignment'))
          const periodsIDs = newAssignments.map(getAssignmentPeriods).reduce(
            (acc,value)=>{
              return acc.concat(value)
            },[]
          )
  
          if (argProps.isInstructor) {
            let periods = []
            periodsIDs.forEach(periodsId => {
              getAssignmentPeriodRequest(getShortID(periodsId)).unwrap().then(data => {
                if(data) {
                  periods.push(data[0])
                }
              })
            })
  
            let submissions = []
            newAssignments.forEach(assignment => {
              getSubmissionForAssignmentRequest(getShortID(assignment['@id'])).unwrap().then(data => {
                if(data) {
                  submissions.push(data)
                }
              })
            })
  
            newAssignments = assignSubmissions(newAssignments, submissions);
            newAssignments = newAssignments.map((assignment) => assignPeriods(assignment, periods))
            newAssignments.sort((assignment1,assignment2) => inputToTimestamp(assignment1.createdAt) > inputToTimestamp(assignment2.createdAt) ? -1 : 1 );
            setAssignments(newAssignments)
            setLoadingAssignments(false)
          } else {
            props.assignmentsGetStudentTeams(argProps.user.fullURI, argProps.courseInstance['@id']);
            let periods = []
            periodsIDs.forEach(periodsId => {
              getAssignmentPeriodRequest(getShortID(periodsId)).unwrap().then(data => {
                if(data) {
                  periods.push(data[0])
                }
              })
            })
            
            newAssignments = newAssignments.map((assignment) => assignPeriods(assignment, periods));
            newAssignments.sort((assignment1,assignment2) => inputToTimestamp(assignment1.createdAt) > inputToTimestamp(assignment2.createdAt) ? -1 : 1 );
            setAssignments(newAssignments)
            setLoadingAssignments(false)
          }
        }
      })   
    }
  }

  const studentReadyAssignment = (assignment) => {
    return !afterNow(assignment.initialSubmissionPeriod.openTime) ||
    ( assignment.submissionImprovedSubmission && !afterNow(assignment.improvedSubmissionPeriod.openTime) ) ||
    ( !assignment.reviewsDisabled && !afterNow(assignment.peerReviewPeriod.openTime) ) ||
    ( !assignment.teamsDisabled && !assignment.teamReviewsDisabled && !afterNow(assignment.peerReviewPeriod.openTime) )
  }

  if(loadingAssignments || !props.courseInstance ||(!props.isInstructor && !props.teamsLoaded)){
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
        Assignments { props.user !== null &&
          props.courseInstance.hasInstructor.some((instructor) => instructor['@id'] === props.user.fullURI ) &&
          <AddAssignment updateAssignment={updateAssignment} /> }
      </h1>

      <Alert color="warning" className="mt-3" isOpen={assignments.length === 0 }>
        There are currently no assignments.
      </Alert>
      {
        (props.isInstructor ? assignments : assignments.filter(studentReadyAssignment) ).map((assignment)=>
        <AssignmentView key={assignment['@id']}
          assignment={assignment}
          history={props.history}
          updateAssignment={updateAssignment}
          removeAssignment={()=>{
            let newAssignments = state.assignments.filter((assignment2) => assignment2['@id'] !== assignment['@id'] )
            setAssignments(newAssignments)
          }}
          />)
      }
    </div>
  )
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
