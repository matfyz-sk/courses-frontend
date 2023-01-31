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
import { useGetPeerReviewQuestionsQuery } from 'services/assignments';
import { useGetMaterialsQuery } from 'services/documents';

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

function ModalAddAssignment(props) { 
  const [activeTab, setActiveTab] = useState('1')
  const [opened, setOpened] = useState(false)
  const [showErrors, setShowErrors] = useState(true)
  const [allQuestions, setAllQuestions] = useState([])
  const [allMaterials, setAllMaterials] = useState([])
  const [formLoaded, setFormLoaded] = useState(false)
  const [saving, setSaving] = useState(false)
  const [newID, setNewID] = useState(0)
  //FORM
  const [info, setInfo] = useState(defaultForm.info)
  const [fields, setFields] = useState(defaultForm.fields)
  const [submission, setSubmission] = useState(defaultForm.submission)
  const [teams, setTeams] = useState(defaultForm.teams)
  const [reviews, setReviews] = useState(defaultForm.reviews)
  const [teamReviews, setTeamReviews] = useState(defaultForm.teamReviews)

  const getNewID = () => {
    const id = newID
    setNewID(newID++)
    return id
  }

  const deleteMaterial = (material) => {
    let newInfo = { ...info }
    newInfo.hasMaterial = info.hasMaterial.filter((material2) => material2['@id'] !== material['@id'])
    setInfo(newInfo)
  }

  const addMaterial = (materialData) => {
    let material = {...materialData}
    if (materialData.new === undefined) {
      material.new = true;
      material['@id'] = '#n-' + getNewID();
    }
    info.hasMaterial.push(material);
    if (materialData.new === undefined) {
      setInfo({...info, allMaterials: [...allMaterials, material]})
    } else {
      setInfo(info)
    }
  }

  const deleteQuestion = (question) => {
    let newReviews = { ...reviews };
    newReviews.questions = reviews.questions.filter((question2) => question2['@id'] !== question['@id'] )
    setReviews(newReviews)
  }

  const addQuestion = (questionData) => {
    let question = {...questionData }
    if (questionData.new === undefined) {
      question.new = true;
      question['@id'] = '#n-' + getNewID();
    }
    reviews.questions.push(question);
    if (questionData.new === undefined) {
      setReviews({...reviews, allQuestions: [...allQuestions, question]})
    } else {
      setReviews(reviews)
    }
  }

  const toggle = () => {
    let isOpen = opened;
    setOpened(!opened)
    setFormLoaded(false)
    if(!isOpen){
      const {
        data: questionsData,
        isSuccess: questionsIsSuccess
      } = useGetPeerReviewQuestionsQuery()
      if (questionsIsSuccess && questionsData) {
        setAllQuestions(questionsData.map((question)=>({...question, new:false })))
      }
  
      const {
        data: materialsData,
        isSuccess: materialsIsSuccess
      } = useGetPeerReviewQuestionsQuery()
      if (materialsIsSuccess && materialsData) {
        setAllQuestions(materialsData.map((question)=>({...question, new:false })))
      }
      setFormLoaded(true)
    }
  }

  const setDefaults = () => {
    if(window.confirm('Are you sure you want to reset all assignment settings?')){
      let reviews = { ...defaultForm.reviews };
      reviews.questions = [];
      let info = { ...defaultForm.info };
      info.hasMaterial = [];
      setInfo(info)
      setReviews(reviews)
    }
  }

  const canSave = () => {
    return infoOK(info) &&
      fieldsOK(fields) &&
      submissionOK(submission) &&
      teamsOK(teams) &&
      reviewsOK(reviews, getRealDeadline(submission)) &&
      teamReviewsOK(teams, teamReviews, getRealDeadline(submission))
  }

  const submitAssignment = () => {
    setSaving(true)
    addAssignment(
      {
        info,
        fields,
        submission,
        teams,
        reviews,
        teamReviews,
      },
      props.courseInstance['@id'],
      (response)=>{
        let reviews = { ...defaultForm.reviews };
        reviews.questions = [];
        let info = { ...defaultForm.info };
        info.hasMaterial = [];
        setReviews(reviews)
        setInfo(info)
        setSaving(false)
        props.updateAssignment(getIRIFromAddResponse(response));
        toggle();
      }
    );
  }

  return(
    <div className="ml-auto">
      <Button color="primary" onClick={toggle}>Add assignment</Button>
      <Modal isOpen={opened} className={props.className} style={{width:'auto',maxWidth:1000}}>
        <ModalHeader toggle={toggle}>
          Adding new assignment
        </ModalHeader>
        <ModalBody>
          <Nav tabs className="b-0">
            <NavItem>
              <NavLink
                className={classnames({ active: activeTab === '1',hasError:!infoOK(info)}, "clickable")}
                onClick={() => { setActiveTab('1') }}
              >
                Info
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink
                className={classnames({ active: activeTab === '2',hasError:!submissionOK(submission)}, "clickable")}
                onClick={() => { setActiveTab('2') }}
                >
                Submission
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink
                className={classnames({ active: activeTab === '3',hasError:!fieldsOK(fields)}, "clickable")}
                onClick={() => { setActiveTab('3') }}
              >
                Fields
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink
                className={classnames({ active: activeTab === '4',hasError:!teamsOK(teams)}, "clickable")}
                onClick={() => { setActiveTab('4') }}
              >
                Teams
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink
                className={classnames({ active: activeTab === '5',hasError:!reviewsOK(reviews,getRealDeadline( submission ))}, "clickable")}
                onClick={() => { setActiveTab('5') }}
              >
                Reviews
              </NavLink>
            </NavItem>
            {
              !teams.disabled && <NavItem>
              <NavLink
                className={classnames({ active: activeTab === '6',hasError:!teamReviewsOK(teams, teamReviews, getRealDeadline( submission ))}, "clickable")}
                onClick={() => { setActiveTab('6') }}
              >
                Team Reviews
              </NavLink>
            </NavItem>
          }
          </Nav>
          { formLoaded &&
            <TabContent activeTab={activeTab}>
            <TabPane tabId="1">
              <Info
                data={info}
                allMaterials={allMaterials}
                addMaterial={ addMaterial }
                deleteMaterial={ deleteMaterial }
                showErrors={showErrors}
                setData={(info)=> setInfo(info)}
                />
            </TabPane>
            <TabPane tabId="2">
              <Submission
                data={submission}
                showErrors={showErrors}
                setData={(submission)=> setSubmission(submission)}
                initialDeadline={ getRealDeadline(submission) }
                setSubmissionAnonymous={(anonymousSubmission)=>{
                  if(anonymousSubmission && reviews.visibility==='open'){
                    setSubmission({...submission, anonymousSubmission})
                    setReviews({...reviews,visibility:'blind'})
                  }else{
                    setSubmission({...submission, anonymousSubmission})
                  }
                }}
                />
            </TabPane>
            <TabPane tabId="3">
              <Fields data={fields} showErrors={showErrors} setData={(fields)=> setFields(fields)} />
            </TabPane>
            <TabPane tabId="4">
              <Teams
                data={teams}
                showErrors={showErrors}
                setData={(teams)=> setTeams(teams)}
                setTeamsDisabled={(disabled)=> {
                  setTeams({ ...teams, disabled })
                  setReviews({ ...reviews, reviewedByTeam: !disabled })
                }}
                />
            </TabPane>
            <TabPane tabId="5">
              <Reviews
                data={reviews}
                allQuestions={allQuestions}
                addQuestion={ addQuestion }
                deleteQuestion={ deleteQuestion }
                showErrors={showErrors}
                openDisabled={submission.anonymousSubmission}
                teamsDisabled={teams.disabled}
                initialDeadline={ getRealDeadline(submission) }
                setData={(reviews)=> setReviews(reviews)}
                />
            </TabPane>
            <TabPane tabId="6">
              <TeamReviews
                data={teamReviews}
                showErrors={showErrors}
                setData={(teamReviews)=> setTeamReviews(teamReviews)}
                initialDeadline={ getRealDeadline(submission) }
                />
            </TabPane>
          </TabContent>
        }
        <Alert color="primary" isOpen={!formLoaded}>
          Data is loading!
        </Alert>
        <Alert color="primary" isOpen={saving}>
          Creating assignment, please wait!
        </Alert>
        </ModalBody>
        <ModalFooter>
          <span className="mr-auto">
            <Button outline color="secondary" onClick={toggle}>Cancel</Button>
          </span>
          <span>
            <Button color="danger" onClick={setDefaults}>Reset</Button>{' '}
            <Button color="primary" disabled={activeTab==="1"} onClick={()=> setActiveTab((parseInt(activeTab)-1)+"")}>Prev</Button>{' '}
            <Button color="primary" disabled={activeTab==="6"} onClick={()=> setActiveTab((parseInt(activeTab)+1)+"")}>Next</Button>{' '}
            <Button color="success" disabled={!canSave() || saving} onClick={submitAssignment}>{saving? 'Adding assignment' : 'Add assignment'}</Button>
          </span>
        </ModalFooter>
      </Modal>
    </div>
  )
}



const mapStateToProps = ({courseInstanceReducer}) => {
	const { courseInstance } = courseInstanceReducer;
	return {
    courseInstance
	};
};

export default connect(mapStateToProps, {  })(ModalAddAssignment);
