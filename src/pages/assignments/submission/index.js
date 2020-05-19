import React, { Component } from 'react';
import { Button, Card, CardHeader, CardBody,TabContent, TabPane, Nav, NavItem, NavLink, Alert } from 'reactstrap';
import classnames from 'classnames';
import { connect } from "react-redux";
import Select from 'react-select';

import { axiosGetEntities, getResponseBody, getShortID, toSelectInput, periodHappening, periodHasEnded, periodStarted } from 'helperFunctions'
import { assignmentsGetStudentTeams, assignmentsEmptyStudentTeams, assignmentsGetCourseInstance } from 'redux/actions';
import { getAssignmentPeriods, assignPeriods } from '../reusableFunctions';
import { teamSelectStyle } from '../selectStyle';

import Submission from './submission';
import CodeReview from './codeReview';
import Reviews from './peerReview';
import TeamReview from './teamReview';

class SubmissionContainer extends Component{
  constructor(props){
    super(props);
    this.state={
      assignment: null,
      assignmentLoaded: false,

      initialSubmission: null,
      improvedSubmission: null,
      submissionsLoaded: false,
      toReview: null,

      settings: null,
      error: '',
      errorShow: false,
      tabID: this.props.match.params.tabID ? this.props.match.params.tabID: 'submission',
    }
    this.props.assignmentsEmptyStudentTeams();
    this.getCourseInstance();
  }

  componentWillReceiveProps(props){
    if( this.props.user === null && props.user !== null && !this.state.submissionsLoaded && this.state.assignmentLoaded ){
      this.refreshSubmissions(this.state.settings, this.state.assignment, props);
    }
    if(
      !props.teamsLoaded &&
      props.user !== null &&
      props.courseInstanceLoaded &&
      this.state.assignmentLoaded &&
      !props.isInstructor &&
      this.state.settings.teamAssignment
    ){
      props.assignmentsGetStudentTeams(props.user.fullURI, props.courseInstance['@id'] );
    }
  }

  refreshAssignment(){ //always get assignment
    axiosGetEntities(`assignment/${this.props.match.params.assignmentID}?_join=hasField`).then((response) => {
      if(response.failed){
        this.setState({ error:'Assignment not found',errorShow:true })
        return;
      }
      let assignment = getResponseBody(response)[0];
      let periodsIDs = getAssignmentPeriods(assignment)
      Promise.all(periodsIDs.map((period) => axiosGetEntities(`assignmentPeriod/${getShortID(period)}`) )).then((periodResponses)=>{
        let periods = periodResponses.map((response) => getResponseBody(response)[0]);
        assignment = assignPeriods(assignment, periods);
        const settings = this.getAssignmentSettings(assignment);
        if( !this.props.isInstructor && settings.teamAssignment && this.props.courseInstanceLoaded && this.props.user !== null ){
          this.props.assignmentsGetStudentTeams(this.props.user.fullURI, this.props.courseInstance['@id'] );
        }
        this.refreshSubmissions(settings, assignment, this.props);
        this.setState({ assignment, settings, assignmentLoaded: true })
      })
    })
  }

  getAssignmentSettings(assignment){
    const teamAssignment = !assignment.teamsDisabled;
    const teamReviewEnabled = teamAssignment && !assignment.teamReviewsDisabled;
    const peerReviewEnabled = !assignment.reviewsDisabled;
    const myAssignment = !this.props.match.params.targetID && !this.props.match.params.toReviewID;
    const isInstructor = this.props.isInstructor;
    const peerReview = peerReviewEnabled && this.props.match.params.toReviewID !== undefined;
    return {
      teamAssignment,
      teamReviewEnabled,
      peerReviewEnabled,
      myAssignment,
      isInstructor,
      peerReview,
    }
  }

  getID(settings, props){
    let ID = null;
    if(settings.myAssignment && settings.teamAssignment && props.match.params.teamID ){
      ID = props.match.params.teamID;
    }else if(settings.myAssignment && !settings.teamAssignment){
      ID = props.user.id;
    }else if(settings.isInstructor && props.match.params.targetID){
      ID = props.match.params.targetID;
    }
    return ID;
  }

  refreshSubmissions(settings, assignment, props){
    if(props.user === null){
      return;
    }
    if(settings.peerReview && props.match.params.toReviewID){
      axiosGetEntities(`toReview/${props.match.params.toReviewID}?_join=submission`).then((response)=>{
        const toReview = getResponseBody(response)[0];
        const initialSubmission = toReview.submission.length > 0 ? toReview.submission[0] : null;
        const improvedSubmission = null;
        this.setState({
          toReview: toReview,
          submissionsLoaded: true,
          initialSubmission: initialSubmission !== undefined ? initialSubmission : null,
          improvedSubmission: improvedSubmission !== undefined ? improvedSubmission : null,
        })
      })
      return;
    }
    const ID = this.getID(settings,props);
    if(ID === null){
      this.setState({error:'Please select your team.', errorShow:true})
      return;
    }
    axiosGetEntities(`submission?${settings.teamAssignment ? 'submittedByTeam': 'submittedByStudent'}=${ID}&ofAssignment=${getShortID(assignment['@id'])}&_join=submittedField`).then((response) => {
      const submissions = getResponseBody(response);
      const initialSubmission = submissions.find( (submission) => !submission.isImproved );
      const improvedSubmission = submissions.find( (submission) => submission.isImproved );
      this.setState({
        submissionsLoaded: true,
        initialSubmission: initialSubmission !== undefined ? initialSubmission : null,
        improvedSubmission: improvedSubmission !== undefined ? improvedSubmission : null,
      })
    })
  }

