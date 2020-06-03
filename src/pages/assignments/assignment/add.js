import React, { Component } from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, NavItem, NavLink, Nav, TabContent, TabPane, Alert } from 'reactstrap';
import classnames from 'classnames';
import { connect } from "react-redux";
import { addAssignment } from '../reusableFunctions';
import { axiosGetEntities, getIRIFromAddResponse } from 'helperFunctions';
import { infoOK, fieldsOK, submissionOK, teamsOK, reviewsOK, teamReviewsOK, getRealDeadline } from './verify';

import Info from './0-info';
import Submission from './1-submission';
import Fields from './2-fields';
import Teams from './3-teams';
import Reviews from './4-reviews';
import TeamReviews from './5-teamReviews';

const defaultForm={
  info:{
    name:'',
    description: "",
    shortDescription: ``,
    hasMaterial:[],
  },
  fields:{
    fields:[],
  },
  submission:{
    anonymousSubmission: false,
    openTime: "",
    deadline: "",
    extraTime: 15,
    improvedSubmission: false,
    improvedOpenTime: "",
    improvedDeadline: "",
    improvedExtraTime:15
  },
  teams:{
    disabled:false,
    submittedAsTeam:true,
    minimumInTeam:2,
    maximumInTeam:2,
    multipleSubmissions:false,
  },
  reviews:{
    disabled:false,
    openTime: "",
    deadline: "",
    extraTime:15,
    reviewsPerSubmission:3,
    reviewedByTeam:true,
    visibility:'blind',
    questions:[]
  },
  teamReviews:{
    disabled:false,
    openTime: "",
    deadline: "",
    extraTime:15
  }
}

class ModalAddAssignment extends Component {
  constructor(props){
    super(props);
    this.state = {
      activeTab:'1',
      opened: false,
      showErrors: true,
      ...defaultForm,
      allQuestions: [],
      allMaterials: [],
      formLoaded: false,
      saving: false
    }
    this.newID = 0;
    this.toggle.bind(this);
    this.canSave.bind(this);
    infoOK.bind(this);
    submissionOK.bind(this);
    teamsOK.bind(this);
    reviewsOK.bind(this);
    teamReviewsOK.bind(this);
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

  toggle(){
    let isOpen = this.state.opened;
    this.setState({opened:!this.state.opened, formLoaded: false })
    if(!isOpen){
      Promise.all([
        axiosGetEntities('PeerReviewQuestion'),
        axiosGetEntities('material')
      ])
      .then(([questions,materials])=>{
        this.setState({
          formLoaded: true,
          allQuestions: questions.response.data['@graph'].map((question)=>({...question, new:false })),
          allMaterials: materials.response.data['@graph'].filter( (material) => material.URL !== undefined ).map((material)=>({...material, new:false })),
        });
      })
    }
  }

  setDefaults(){
    if(window.confirm('Are you sure you want to reset all assignment settings?')){
      let reviews = { ...defaultForm.reviews };
      reviews.questions = [];
      let info = { ...defaultForm.info };
      info.hasMaterial = [];
      this.setState({...defaultForm, info, reviews });
    }
  }

  canSave(){
    return infoOK(this.state.info) &&
      fieldsOK(this.state.fields) &&
      submissionOK(this.state.submission) &&
      teamsOK(this.state.teams) &&
      reviewsOK(this.state.reviews, getRealDeadline( this.state.submission ) ) &&
      teamReviewsOK(this.state.teams, this.state.teamReviews, getRealDeadline( this.state.submission ) )
  }

  submitAssignment(){
    this.setState({ saving: true })
    addAssignment(
      {
        info: this.state.info,
        fields: this.state.fields,
        submission: this.state.submission,
        teams: this.state.teams,
        reviews: this.state.reviews,
        teamReviews: this.state.teamReviews,
      },
      this.props.courseInstance['@id'],
      (response)=>{
        let reviews = { ...defaultForm.reviews };
        reviews.questions = [];
        let info = { ...defaultForm.info };
        info.hasMaterial = [];
        this.setState({...defaultForm, reviews, info, saving: false},()=>{
        });
        this.props.updateAssignment(getIRIFromAddResponse(response));
        this.toggle();
      }
    );
  }

  render(){
    return(
      <div className="ml-auto">
        <Button color="primary" onClick={this.toggle.bind(this)}>Add assignment</Button>
        <Modal isOpen={this.state.opened} className={this.props.className} style={{width:'auto',maxWidth:1000}}>
          <ModalHeader toggle={this.toggle.bind(this)}>
            Adding new assignment
          </ModalHeader>
          <ModalBody>
            <Nav tabs className="b-0">
              <NavItem>
                <NavLink
                  className={classnames({ active: this.state.activeTab === '1',hasError:!infoOK(this.state.info)}, "clickable")}
                  onClick={() => { this.setState({activeTab:'1'}) }}
                >
                  Info
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink
                  className={classnames({ active: this.state.activeTab === '2',hasError:!submissionOK(this.state.submission)}, "clickable")}
                  onClick={() => { this.setState({activeTab:'2'}) }}
                  >
                  Submission
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink
                  className={classnames({ active: this.state.activeTab === '3',hasError:!fieldsOK(this.state.fields)}, "clickable")}
                  onClick={() => { this.setState({activeTab:'3'}) }}
                >
                  Fields
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink
                  className={classnames({ active: this.state.activeTab === '4',hasError:!teamsOK(this.state.teams)}, "clickable")}
                  onClick={() => { this.setState({activeTab:'4'}) }}
                >
                  Teams
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink
                  className={classnames({ active: this.state.activeTab === '5',hasError:!reviewsOK(this.state.reviews,getRealDeadline( this.state.submission ))}, "clickable")}
                  onClick={() => { this.setState({activeTab:'5'}) }}
                >
                  Reviews
                </NavLink>
              </NavItem>
              {
                !this.state.teams.disabled && <NavItem>
                <NavLink
                  className={classnames({ active: this.state.activeTab === '6',hasError:!teamReviewsOK(this.state.teams,this.state.teamReviews, getRealDeadline( this.state.submission ))}, "clickable")}
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
                  initialDeadline={ getRealDeadline(this.state.submission) }
                  setSubmissionAnonymous={(anonymousSubmission)=>{
                    if(anonymousSubmission && this.state.reviews.visibility==='open'){
                      this.setState({submission:{...this.state.submission,anonymousSubmission},reviews:{...this.state.reviews,visibility:'blind'}});
                    }else{
                      this.setState({submission:{...this.state.submission,anonymousSubmission}});
                    }
                  }}
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
                  initialDeadline={ getRealDeadline(this.state.submission) }
                  setData={(reviews)=>{this.setState({reviews})}}
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
            Creating assignment, please wait!
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
              <Button color="success" disabled={!this.canSave() || this.state.saving} onClick={this.submitAssignment.bind(this)}>{this.state.saving? 'Adding assignment' : 'Add assignment'}</Button>
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
