import React, { Component } from 'react';
import { connect } from "react-redux";
import { CardBody, Card, Button, FormGroup, Label, Input, Collapse,ListGroup, ListGroupItem, FormText, Alert } from 'reactstrap';

import { axiosGetEntities, axiosAddEntity, axiosUpdateEntity, getResponseBody, getShortID, periodHappening, periodHasEnded, periodStarted, prepareMultiline } from 'helperFunctions'

import OneReview from './oneReview';
import InstructorTeamReviewDetails from './instructorDetailView';
import TeamReviewDetails from './teamDetailView';

class TeamReview extends Component {
  constructor(props){
    super(props);
    this.state= {
      teammates: [],
      teammatesLoaded: false,
      //review data about me
      reviewsOfMe: [],
      reviewsOfMeLoaded: false,
      //raw review data by me
      myReviews: [],
      myReviewsLoaded: false,
      //review input data
      reviews: [],
      reviewsLoaded: false,
      //raw review data
      allReviews: [],
      allReviewsLoaded: false,
      //reviews assigned to all members
      memberReviews: [],
      memberReviewsLoaded: false,

      saving: false,
    }
    this.submissionID = null;
    if( this.props.initialSubmission !== null ){
      this.submissionID = this.props.initialSubmission['@id'];
    }else if( this.props.improvedSubmission !== null ){
      this.submissionID = this.props.improvedSubmission['@id'];
    }

    this.fetchTeammates.bind(this);
    this.fetchReviewsOfMe.bind(this);
    this.fetchMyReviews.bind(this);
    this.fetchAllReviews.bind(this);
    this.prepareReviews.bind(this);
    this.fetchAllReviews.bind(this);
    this.prepareAllReviews.bind(this);
  }

  fetchTeammates(){
    axiosGetEntities(`teamInstance?instanceOf=${ this.props.settings.isInstructor ? this.props.match.params.targetID : this.props.match.params.teamID}&approved=true&_join=hasUser`).then((response)=>{
      let teammates = getResponseBody(response).filter((member) => member.hasUser[0]['@id'] !== this.props.user.fullURI );
      teammates = teammates.map( (teammate) => teammate.hasUser[0] );
      let afterTeammatesUpdate = () => {};
      if(this.props.settings.isInstructor){
        afterTeammatesUpdate = this.prepareAllReviews;
      }else if(periodHappening(this.props.assignment.teamReviewPeriod)){
        afterTeammatesUpdate = this.prepareReviews;
      }
      this.setState( { teammates, teammatesLoaded: true }, afterTeammatesUpdate );
    })
  }

  fetchReviewsOfMe(){
    if( this.submissionID === null ){
      return;
    }
    axiosGetEntities(`teamReview?reviewedStudent=${this.props.user.id}&ofSubmission=${getShortID(this.submissionID)}`).then((response)=>{
      let reviewsOfMe = getResponseBody(response);
      this.setState( { reviewsOfMe, reviewsOfMeLoaded: true });
    })
  }

  fetchMyReviews(){
    if( this.submissionID === null ){
      return;
    }
    axiosGetEntities(`teamReview?ofSubmission=${getShortID(this.submissionID)}&createdBy=${this.props.user.id}&&_join=reviewedStudent`).then((response) => {
      let myReviews = getResponseBody(response);
      this.setState( { myReviews, myReviewsLoaded: true }, this.prepareReviews );
    })
  }

  prepareReviews(){
    if( !this.state.teammatesLoaded || !this.state.myReviewsLoaded || !periodHappening(this.props.assignment.teamReviewPeriod) ){
      return;
    }
    let reviews = [];
    //empty reviews
    this.state.teammates.forEach((teammate) => {
      reviews.push({
        percentage: 100,
        studentComment: '',
        privateComment: '',
        id: teammate['@id'],
        student: teammate,
        exists: false,
      })
    })
    //load previous
    this.state.myReviews.forEach((existingReview) =>{
      let index = reviews.findIndex( (review) => review.id === existingReview.reviewedStudent[0]['@id'] );
      if( index !== -1 ){
        reviews[index] = {
          percentage: existingReview.percentage,
          studentComment: existingReview.studentComment,
          privateComment: existingReview.privateComment,
          id: reviews[index].id,
          student: reviews[index].student,
          exists: true,
          reviewID: existingReview['@id'],
        }
      }
    })
    this.setState({ reviews, reviewsLoaded:true });
  }

  fetchAllReviews(){
    if( this.submissionID === null ){
      return;
    }
    axiosGetEntities(`teamReview?ofSubmission=${getShortID(this.submissionID)}`).then((response)=>{
      let allReviews = getResponseBody(response);
      this.setState( { allReviews, allReviewsLoaded: true },this.prepareAllReviews );
    })
  }

  prepareAllReviews(){
    if( !this.state.teammatesLoaded || !this.state.allReviewsLoaded || !periodHasEnded(this.props.assignment.teamReviewPeriod) ){
      return;
    }
    let reviews = this.state.allReviews.map( (review) => ({
      ...review,
      createdBy: this.state.teammates.find( (member) => review.createdBy['@id'] === member['@id'] )
    }))
    const memberReviews = this.state.teammates.map( (member) => ({
      ...member,
      reviews: reviews.filter((review) => review.reviewedStudent[0]['@id'] === member['@id'] )
    }));
    this.setState({ memberReviews, memberReviewsLoaded: true  })
  }

