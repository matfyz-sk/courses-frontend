import React, { Component } from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, NavItem, NavLink, Nav, TabContent, TabPane, Alert } from 'reactstrap';
import classnames from 'classnames';
import { connect } from "react-redux";
import { editAssignment } from '../reusableFunctions';
import { getResponseBody, axiosGetEntities, getShortID, timestampToInput } from 'helperFunctions';
import { infoOK, fieldsOK, submissionOK, teamsOK, reviewsOK, teamReviewsOK,getRealDeadline } from './verify';

import Info from './0-info';
import Submission from './1-submission';
import Fields from './2-fields';
import Teams from './3-teams';
import Reviews from './4-reviews';
import TeamReviews from './5-teamReviews';

class ModalAddAssignment extends Component {
  constructor(props){
    super(props);
    this.state = {
      activeTab:'1',
      opened: false,
      showErrors: true,
      allQuestions: [],
      allMaterials: [],
      formLoaded: false,
      saving: false
    }
    this.newID = 0;
    this.toggle.bind(this);
    this.canSave.bind(this);
    this.loadForm.bind(this);
    this.prepareForm.bind(this);
  }

  getNewID(){
    return this.newID++;
  }

  deleteMaterial(material){
    let info = { ...this.state.info };
    info.hasMaterial = info.hasMaterial.filter((material2) => material2['@id'] !== material['@id'] )
    this.setState({ info })
  }

  addMaterial( materialData ){
    let material = {...materialData }
    if( materialData.new === undefined ){
      material.new = true;
      material['@id'] = '#n-' + this.getNewID();
    }
    let info = { ...this.state.info };
    info.hasMaterial.push(material);
    if( materialData.new === undefined ){
      this.setState({ info, allMaterials: [ ...this.state.allMaterials, material ] })
    }else{
      this.setState({ info })
    }
  }

  deleteQuestion(question){
    let reviews = { ...this.state.reviews };
    reviews.questions = reviews.questions.filter((question2) => question2['@id'] !== question['@id'] )
    this.setState({ reviews })
  }

  addQuestion( questionData ){
    let question = {...questionData }
    if( questionData.new === undefined ){
      question.new = true;
      question['@id'] = '#n-' + this.getNewID();
    }
    let reviews = { ...this.state.reviews };
    reviews.questions.push(question);
    if( questionData.new === undefined ){
      this.setState({ reviews, allQuestions: [ ...this.state.allQuestions, question ] })
    }else{
      this.setState({ reviews })
    }
  }

  loadForm(){
    const assignment = this.props.assignment;
    let axiosFields = assignment.hasField.map((field) => axiosGetEntities(`field/${getShortID(field['@id'])}`) );
    Promise.all([
      axiosGetEntities('PeerReviewQuestion'),
      axiosGetEntities('material'),
      Promise.all( axiosFields )
    ])
    .then(([questionResponse,materialResponse, fieldResponses])=>{
      let allQuestions = getResponseBody(questionResponse).map((question)=>({ ...question, new: false }));
      let allMaterials = getResponseBody(materialResponse).filter( (material) => material.URL !== undefined ).map((material)=>({...material, new:false }));
      let fields = fieldResponses.map((response) => getResponseBody(response)[0] );
      this.setState({
        allQuestions,
        allMaterials
      }, () => this.prepareForm.bind(this)(fields));
    })
  }

