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
import { useGetFieldQuery, useGetPeerReviewQuestionsQuery } from 'services/assignments';
import { useGetMaterialsQuery } from 'services/documents';

function ModalAddAssignment(props) {
  const assignment = props.assignment;
  const [activeTab, setActiveTab] = useState('1')
  const [opened, setOpened] = useState(false)
  const [showErrors, setShowErrors] = useState(true)
  const [allQuestions, setAllQuestions] = useState([])
  const [allMaterials, setAllMaterials] = useState([])
  const [formLoaded, setFormLoaded] = useState(false)
  const [saving, setSaving] = useState(false)
  const [newID, setNewID] = useState(0)
  //FORM
  const [info, setInfo] = useState({
    name: null,
    description: null,
    shortDescription: null,
    hasMaterial: null
  })
  const [defaultInfo, setDefaultInfo] = useState(info)

  const [fields, setFields] = useState({
    fields: null
  })
  const [defaultFields, setDefaultFields] = useState(fields)

  const [submission, setSubmission] = useState({
    anonymousSubmission: null,
    openTime: null,
    deadline: null,
    extraTime: null,
    improvedSubmission: null,
    improvedOpenTime: null,
    improvedDeadline: null,
    improvedExtraTime: null
  })
  const [defaultSubmission, setDefaultSubmission] = useState(submission)

  const [teams, setTeams] = useState({
    disabled: null,
    submittedAsTeam: null,
    minimumInTeam: null,
    maximumInTeam: null,
    multipleSubmissions: null
  })
  const [defaultTeams, setDefaultTeams] = useState(teams)

  const [reviews, setReviews] = useState({
    disabled: null,
    openTime: null,
    deadline: null,
    extraTime: null,
    reviewsPerSubmission: null,
    reviewedByTeam: null,
    visibility: null,
    questions:  null
  })
  const [defaultReviews, setDefaultReviews] = useState(reviews)

  const [teamReviews, setTeamReviews] = useState({
    disabled: null,
    openTime: null,
    deadline: null,
    extraTime: null
  })
  const [defaultTeamReviews, setDefaultTeamReviews] = useState(teamReviews)

  useEffect(() => {
    const fields = []
    assignment.hasField.forEach((field) => {
      const {data, isSuccess} = useGetFieldQuery(getShortID(field['@id']))
      if (isSuccess && data) {
        fields.push(data[0])
      }
    })
    prepareForm(fields)
  }, [allQuestions, allMaterials])

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

  const loadForm = () => {
    const {
      data: allQuestionsData,
      isSuccess: allQuestionsIsSuccess,
    } = useGetPeerReviewQuestionsQuery()
    if (allQuestionsIsSuccess && allQuestionsData) {
      const allQuestions = allQuestionsData.map((question)=>({ ...question, new: false }));
      setAllQuestions(allQuestions)
    }

    const {
      data: allMaterialsData,
      isSuccess: allMaterialsIsSuccess,
    } = useGetMaterialsQuery()
    if (allMaterialsIsSuccess && allMaterialsData) {
      const allMaterials = allMaterialsData.filter((material) => material.URL !== undefined).map((material)=>({...material, new:false }));
      setAllMaterials(allMaterials)
    }
  }

  const prepareForm = (fields) => {
    const materialIDs = assignment.hasMaterial.map((material) => material['@id'] );
    const info = {
      name: assignment.name,
      description: assignment.description,
      shortDescription: assignment.shortDescription,
      hasMaterial: allMaterials.filter( (material) => materialIDs.includes(material['@id']) ),
    }
    const newFields = {
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
    } //DOLE
    const submission = {
      anonymousSubmission: assignment.submissionAnonymousSubmission,
      openTime: timestampToInput(assignment.initialSubmissionPeriod.openTime),
      deadline: timestampToInput(assignment.initialSubmissionPeriod.deadline),
      extraTime: assignment.initialSubmissionPeriod.extraTime,
      improvedSubmission: assignment.submissionImprovedSubmission,
      improvedOpenTime: (assignment.submissionImprovedSubmission && timestampToInput(assignment.improvedSubmissionPeriod.openTime)) || '',
      improvedDeadline: (assignment.submissionImprovedSubmission && timestampToInput(assignment.improvedSubmissionPeriod.deadline)) || '',
      improvedExtraTime: (assignment.submissionImprovedSubmission && assignment.improvedSubmissionPeriod.extraTime) || ''
    }
    const teams = {
      disabled: assignment.teamsDisabled,
      submittedAsTeam: (!assignment.teamsDisabled && assignment.teamsSubmittedAsTeam) || true,
      minimumInTeam: (!assignment.teamsDisabled && assignment.teamsMinimumInTeam) || 2,
      maximumInTeam: (!assignment.teamsDisabled && assignment.teamsMaximumInTeam) || 2,
      multipleSubmissions: (!assignment.teamsDisabled && (assignment.teamsMultipleSubmissions === "true" || assignment.teamsMultipleSubmissions === true) ),
    }
    const reviews = {
      disabled: assignment.reviewsDisabled,
      openTime: (!assignment.reviewsDisabled && timestampToInput(assignment.peerReviewPeriod.openTime) ) || '',
      deadline: (!assignment.reviewsDisabled && timestampToInput(assignment.peerReviewPeriod.deadline) ) || '',
      extraTime: (!assignment.reviewsDisabled && assignment.peerReviewPeriod.extraTime ) || 15,
      reviewsPerSubmission: (!assignment.reviewsDisabled && assignment.reviewsPerSubmission ) || 3,
      reviewedByTeam: (!assignment.reviewsDisabled && assignment.reviewedByTeam ) || !assignment.teamsDisabled,
      visibility: (!assignment.reviewsDisabled && assignment.reviewsVisibility ) || 'blind',
      questions:  (!assignment.reviewsDisabled && allQuestions.filter((question) => assignment.reviewsQuestion.some((reviewQuestion) => question['@id'] === reviewQuestion['@id'] ) ) ) || []
    }
    const teamReviews = {
      disabled: assignment.teamReviewsDisabled,
      openTime: (!assignment.teamReviewsDisabled && timestampToInput(assignment.teamReviewPeriod.openTime) ) || '',
      deadline: (!assignment.teamReviewsDisabled && timestampToInput(assignment.teamReviewPeriod.deadline) ) || '',
      extraTime: (!assignment.teamReviewsDisabled && assignment.teamReviewPeriod.extraTime ) || 15,
    }
    setInfo(info)
    setDefaultInfo(info)
    setFields(newFields)
    setDefaultFields(newFields)
    setSubmission(submission)
    setDefaultSubmission(submission)
    setTeams(teams)
    setDefaultTeams(teams)
    setReviews(reviews)
    setDefaultReviews(reviews)
    setTeamReviews(teamReviews)
    setDefaultTeamReviews(teamReviews)
    setFormLoaded(true)
  }

  const toggle = () => {
    let isOpen = opened;
    setOpened(!opened)
    setFormLoaded(false)
    if(!isOpen){
      loadForm();
    }
  }

  const setDefaults = () => {
    if (window.confirm('Are you sure you want to reset all assignment settings?')) {
      let reviews = { ...defaultReviews };
      reviews.questions = [...defaultReviews.questions];
      setReviews(reviews)
      let info = { ...defaultInfo };
      info.hasMaterial = [...defaultInfo.hasMaterial];
      setInfo(info)
    }
  }

  const canSave = () => {
    return formLoaded && infoOK(info) &&
      fieldsOK(fields) &&
      submissionOK(submission) &&
      teamsOK(teams) &&
      reviewsOK(reviews, getRealDeadline(submission)) &&
      teamReviewsOK(teams, teamReviews, getRealDeadline(submission ))
  }

  const submitAssignment = () => {
    setSaving(true)
    editAssignment(
      {
        info,
        fields,
        submission,
        teams,
        reviews,
        teamReviews,
      },
      props.assignment,
      (response)=>{
        props.updateAssignment(props.assignment['@id']);
        toggle();
        setSaving(false)
      }
    );
  }

  return(
    <div className="ml-auto center-hor">
      <Button outline color="primary" className="p-1" style={{width:34}} onClick={toggle}><i className="fa fa-pen" /></Button>
      <Modal isOpen={opened} className={props.className} style={{width:'auto',maxWidth:1000}}>
        <ModalHeader toggle={toggle}>
          Editting assignment: {assignment.name}
        </ModalHeader>
        <ModalBody>
          <Nav tabs className="b-0">
            <NavItem>
              <NavLink
                className={classnames({ active: activeTab === '1',hasError: !formLoaded || !infoOK(info)}, "clickable")}
                onClick={() => { setActiveTab('1') }}
              >
                Info
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink
                className={classnames({ active: activeTab === '2',hasError: !formLoaded || !submissionOK(submission)}, "clickable")}
                onClick={() => { setActiveTab('2') }}
                >
                Submission
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink
                className={classnames({ active: activeTab === '3',hasError: !formLoaded || !fieldsOK(fields)}, "clickable")}
                onClick={() => { setActiveTab('3') }}
              >
                Fields
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink
                className={classnames({ active: activeTab === '4',hasError: !formLoaded || !teamsOK(teams)}, "clickable")}
                onClick={() => { setActiveTab('4') }}
              >
                Teams
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink
                className={classnames({ active: activeTab === '5',hasError: !formLoaded || !reviewsOK(reviews, getRealDeadline(submission))}, "clickable")}
                onClick={() => { setActiveTab('5') }}
              >
                Reviews
              </NavLink>
            </NavItem>
            {
              formLoaded && !teams.disabled && <NavItem>
              <NavLink
                className={classnames({ active: activeTab === '6',hasError: !formLoaded || !teamReviewsOK(teams, teamReviews, getRealDeadline(submission ))}, "clickable")}
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
                setSubmissionAnonymous={(anonymousSubmission)=>{
                  if (anonymousSubmission && reviews.visibility === 'open') {
                    setSubmission({...submission, anonymousSubmission})
                    setReviews({...reviews, visibility: 'blind'})
                  } else {
                    setSubmission({...submission, anonymousSubmission})
                  }
                }}
                initialDeadline={ getRealDeadline(submission) }
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
                setTeamsDisabled={(disabled)=>{
                  setTeams({...teams, disabled})
                  setReviews({...reviews, reviewedByTeam: !disabled})
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
                setData={(reviews)=> setReviews(reviews)}
                initialDeadline={ getRealDeadline(submission) }
                />
            </TabPane>
            <TabPane tabId="6">
              <TeamReviews
                data={teamReviews}
                showErrors={showErrors}
                setData={(teamReviews)=>{ setTeamReviews(teamReviews)}}
                initialDeadline={ getRealDeadline(submission) }
                />
            </TabPane>
          </TabContent>
        }
        <Alert color="primary" isOpen={!formLoaded}>
          Data is loading!
        </Alert>
        <Alert color="primary" isOpen={saving}>
          Saving assignment, please wait!
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
            <Button color="success" disabled={!canSave() || saving} onClick={submitAssignment}>{saving? 'Saving assignment' : 'Save assignment'}</Button>
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
