import React, { Component } from 'react';
import { Label, Alert } from 'reactstrap';
import { connect } from "react-redux";
import Questionare from './questionare';
import Answers from './answers';

import { axiosGetEntities, axiosAddEntity, axiosUpdateEntity, getShortID, getResponseBody, periodHappening, periodHasEnded, periodStarted, getIRIFromAddResponse } from 'helperFunctions';

const randomSentence = () => 'AAAA'

class PeerReview extends Component {
  constructor(props){
    super(props);
    this.state = {
      questions: [],
      questionsLoaded: false,

      answers: [],
      answersLoaded: [],

      myReview: null,
      myReviewLoaded: false,

      questionare: [],
      questionareLoaded: false,

      saving: false,
    }
    this.submissionID = null;
    if( this.props.initialSubmission !== null ){
      this.submissionID = this.props.initialSubmission['@id'];
    }
    this.fetchQuestions.bind(this);
    this.fetchAnswers.bind(this);
    this.processReviews.bind(this);
    this.getQuestionAnswers.bind(this);
    this.loadForm.bind(this);

  }

  fetchQuestions(){
    let axiosPeerReviewQuestions = this.props.assignment.reviewsQuestion.map( (question) => axiosGetEntities(`peerReviewQuestion/${getShortID(question['@id'])}`) );
    Promise.all( axiosPeerReviewQuestions ).then( (responses) => {
      let questions = responses.map( (response) => getResponseBody(response)[0] )
      let afterUpdate = () => {};
      if(!this.props.settings.isInstructor && !this.props.settings.myAssignment){
        afterUpdate = this.loadForm.bind(this);
      }
      this.setState({ questions, questionsLoaded: true },afterUpdate)
    })
  }

  fetchMyReview(){
    if(
      this.submissionID === null ||
      this.props.toReview === null ||
      (this.props.assignment.reviewedByTeam && !this.props.teams.some( (team) => team['@id'] === this.props.toReview.team[0]['@id'] ))
    ){
      return;
    }
    let peerReviewCondition = ""
    if(this.props.assignment.reviewedByTeam){
      peerReviewCondition = `reviewedByTeam=${getShortID(this.props.toReview.team[0]['@id'])}`;
    }else{
      peerReviewCondition = `reviewedByStudent=${getShortID(this.props.toReview.student[0]['@id'])}`;
    }
    axiosGetEntities(`peerReview?ofSubmission=${getShortID(this.submissionID)}&${peerReviewCondition}&_join=hasQuestionAnswer`).then((response)=>{
      let review = getResponseBody(response);
      this.setState({ myReview: ( review.length === 0 ? null : review[0] ), myReviewLoaded: true }, this.loadForm.bind(this));
    })
  }

  loadForm(){
    if(!this.state.questionsLoaded || !this.state.myReviewLoaded){
      return;
    }
    let questionare = this.state.questions.map((question)=>({ //load default values
      question,
      id: question['@id'],
      rated: question.rated,
      exists: false,
      score: 0,
      answer: '',
    }))

    if( this.state.myReview !== null ){
      this.state.myReview.hasQuestionAnswer.map((answer) => {
        let index = questionare.findIndex( (question) => answer.question[0]['@id'] === question.id );
        if( index !== -1 ){
          questionare[index] = {
            ...questionare[index],
            exists: true,
            score: answer.score,
            answer: answer.answer,
            answerID: answer['@id'],
          }
        }
      })
    }
    this.setState({ questionare, questionareLoaded: true })
  }

  fetchAnswers(){
    if( this.submissionID === null ){
      return;
    }
    axiosGetEntities(`peerReview?ofSubmission=${getShortID(this.submissionID)}&_join=hasQuestionAnswer`).then((response)=>{
      let reviews = getResponseBody(response);
      if (this.props.assignment.reviewsVisibility === "open" || this.props.settings.isInstructor){
        if( this.props.assignment.reviewedByTeam ){
          //get team
          let axiosTeams = reviews.map( (review) => axiosGetEntities(`team/${getShortID(review.reviewedByTeam[0]['@id'])}` ))
          Promise.all(axiosTeams).then( (responses) => {
            let teams = responses.map((response) => getResponseBody(response)[0]);
            reviews = this.assignTeamToReview( reviews, teams );
            this.processReviews(reviews);
          })
        }else{
          //get user
          let axiosStudents = reviews.map( (review) => axiosGetEntities(`user/${getShortID(review.reviewedByStudent[0]['@id'])}` ))
          Promise.all(axiosStudents).then( (responses) => {
            let students = responses.map((response) => getResponseBody(response)[0]);
            reviews = this.assignStudentToReview( reviews, students );
            this.processReviews(reviews);
          })
        }
      }else{
        this.processReviews(reviews);
      }
    })
  }

  assignTeamToReview(reviews, teams){
    return reviews.map( (review) => ({
      ...review,
      team: teams.find( (team) => team['@id'] === review.reviewedByTeam[0]['@id'] ),
    }) )
  }

  assignStudentToReview(reviews, students){
    return reviews.map( (review) => ({
      ...review,
      student: students.find( (student) => student['@id'] === review.reviewedByStudent[0]['@id'] ),
    }) )
  }

  processReviews(reviews){
    const answers = reviews.map( (review) => {
      return review.hasQuestionAnswer.map( (answer) => ({
        ...answer,
        review
      }))
    }).reduce(
      (acc,value)=>{
        return acc.concat(value)
      },[]
    )
    this.setState( { answers, answersLoaded: true });
  }