  prepareForm(fields){
    const assignment = this.props.assignment;
    const materialIDs = assignment.hasMaterial.map((material) => material['@id'] );
    let form = {
      info:{
        name: assignment.name,
        description: assignment.description,
        shortDescription: assignment.shortDescription,
        hasMaterial: this.state.allMaterials.filter( (material) => materialIDs.includes(material['@id']) ),
      },
      fields:{
        fields: fields.map( (field) => ({
          id: field['@id'],
          title: field.name,
          description: field.description,
          type:{
            label: field.label,
            value: field.fieldType,
          },
          fieldID: field['@id'],
          exists: true,
        })),
      }, //DOLE
      submission:{
        anonymousSubmission: assignment.submissionAnonymousSubmission,
        openTime: timestampToInput(assignment.initialSubmissionPeriod.openTime),
        deadline: timestampToInput(assignment.initialSubmissionPeriod.deadline),
        extraTime: assignment.initialSubmissionPeriod.extraTime,
        improvedSubmission: assignment.submissionImprovedSubmission,
        improvedOpenTime: (assignment.submissionImprovedSubmission && timestampToInput(assignment.improvedSubmissionPeriod.openTime)) || '',
        improvedDeadline: (assignment.submissionImprovedSubmission && timestampToInput(assignment.improvedSubmissionPeriod.deadline)) || '',
        improvedExtraTime: (assignment.submissionImprovedSubmission && assignment.improvedSubmissionPeriod.extraTime) || ''
      },
      teams:{
        disabled: assignment.teamsDisabled,
        submittedAsTeam: (!assignment.teamsDisabled && assignment.teamsSubmittedAsTeam) || true,
        minimumInTeam: (!assignment.teamsDisabled && assignment.teamsMinimumInTeam) || 2,
        maximumInTeam: (!assignment.teamsDisabled && assignment.teamsMaximumInTeam) || 2,
        multipleSubmissions: (!assignment.teamsDisabled && (assignment.teamsMultipleSubmissions === "true" || assignment.teamsMultipleSubmissions === true) ),
      },
      reviews:{
        disabled: assignment.reviewsDisabled,
        openTime: (!assignment.reviewsDisabled && timestampToInput(assignment.peerReviewPeriod.openTime) ) || '',
        deadline: (!assignment.reviewsDisabled && timestampToInput(assignment.peerReviewPeriod.deadline) ) || '',
        extraTime: (!assignment.reviewsDisabled && assignment.peerReviewPeriod.extraTime ) || 15,
        reviewsPerSubmission: (!assignment.reviewsDisabled && assignment.reviewsPerSubmission ) || 3,
        reviewedByTeam: (!assignment.reviewsDisabled && assignment.reviewedByTeam ) || !assignment.teamsDisabled,
        visibility: (!assignment.reviewsDisabled && assignment.reviewsVisibility ) || 'blind',
        questions:  (!assignment.reviewsDisabled && this.state.allQuestions.filter((question) => assignment.reviewsQuestion.some((reviewQuestion) => question['@id'] === reviewQuestion['@id'] ) ) ) || []
      },
      teamReviews:{
        disabled: assignment.teamReviewsDisabled,
        openTime: (!assignment.teamReviewsDisabled && timestampToInput(assignment.teamReviewPeriod.openTime) ) || '',
        deadline: (!assignment.teamReviewsDisabled && timestampToInput(assignment.teamReviewPeriod.deadline) ) || '',
        extraTime: (!assignment.teamReviewsDisabled && assignment.teamReviewPeriod.extraTime ) || 15,
      }
    }
    this.setState({ defaultForm: form, ...form, formLoaded: true })
  }

  toggle(){
    let isOpen = this.state.opened;
    this.setState({opened:!this.state.opened, formLoaded: false })
    if(!isOpen){
      this.loadForm();
    }
  }

  setDefaults(){
    if(window.confirm('Are you sure you want to reset all assignment settings?')){
      let reviews = { ...this.state.defaultForm.reviews };
      reviews.questions = [...this.state.defaultForm.reviews.questions];
      let info = { ...this.state.defaultForm.info };
      info.hasMaterial = [...this.state.defaultForm.info.hasMaterial];
      this.setState({...this.state.defaultForm, info, reviews });
    }
  }

  canSave(){
    return this.state.formLoaded && infoOK(this.state.info) &&
      fieldsOK(this.state.fields) &&
      submissionOK(this.state.submission) &&
      teamsOK(this.state.teams) &&
      reviewsOK(this.state.reviews, getRealDeadline( this.state.submission ) ) &&
      teamReviewsOK(this.state.teams, this.state.teamReviews, getRealDeadline( this.state.submission ) )
  }

  submitAssignment(){
    this.setState({ saving: true })
    editAssignment(
      {
        info: this.state.info,
        fields: this.state.fields,
        submission: this.state.submission,
        teams: this.state.teams,
        reviews: this.state.reviews,
        teamReviews: this.state.teamReviews,
      },
      this.props.assignment,
      (response)=>{
        this.props.updateAssignment(this.props.assignment['@id']);
        this.toggle();
        this.setState({ saving: false })
      }
    );
  }