  submitTeamReview(){
    if( this.submissionID === null ){
      return;
    }
    this.setState({ saving: true })
    let existingReviews = this.state.reviews.filter( (review) => review.exists );
    let newReviews = this.state.reviews.filter( (review) => !review.exists );
    let axiosReviews = [
      ...existingReviews.map( (review) => axiosUpdateEntity( {
        percentage: review.percentage.toString(),
        studentComment: prepareMultiline(review.studentComment),
        privateComment: prepareMultiline(review.privateComment),
      } , `teamReview/${getShortID(review.reviewID)}` ) ),
      ...newReviews.map( (review) => axiosAddEntity( {
        percentage: review.percentage.toString(),
        reviewedStudent: review.student['@id'],
        studentComment: prepareMultiline(review.studentComment),
        privateComment: prepareMultiline(review.privateComment),
        ofSubmission: this.submissionID
      } , 'teamReview' ) ),
    ];
    Promise.all(axiosReviews).then(()=>{
      this.setState({ saving: false })
      this.fetchMyReviews();
    })
  }

  /*
  nacitat clenov teamu
  nacitat hodnotenia od teamu ak skoncil cas

  otvorit formular ak prebieha hodnotenie
  ak student nezanechal review nechat komentar a 100
  zobrazit review - pocet bodov/pocet clenov zaokruhlit

  ak ucitel vypis studentov a ich hodnoteni a od koho

  ak je initial tak ulozit k nemu, ak nie je initial tak extended ak ziadne nie je napisat ze team sa neda hodnotit
  */
  componentWillMount(){
    this.fetchTeammates();
    if( !this.props.settings.isInstructor ){
      if( periodHasEnded(this.props.assignment.teamReviewPeriod) ){
        this.fetchMyReviews();
        this.fetchReviewsOfMe();
      }
      if( periodHappening(this.props.assignment.teamReviewPeriod) ){
        this.fetchMyReviews();
      }
    }else if( periodHasEnded(this.props.assignment.teamReviewPeriod) ){
      this.fetchAllReviews();
    }
  }

  render(){
    if( !periodStarted(this.props.assignment.teamReviewPeriod) ){
      return (
        <Alert color="danger" className="mt-3">
          Team review hasn't started yet!
        </Alert>
      )
    }
    if( !periodHasEnded(this.props.assignment.teamReviewPeriod) && this.props.settings.isInstructor ){
      return (
        <Alert color="danger" className="mt-3">
          Team review hasn't ended yet!
        </Alert>
      )
    }

    if( this.submissionID === null && !this.props.settings.isInstructor ){
      return (
        <Alert color="danger" className="mt-3">
          You can't review your team if you haven't submitted anything!
        </Alert>
      )
    }
    if( this.submissionID === null && this.props.settings.isInstructor ){
      return (
        <Alert color="danger" className="mt-3">
          This team didn't submit submission so there are no reviews to view!
        </Alert>
      )
    }
    const loading = !this.state.teammatesLoaded ||
    ( periodHappening(this.props.assignment.teamReviewPeriod) && !this.state.reviewsLoaded ) || //ak sa deje perioda musia byt nacitnae reviews
    ( !this.props.settings.isInstructor && periodHasEnded(this.props.assignment.teamReviewPeriod) && ( !this.state.myReviewsLoaded || !this.state.reviewsOfMeLoaded) ) || //ak sa nedeje perioda musia byt nacitane hodnotenia mnou a ostatnymi
    ( this.props.settings.isInstructor && periodHasEnded(this.props.assignment.teamReviewPeriod) && !this.state.allReviewsLoaded ) //ak som instruktor, musia byt nacitane timy a vsetky ich hodnotenia

    if( loading ){
      return (
        <Alert color="primary" className="mt-3">
          Loading team reviews...
        </Alert>
      )
    }
    return(
      <div>
        { periodHappening(this.props.assignment.teamReviewPeriod) && this.state.reviews.map((review) =>
          <OneReview
            key={ review.id }
            student={ review.student }
            percentage={ review.percentage }
            studentComment={ review.studentComment }
            privateComment={ review.privateComment }
            onChange={ (newReview) => {
              let newReviews = [...this.state.reviews];
              const index = newReviews.findIndex( (oldReview) => oldReview.id === review.id );
              newReviews[index] = {
                ...newReviews[index],
                ...newReview
              }
              this.setState({ reviews: newReviews })
            }}
            />
        )}
        { periodHappening(this.props.assignment.teamReviewPeriod) &&
          <Button color="primary" disabled={this.state.saving} onClick={this.submitTeamReview.bind(this)}>{ this.state.saving ? 'Saving team review' : 'Save team review' }</Button>
        }
        {
          this.props.settings.isInstructor && periodHasEnded(this.props.assignment.teamReviewPeriod) &&
          <InstructorTeamReviewDetails reviews={this.state.allReviews} students={this.state.teammates} />
        }
        {
          !this.props.settings.isInstructor && periodHasEnded(this.props.assignment.teamReviewPeriod) &&
          <TeamReviewDetails reviews={this.state.reviewsOfMe} myReviews={this.state.myReviews} students={this.state.teammates} />
        }
      </div>
    )
  }
}

const mapStateToProps = ({ authReducer, assignStudentDataReducer }) => {
  const { user } = authReducer;
  return {
    user,
  };
};

export default connect(mapStateToProps, {  })(TeamReview);