  getQuestionAnswers(){
    if( this.submissionID === null ){
      return [];
    }
    return this.state.questions.map( (question) => ({
      ...question,
      answers: this.state.answers.filter( (answer) => answer.question[0]['@id'] === question['@id'] )
        .sort((answer1,answer2) => answer1.createdAt > answer2.createdAt ? -1 : 1 )
    }) )
  }

  componentWillMount(){
    if( periodHappening(this.props.assignment.peerReviewPeriod) && this.props.settings.peerReview ){ //student hodnoti niekoho
      this.fetchQuestions();
      this.fetchMyReview();
    }else if((this.props.settings.myAssignment || this.props.settings.isInstructor) && periodHasEnded(this.props.assignment.peerReviewPeriod)){ //instruktor alebo niekto pozera vysledky
      this.fetchQuestions();
      this.fetchAnswers();
    }
  }

  submit(){
    if( this.submissionID === null ){
      return;
    }
    this.setState({ saving: true })
    let existingReviews = this.state.questionare.filter( (review) => review.exists );
    let newReviews = this.state.questionare.filter( (review) => !review.exists );
    let axiosUpdateReviews = existingReviews.map( (review) => axiosUpdateEntity( {
        score: review.score,
        answer: review.answer
      } , `peerReviewQuestionAnswer/${getShortID(review.answerID)}` ) )
    let axiosNewReviews = newReviews.map( (review) => axiosAddEntity( {
        score: review.score,
        answer: review.answer,
        question: review.question['@id'],
      } , 'peerReviewQuestionAnswer' ) );
    Promise.all([
      Promise.all(axiosUpdateReviews),
      Promise.all(axiosNewReviews)
    ]).then(([updateResponses, newResponses])=>{
      let newIDs = newResponses.map((response)=> getIRIFromAddResponse(response));
      if( this.state.myReview !== null ){
        axiosUpdateEntity({
          hasQuestionAnswer:[...existingReviews.map((review)=>review['@id']),...newIDs ],
        },`peerReview/${this.state.myReview['@id']}`).then( (response) => {
          this.setState({ saving: false })
          this.fetchMyReview();
        })
      }else{
        let newPeerReview = {
          hasQuestionAnswer:newIDs,
          ofSubmission: this.submissionID,

        }
        if(this.props.assignment.reviewedByTeam){
          newPeerReview.reviewedByTeam = this.props.match.params.teamID;
        }else{
          newPeerReview.reviewedByStudent = getShortID(this.props.user.fullURI);
        }
        axiosAddEntity(newPeerReview,'peerReview').then( (response) => {
          this.setState({ saving: false })
          this.fetchMyReview();
        })
      }
    })
  }

  /*
  /courses/DZFAI/assignments/assignment/938uy/review/team/dvyaa/oHHUJ/reviews
  ziskaj otazky
  ziskaj odpovede s otazkami
  ziskaj MOJE odpovede - ak sa deje review potrebne

  zobraz formular
  zobraz odpovede

  open - napis info o teame alebo osobe, ALEBO INSTRUKTOR inak nepis nic
  */

  render(){
    if( !periodStarted(this.props.assignment.teamReviewPeriod) ){
      return (
        <Alert color="danger" className="mt-3">
          Peer review hasn't started yet!
        </Alert>
      )
    }
    if( !periodHasEnded(this.props.assignment.peerReviewPeriod) && this.props.settings.isInstructor ){
      return (
        <Alert color="danger" className="mt-3">
          Peer review hasn't ended yet!
        </Alert>
      )
    }
    if( this.submissionID === null && this.props.settings.peerReview ){
      return (
        <Alert color="danger" className="mt-3">
          You can't review this submission, there's none
        </Alert>
      )
    }

    if( this.submissionID === null && !this.props.settings.isInstructor && this.props.settings.myAssignment ){
      return (
        <Alert color="danger" className="mt-3">
          You can't get review if you haven't submitted anything!
        </Alert>
      )
    }
    if( this.submissionID === null && this.props.settings.isInstructor ){
      return (
        <Alert color="danger" className="mt-3">
          There is no submission, so there are no reviews to view!
        </Alert>
      )
    }
    const loading = (this.props.settings.peerReview && periodHappening(this.props.assignment.peerReviewPeriod) && !this.state.questionareLoaded) ||
    (
      (this.props.settings.myAssignment || this.props.settings.isInstructor) &&
      periodHasEnded(this.props.assignment.peerReviewPeriod) &&
      (!this.state.questionsLoaded || !this.state.answersLoaded)
    );
    if( loading ){
      return (
        <Alert color="primary" className="mt-3">
          Loading peer reviews...
        </Alert>
      )
    }

    return (
      <div>
        { periodHappening(this.props.assignment.peerReviewPeriod) && this.props.settings.peerReview &&
          <Questionare
            questionare={ this.state.questionare }
            onChange={ (questionare) => this.setState({questionare}) }
            saving={this.state.saving}
            submit={this.submit.bind(this)}
            />
        }
        { (this.props.settings.myAssignment || this.props.settings.isInstructor) &&
          periodHasEnded(this.props.assignment.peerReviewPeriod) &&
          <Answers
            questionsWithAnswers = { this.getQuestionAnswers() }
            nameVisible={ this.props.assignment.reviewsVisibility === "open" || this.props.settings.isInstructor }
            />
        }
      </div>
    )
}
}
const mapStateToProps = ({ authReducer, assignStudentDataReducer }) => {
  const { user } = authReducer;
  const { teams } = assignStudentDataReducer;
  return {
    user,
    teams,
  };
};

export default connect(mapStateToProps, {  })(PeerReview);