  getCourseInstance(){
    if(this.props.courseInstanceLoaded && !this.props.courseInstanceLoading && getShortID(this.props.courseInstance['@id']) === this.props.match.params.courseInstanceID){
      return;
    }
    this.props.assignmentsGetCourseInstance(this.props.match.params.courseInstanceID)
  }

  getAssignmentName(){
    let name = this.state.assignment.name;
    let fieldType = this.state.assignment.hasField.find( (field) => field.fieldType === 'title' );
    if( fieldType !== undefined && ( this.state.initialSubmission !== null || this.state.improvedSubmission !== null ) ){
      if( this.state.initialSubmission ){
        name = this.state.initialSubmission.submittedField.find( (submittedField) => submittedField.field[0]['@id'] === fieldType['@id'] ).value;
      }
      if( this.state.improvedSubmission ){
        name = this.state.improvedSubmission.submittedField.find( (submittedField) => submittedField.field[0]['@id'] === fieldType['@id'] ).value;
      }
    }
    return name;
  }

  componentWillMount(){
    this.refreshAssignment();
  }

  render(){
    const settings = this.state.settings;
    const assignment = this.state.assignment;
    let loading = !this.state.assignmentLoaded ||
      !this.state.submissionsLoaded ||
      this.props.courseInstanceLoading ||
      (!settings.isInstructor && settings.teamAssignment && !this.props.teamsLoaded);
    if( loading ){
      return(
        <div className="assignmentContainer center-ver mt-3">
          <Card className="assignmentsContainer center-ver">
            <CardHeader className="row">
              <Button size="sm" color="" onClick={()=>this.props.history.goBack()}>
                <i className="fa fa-arrow-left clickable" />
              </Button>
              <h4 className="center-hor ml-5 mr-auto">
                {"Loading..."}
              </h4>
              { this.props.teamsLoaded && settings !==null && settings.myAssignment && this.props.match.params.teamID === undefined &&
                <Select
                  styles={teamSelectStyle}
                  value={toSelectInput(this.props.teams,'name','@id').find((team) => getShortID(team.value) === this.props.match.params.teamID )}
                  options={toSelectInput(this.props.teams,'name','@id')}
                  onChange={(newTeam)=>{
                    if(this.props.match.params.teamID !== undefined && !window.confirm('Changing team will not save your current progress!')){
                      return;
                    }
                    this.props.history.push(`../team/${getShortID(newTeam['@id'])}/submission/${this.state.tabID}`)
                  }}
                  />
              }
            </CardHeader>
            <CardBody>
              <Alert color="danger" isOpen={this.state.errorShow}>
                {this.state.error}
              </Alert>
              <Alert color="primary" isOpen={loading && !this.state.errorShow}>
                Data is loading!
              </Alert>
            </CardBody>
          </Card>
        </div>
      )
    }

    return(
      <div className="assignmentContainer center-ver mt-3">
        <Card className="assignmentsContainer center-ver">
          <CardHeader className="row">
            <Button size="sm" color="" onClick={()=>this.props.history.goBack()}>
              <i className="fa fa-arrow-left clickable" />
            </Button>
            <h4 className="center-hor ml-5 mr-auto">
              {this.getAssignmentName()}
            </h4>
            { settings.myAssignment && settings.teamAssignment &&
              <Select
                styles={teamSelectStyle}
                value={toSelectInput(this.props.teams,'name','@id').find((team) => getShortID(team.value) === this.props.match.params.teamID )}
                options={toSelectInput(this.props.teams,'name','@id')}
                onChange={(newTeam)=>{
                  if(this.props.match.params.teamID !== undefined && !window.confirm('Changing team will not save your current progress!')){
                    return;
                  }
                  this.props.history.push(`../../${getShortID(newTeam['@id'])}/submission/${this.state.tabID}`)
                }}
                />
            }
          </CardHeader>
          <CardBody>
            <Nav tabs>
              <NavItem>
                <NavLink
                  className={classnames({ active: this.state.tabID === 'submission', clickable:true })}
                  onClick={() => this.setState({ tabID: 'submission' }) }
                  >
                  Submissions
                </NavLink>
              </NavItem>
              { settings.peerReviewEnabled &&
                (
                  ( (settings.myAssignment || settings.isInstructor) && periodHasEnded(assignment.peerReviewPeriod) ) ||
                  ( settings.peerReview && periodStarted(assignment.peerReviewPeriod) )
                ) &&
                <NavItem>
                  <NavLink
                    className={classnames({ active: this.state.tabID === 'reviews', clickable:true })}
                    onClick={() => this.setState({ tabID: 'reviews' }) }
                    >
                    Reviews
                  </NavLink>
                </NavItem>
              }
              { settings.peerReviewEnabled && !assignment.hasField.some((field) => field.fieldType === "codeReview" ) &&
                (
                  ( (settings.myAssignment || settings.isInstructor) && periodHasEnded(assignment.peerReviewPeriod) ) ||
                  ( settings.peerReview && periodStarted(assignment.peerReviewPeriod) )
                ) &&
                <NavItem>
                  <NavLink
                    className={classnames({ active: this.state.tabID === 'codeReview', clickable:true })}
                    onClick={() => this.setState({ tabID: 'codeReview' }) }
                    >
                    Code reviews
                  </NavLink>
                </NavItem>
              }
              { settings.teamReviewEnabled &&
                (
                  ( settings.myAssignment && periodStarted(assignment.teamReviewPeriod) ) ||
                  ( settings.isInstructor && periodHasEnded(assignment.teamReviewPeriod) )
                ) &&
                <NavItem>
                  <NavLink
                    className={classnames({ active: this.state.tabID === 'teamReview', clickable:true })}
                    onClick={() => this.setState({ tabID: 'teamReview' }) }
                    >
                    Team review
                  </NavLink>
                </NavItem>
              }
            </Nav>

            <TabContent activeTab={this.state.tabID}>
              <TabPane tabId={'submission'}>
                <Submission
                  assignment={this.state.assignment}
                  settings={this.state.settings}
                  initialSubmission={this.state.initialSubmission}
                  improvedSubmission={this.state.improvedSubmission}
                  refreshAssignment={this.refreshAssignment.bind(this)}
                  history={this.props.history}
                  match={this.props.match}
                  />
              </TabPane>
              { settings.peerReviewEnabled &&
                (
                  ( (settings.myAssignment || settings.isInstructor) && periodHasEnded(assignment.peerReviewPeriod) ) ||
                  ( settings.peerReview && periodStarted(assignment.peerReviewPeriod) )
                ) &&
                <TabPane tabId={'reviews'}>
                  <Reviews
                    history={this.props.history}
                    match={this.props.match}
                    assignment={this.state.assignment}
                    settings={this.state.settings}
                    toReview={this.state.toReview}
                    initialSubmission={this.state.initialSubmission}
                    />
                </TabPane>
              }
              { settings.peerReviewEnabled &&
                (
                  ( (settings.myAssignment || settings.isInstructor) && periodHasEnded(assignment.peerReviewPeriod) ) ||
                  ( settings.peerReview && periodStarted(assignment.peerReviewPeriod) )
                ) &&
                <TabPane tabId={'codeReview'}>
                  <CodeReview
                    history={this.props.history}
                    match={this.props.match}
                    assignment={this.state.assignment}
                    settings={this.state.settings}
                    initialSubmission={this.state.initialSubmission}
                    improvedSubmission={this.state.improvedSubmission}
                    />
                </TabPane>
              }
              { settings.teamReviewEnabled &&
                (
                  ( settings.myAssignment && periodStarted(assignment.teamReviewPeriod) ) ||
                  ( settings.isInstructor && periodHasEnded(assignment.teamReviewPeriod) )
                ) &&
                <TabPane tabId={'teamReview'}>
                  <TeamReview
                    history={this.props.history}
                    match={this.props.match}
                    assignment={this.state.assignment}
                    settings={this.state.settings}
                    initialSubmission={this.state.initialSubmission}
                    improvedSubmission={this.state.improvedSubmission}
                    />
                </TabPane>
              }
            </TabContent>
          </CardBody>
        </Card>
      </div>
    )
  }
}

const mapStateToProps = ({assignCourseInstanceReducer, authReducer, assignStudentDataReducer}) => {
  const { courseInstance, courseInstanceLoaded, courseInstanceLoading } = assignCourseInstanceReducer;
  const { user } = authReducer;
  const { teamsLoaded, teams } = assignStudentDataReducer;
  const isInstructor = courseInstanceLoaded && user && courseInstance.hasInstructor.some((instructor) => instructor['@id'] === user.fullURI );
  return {
    courseInstance, courseInstanceLoaded, courseInstanceLoading,
    teamsLoaded, teams,
    user,
    isInstructor
  };
};

export default connect(mapStateToProps, { assignmentsGetStudentTeams, assignmentsEmptyStudentTeams, assignmentsGetCourseInstance })(SubmissionContainer);
