import React, { Component } from 'react';
import { Label, Alert, Button, FormGroup, Input } from 'reactstrap';
import { connect } from "react-redux";
import Questionare from './questionare';
import Answers from './answers';

import {
  axiosGetEntities,
  axiosAddEntity,
  axiosUpdateEntity,
  getShortID,
  getResponseBody,
  periodHappening,
  periodHasEnded,
  periodStarted,
  getIRIFromAddResponse,
  timestampToString,
  htmlFixNewLines,
  prepareMultiline,
  getStudentName,
  getRandomRolor,
  datesComparator
} from 'helperFunctions';

class PeerReview extends Component {
  constructor(props){
    super(props);
    this.commentCreatorsVisible = this.props.assignment.reviewsVisibility === 'open' || this.props.settings.isInstructor;
    this.state = {
      questions: [],
      questionsLoaded: false,

      answers: [],
      answersLoaded: [],

      myReview: null,
      myReviewLoaded: false,

      questionare: [],
      questionareLoaded: false,

      commentsLoaded: false,
      generalComments: [],
      messageColors: [],
      newGeneralComment: '',
      newGeneralCommentParent: null,
      generalCommentSaving: false,

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

  fetchComments(){
    const initialSubmission = this.props.initialSubmission;
    if( initialSubmission === null ){
      return;
    }
    let getUser = this.commentCreatorsVisible ? "&_join=createdBy" : ""
    axiosGetEntities(`comment?ofSubmission=${getShortID(initialSubmission['@id'])}${getUser}`).then((response)=>{
      let allComments = getResponseBody(response).filter( ( comment ) => !comment['@type'].endsWith('CodeComment') );
      let messageColors = [ ...this.state.messageColors ];
      allComments = allComments.sort( ( comment1, comment2 ) => datesComparator( comment1.createdAt, comment2.createdAt ) )
        .map((comment) => {
        if( !messageColors.some((color) => color.id === comment.createdBy['@id']) ){
          messageColors.push({ id: comment.createdBy['@id'] , hex: getRandomRolor(), name: `Anonymous ${messageColors.length + 1}` })
        }
        return {
          ...comment,
          color: messageColors.find((color) => color.id === comment.createdBy['@id']),
        }
      })
      let childComments = allComments.filter((comment) => comment.ofComment.length !== 0);
      const parentComments = allComments.filter((comment) => comment.ofComment.length === 0)
        .map((comment) => ({
          ...comment,
          childComments: childComments.filter((subcomment) => subcomment.ofComment[0]['@id'] === comment['@id'] ).reverse()
        }));
      this.setState({ generalComments: parentComments, commentsLoaded:true, messageColors })
    })
  }

  getCommentBy(comment){
    if(this.commentCreatorsVisible){
      return getStudentName(comment.createdBy)
    }
    return comment.color.name
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
      this.state.myReview.hasQuestionAnswer.forEach((answer) => {
        let index = questionare.findIndex( (question) => answer.question === question.id );
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

  addGeneralComment(){
    if(this.props.initialSubmission === null){
      return;
    }
    this.setState({ generalCommentSaving: true })
    const newComment = {
      commentText: prepareMultiline(this.state.newGeneralComment),
      ofSubmission: this.props.initialSubmission['@id'],
      _type: 'comment',
    }
    if( this.state.newGeneralCommentParent !== null){
      newComment.ofComment = this.state.newGeneralCommentParent['@id']
    }
    axiosAddEntity( newComment, 'comment' ).then((response) => {
      this.setState({ generalCommentSaving: false, newGeneralComment: '', newGeneralCommentParent: null })
      this.fetchComments();
    }).catch((error) => {
      this.setState({ generalCommentSaving: false })
      console.log(error);
    })
  }


  componentWillMount(){
    this.fetchComments();
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
        if(newIDs.length === 0){
          this.setState({ saving: false })
        }
        axiosUpdateEntity({
          hasQuestionAnswer:[...existingReviews.map((review)=>review.answerID),...newIDs ],
        },`peerReview/${getShortID(this.state.myReview['@id'])}`).then( (response) => {
          this.setState({ saving: false })
          this.fetchMyReview();
        })
      }else{
        let newPeerReview = {
          hasQuestionAnswer:newIDs,
          ofSubmission: this.submissionID,
        }
        if(this.props.assignment.reviewedByTeam){
          newPeerReview.reviewedByTeam = this.props.toReview.team[0]['@id'];
        } else {
          newPeerReview.reviewedByStudent = this.props.toReview.student[0]['@id'];
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
        <h3><Label className="bold">General comments</Label></h3>
        {this.state.generalComments.length===0 && <div style={{ fontStyle: 'italic' }}>
        There are currently no comments!
      </div>}
      {this.state.generalComments.map((genComment)=>
        <div key={genComment['@id']}>
          <Label className="flex row">Commented by
            <span style={{fontWeight:'bolder', color: genComment.color.hex, marginLeft: '0.5rem' }}>{`${this.getCommentBy(genComment)}`}</span>
            <div className="text-muted ml-auto">
              {timestampToString(genComment.createdAt)}
            </div>
          </Label>
          <div className="text-muted">
            <div dangerouslySetInnerHTML = {{__html: htmlFixNewLines(genComment.commentText) }} />
          </div>
          <div style={{padding:'5px 10px'}}>
            {genComment.childComments.map((childComment)=>
              <div key={childComment['@id']}>
                <hr style={{margin: 0}} />
                  <Label className="flex row">Commented by
                    <span style={{fontWeight:'bolder', color: childComment.color.hex, marginLeft: '0.5rem' }}>{`${this.getCommentBy(childComment)}`}</span>
                    <div className="text-muted ml-auto">
                      {timestampToString(childComment.createdAt)}
                    </div>
                  </Label>
                <div className="text-muted">
                  <div dangerouslySetInnerHTML = {{__html: htmlFixNewLines(childComment.commentText) }} />
                </div>
              </div>
            )}
          </div>
          <Button
            color="link"
            onClick={()=>this.setState({newGeneralCommentParent:genComment})}
            >
            <i className="fa fa-reply" /> Reply
            </Button>
            <hr/>
          </div>
        )}
        <FormGroup>
          <Label htmlFor="addCodeComment" style={{fontWeight:'bold'}}>New comment</Label>
          <Input id="addCodeComment" type="textarea" value={this.state.newGeneralComment} onChange={(e)=>this.setState({newGeneralComment:e.target.value})}/>
        </FormGroup>
        {this.state.newGeneralCommentParent && <span>
          Commenting on {this.state.newGeneralCommentParent.commentText.substring(0,10)}...
          <Button color="link" className="ml-auto"
            onClick={()=>this.setState({newGeneralCommentParent:null})}
            >
            <i className="fa fa-times" />
          </Button>
        </span>}
        <Button
          color="primary"
          disabled={ this.state.generalCommentSaving || this.state.newGeneralComment.length === 0 }
          onClick={this.addGeneralComment.bind(this)}
          >
          Add comment
        </Button>
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