  render(){
    return(
      <div className="ml-auto center-hor">
        <Button outline color="primary" className="p-1" style={{width:34}} onClick={this.toggle.bind(this)}><i className="fa fa-pen" /></Button>
        <Modal isOpen={this.state.opened} className={this.props.className} style={{width:'auto',maxWidth:1000}}>
          <ModalHeader toggle={this.toggle.bind(this)}>
            Editting assignment: {this.props.assignment.name}
          </ModalHeader>
          <ModalBody>
            <Nav tabs className="b-0">
              <NavItem>
                <NavLink
                  className={classnames({ active: this.state.activeTab === '1',hasError: !this.state.formLoaded || !infoOK(this.state.info)}, "clickable")}
                  onClick={() => { this.setState({activeTab:'1'}) }}
                >
                  Info
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink
                  className={classnames({ active: this.state.activeTab === '2',hasError: !this.state.formLoaded || !submissionOK(this.state.submission)}, "clickable")}
                  onClick={() => { this.setState({activeTab:'2'}) }}
                  >
                  Submission
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink
                  className={classnames({ active: this.state.activeTab === '3',hasError: !this.state.formLoaded || !fieldsOK(this.state.fields)}, "clickable")}
                  onClick={() => { this.setState({activeTab:'3'}) }}
                >
                  Fields
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink
                  className={classnames({ active: this.state.activeTab === '4',hasError: !this.state.formLoaded || !teamsOK(this.state.teams)}, "clickable")}
                  onClick={() => { this.setState({activeTab:'4'}) }}
                >
                  Teams
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink
                  className={classnames({ active: this.state.activeTab === '5',hasError: !this.state.formLoaded || !reviewsOK(this.state.reviews,getRealDeadline( this.state.submission ))}, "clickable")}
                  onClick={() => { this.setState({activeTab:'5'}) }}
                >
                  Reviews
                </NavLink>
              </NavItem>
              {
                this.state.formLoaded && !this.state.teams.disabled && <NavItem>
                <NavLink
                  className={classnames({ active: this.state.activeTab === '6',hasError: !this.state.formLoaded || !teamReviewsOK(this.state.teams,this.state.teamReviews,getRealDeadline( this.state.submission ))}, "clickable")}
                  onClick={() => { this.setState({activeTab:'6'}) }}
                >
                  Team Reviews
                </NavLink>
              </NavItem>
            }
            </Nav>
            { this.state.formLoaded &&
              <TabContent activeTab={this.state.activeTab}>
              <TabPane tabId="1">
                <Info
                  data={this.state.info}
                  allMaterials={this.state.allMaterials}
                  addMaterial={ this.addMaterial.bind(this) }
                  deleteMaterial={ this.deleteMaterial.bind(this) }
                  showErrors={this.state.showErrors}
                  setData={(info)=>{this.setState({info})}}
                  />
              </TabPane>
              <TabPane tabId="2">
                <Submission
                  data={this.state.submission}
                  showErrors={this.state.showErrors}
                  setData={(submission)=>{this.setState({submission})}}
                  setSubmissionAnonymous={(anonymousSubmission)=>{
                    if(anonymousSubmission && this.state.reviews.visibility==='open'){
                      this.setState({submission:{...this.state.submission,anonymousSubmission},reviews:{...this.state.reviews,visibility:'blind'}});
                    }else{
                      this.setState({submission:{...this.state.submission,anonymousSubmission}});
                    }
                  }}
                  initialDeadline={ getRealDeadline(this.state.submission) }
                  />
              </TabPane>
              <TabPane tabId="3">
                <Fields data={this.state.fields} showErrors={this.state.showErrors} setData={(fields)=>{this.setState({fields})}} />
              </TabPane>
              <TabPane tabId="4">
                <Teams
                  data={this.state.teams}
                  showErrors={this.state.showErrors}
                  setData={(teams)=>{this.setState({teams})}}
                  setTeamsDisabled={(disabled)=>{
                    this.setState({ teams: { ...this.state.teams, disabled },reviews: { ...this.state.reviews, reviewedByTeam: !disabled } });
                  }}
                  />
              </TabPane>
              <TabPane tabId="5">
                <Reviews
                  data={this.state.reviews}
                  allQuestions={this.state.allQuestions}
                  addQuestion={ this.addQuestion.bind(this) }
                  deleteQuestion={ this.deleteQuestion.bind(this) }
                  showErrors={this.state.showErrors}
                  openDisabled={this.state.submission.anonymousSubmission}
                  teamsDisabled={this.state.teams.disabled}
                  setData={(reviews)=>{this.setState({reviews})}}
                  initialDeadline={ getRealDeadline(this.state.submission) }
                  />
              </TabPane>
              <TabPane tabId="6">
                <TeamReviews
                  data={this.state.teamReviews}
                  showErrors={this.state.showErrors}
                  setData={(teamReviews)=>{this.setState({teamReviews})}}
                  initialDeadline={ getRealDeadline(this.state.submission) }
                  />
              </TabPane>
            </TabContent>
          }
          <Alert color="primary" isOpen={!this.state.formLoaded}>
            Data is loading!
          </Alert>
          <Alert color="primary" isOpen={this.state.saving}>
            Saving assignment, please wait!
          </Alert>
          </ModalBody>
          <ModalFooter>
            <span className="mr-auto">
              <Button outline color="secondary" onClick={this.toggle.bind(this)}>Cancel</Button>
            </span>
            <span>
              <Button color="danger" onClick={this.setDefaults.bind(this)}>Reset</Button>{' '}
              <Button color="primary" disabled={this.state.activeTab==="1"} onClick={()=>this.setState({activeTab:(parseInt(this.state.activeTab)-1)+""})}>Prev</Button>{' '}
              <Button color="primary" disabled={this.state.activeTab==="6"} onClick={()=>{ this.setState({activeTab:(parseInt(this.state.activeTab)+1)+""});}}>Next</Button>{' '}
              <Button color="success" disabled={!this.canSave() || this.state.saving} onClick={this.submitAssignment.bind(this)}>{this.state.saving? 'Saving assignment' : 'Save assignment'}</Button>
            </span>
          </ModalFooter>
        </Modal>
      </div>
    )
  }
}


const mapStateToProps = ({courseInstanceReducer}) => {
	const { courseInstance } = courseInstanceReducer;
	return {
    courseInstance
	};
};

export default connect(mapStateToProps, {  })(ModalAddAssignment);
