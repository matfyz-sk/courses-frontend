import React, { Component } from 'react';
import { connect } from "react-redux";
import { Button, Alert } from 'reactstrap';

import { axiosGetEntities, axiosAddEntity, axiosUpdateEntity, getResponseBody, getShortID, periodHappening, periodHasEnded, periodStarted, prepareMultiline } from 'helperFunctions'

import OneReview from './oneReview';
import InstructorTeamReviewDetails from './instructorDetailView';
import TeamReviewDetails from './teamDetailView';
import { useGetTeamInstanceWithApprovedUsersQuery } from 'services/team'
import { 
  useGetTeamReviewOfUserAndSubmissionQuery,
  useGetTeamReviewOfSubmissionCreatedByQuery,
  useGetTeamReviewOfSubmissionQuery,
  useAddTeamReviewMutation,
  useUpdateTeamReviewMutation,
} from 'services/assignments'

function TeamReview(props) {
  const [teammates, setTeammates] = useState([])
  const [teammatesLoaded, setTeammatesLoaded] = useState(false)
  //review data about me
  const [reviewsOfMe, setReviewsOfMe] = useState([])
  const [reviewsOfMeLoaded, setReviewsOfMeLoaded] = useState(false)
  //raw review data by me
  const [myReviews, setMyReviews] = useState([])
  const [myReviewsLoaded, setMyReviewsLoaded] = useState(false)
  //review input data
  const [reviews, setReviews] = useState([])
  const [reviewsLoaded, setReviewsLoaded] = useState(false)
  //raw review data
  const [allReviews, setAllReviews] = useState([])
  const [allReviewsLoaded, setAllReviewsLoaded] = useState(false)
  //reviews assigned to all members
  const [memberReviews, setMemberReviews] = useState([])
  const [memberReviewsLoaded, setMemberReviewsLoaded] = useState(false)

  const [saving, setSaving] = useState(false)
  const submissionID = getSubmissionID(props)
  const [addTeamReview, addTeamReviewResult] = useAddTeamReviewMutation()
  const [updateTeamReview, updateTeamReviewResult] = useUpdateTeamReviewMutation()

  useEffect(() => {
    if (props.settings.isInstructor) {
      prepareAllReviews();
    } else if (periodHappening(props.assignment.teamReviewPeriod)) {
      prepareReviews();
    }
  }, [teammates, teammatesLoaded])

  useEffect(() => {
    prepareReviews()
  }, [reviewsOfMe, reviewsOfMeLoaded])

  useEffect(() => {
    prepareAllReviews()
  }, [allReviews, allReviewsLoaded])

  /*
  nacitat clenov teamu
  nacitat hodnotenia od teamu ak skoncil cas

  otvorit formular ak prebieha hodnotenie
  ak student nezanechal review nechat komentar a 100
  zobrazit review - pocet bodov/pocet clenov zaokruhlit

  ak ucitel vypis studentov a ich hodnoteni a od koho

  ak je initial tak ulozit k nemu, ak nie je initial tak extended ak ziadne nie je napisat ze team sa neda hodnotit
  */
  useEffect(() => {
    fetchTeammates();
    if (!props.settings.isInstructor) {
      if (periodHasEnded(props.assignment.teamReviewPeriod)) {
        fetchMyReviews();
        fetchReviewsOfMe();
      }
      if (periodHappening(props.assignment.teamReviewPeriod)) {
        fetchMyReviews();
      }
    } else if (periodHasEnded(props.assignment.teamReviewPeriod)) {
      fetchAllReviews();
    }
  }, [])

  const fetchTeammates = () => {
    const id = props.settings.isInstructor ? props.match.params.targetID : props.match.params.teamID
    const {data, isSuccess} = useGetTeamInstanceWithApprovedUsersQuery(id)
    if (isSuccess && data) { 
      let teammates = data.filter((member) => member.hasUser[0]['@id'] !== props.user.fullURI );
      teammates = teammates.map( (teammate) => teammate.hasUser[0] );
      setTeammates(teammates)
      setTeammatesLoaded(true)
    }
  }

  const fetchReviewsOfMe = () => {
    if (submissionID === null) {
      return;
    }
    const {data, isSuccess} = useGetTeamReviewOfUserAndSubmissionQuery({
      id: props.user.id,
      subId: getShortID(submissionID)
    })
    if (isSuccess && data) { 
      setReviewsOfMe(data)
      setReviewsOfMeLoaded(true)
    }
  }

  const fetchMyReviews = () => {
    if (submissionID === null) {
      return;
    }
    const {data, isSuccess} = useGetTeamReviewOfSubmissionCreatedByQuery({
      id: props.user.id,
      subId: getShortID(submissionID)
    })
    if(isSuccess && data) { 
      setMyReviews(data)
      setMyReviewsLoaded(true)
    }
  }

  const prepareReviews = () =>{
    if (!teammatesLoaded || !myReviewsLoaded || !periodHappening(props.assignment.teamReviewPeriod)) {
      return;
    }
    let reviews = [];
    //empty reviews
    teammates.forEach((teammate) => {
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
    myReviews.forEach((existingReview) =>{
      let index = reviews.findIndex((review) => review.id === existingReview.reviewedStudent[0]['@id']);
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
    setReviews(reviews)
    setReviewsLoaded(true)
  }

  const fetchAllReviews = () => {
    if (submissionID === null) {
      return;
    }
    const {data, isSuccess} = useGetTeamReviewOfSubmissionQuery(getShortID(submissionID))
    if (isSuccess && data) { 
      setAllReviews(data)
      setAllReviewsLoaded(true)
    }
  }

  const prepareAllReviews = () => {
    if (!teammatesLoaded || !allReviewsLoaded || !periodHasEnded(props.assignment.teamReviewPeriod)) {
      return;
    }
    let reviews = allReviews.map((review) => ({
      ...review,
      createdBy: teammates.find((member) => review.createdBy['@id'] === member['@id'])
    }))
    const memberReviews = teammates.map((member) => ({
      ...member,
      reviews: reviews.filter((review) => review.reviewedStudent.length > 0 && review.reviewedStudent[0]['@id'] === member['@id'])
    }));
    setMemberReviews(memberReviews)
    setMemberReviewsLoaded(true)
  }

  const submitTeamReview = () => {
    if (submissionID === null) {
      return;
    }
    setSaving(true)
    let existingReviews = reviews.filter((review) => review.exists);
    let newReviews = reviews.filter((review) => !review.exists);
    existingReviews.forEach(review => {
      updateTeamReview({
        id: getShortID(review.reviewID),
        patch: {
          percentage: review.percentage.toString(),
          studentComment: prepareMultiline(review.studentComment),
          privateComment: prepareMultiline(review.privateComment),
        }
      }).unwrap()
    })
    newReviews.forEach(review => {
      addTeamReview({
          percentage: review.percentage.toString(),
          studentComment: prepareMultiline(review.studentComment),
          privateComment: prepareMultiline(review.privateComment),
      }).unwrap()
    })
    setSaving(false)
    fetchMyReviews();
  }

  if (!periodStarted(props.assignment.teamReviewPeriod)) {
    return (
      <Alert color="danger" className="mt-3">
        Team review hasn't started yet!
      </Alert>
    )
  }

  if (!periodHasEnded(props.assignment.teamReviewPeriod) && props.settings.isInstructor) {
    return (
      <Alert color="danger" className="mt-3">
        Team review hasn't ended yet!
      </Alert>
    )
  }

  if (submissionID === null && !props.settings.isInstructor) {
    return (
      <Alert color="danger" className="mt-3">
        You can't review your team if you haven't submitted anything!
      </Alert>
    )
  }

  if(submissionID === null && props.settings.isInstructor) {
    return (
      <Alert color="danger" className="mt-3">
        This team didn't submit submission so there are no reviews to view!
      </Alert>
    )
  }

  const loading = !state.teammatesLoaded 
    || (periodHappening(props.assignment.teamReviewPeriod) && !reviewsLoaded) //ak sa deje perioda musia byt nacitnae reviews
    || (!props.settings.isInstructor && periodHasEnded(props.assignment.teamReviewPeriod) && (!myReviewsLoaded || !reviewsOfMeLoaded)) //ak sa nedeje perioda musia byt nacitane hodnotenia mnou a ostatnymi
    || (props.settings.isInstructor && periodHasEnded(props.assignment.teamReviewPeriod) && !allReviewsLoaded) //ak som instruktor, musia byt nacitane timy a vsetky ich hodnotenia

  if (loading){
    return (
      <Alert color="primary" className="mt-3">
        Loading team reviews...
      </Alert>
    )
  }

  return(
    <div>
      {periodHappening(props.assignment.teamReviewPeriod) && reviews.map((review) =>
        <OneReview
          key={ review.id }
          student={ review.student }
          percentage={ review.percentage }
          studentComment={ review.studentComment }
          privateComment={ review.privateComment }
          onChange={ (newReview) => {
            let newReviews = [...reviews];
            const index = newReviews.findIndex( (oldReview) => oldReview.id === review.id );
            newReviews[index] = {
              ...newReviews[index],
              ...newReview
            }
            setReviews(newReviews)
          }}
          />
      )}
      { periodHappening(props.assignment.teamReviewPeriod) &&
        <Button color="primary" disabled={saving} onClick={submitTeamReview}>{ saving ? 'Saving team review' : 'Save team review' }</Button>
      }
      {
        props.settings.isInstructor && periodHasEnded(props.assignment.teamReviewPeriod) &&
        <InstructorTeamReviewDetails reviews={allReviews} students={teammates} />
      }
      {
        !props.settings.isInstructor && periodHasEnded(props.assignment.teamReviewPeriod) &&
        <TeamReviewDetails reviews={reviewsOfMe} myReviews={myReviews} students={teammates} />
      }
    </div>
  )
} 

const getSubmissionID = (props) => {
  if (props.initialSubmission !== null) {
    return props.initialSubmission['@id'];
  } else if (props.improvedSubmission !== null) {
    return props.improvedSubmission['@id'];
  }
  return null
}

const mapStateToProps = ({ authReducer, assignStudentDataReducer }) => {
  const { user } = authReducer;
  return {
    user,
  };
};

export default connect(mapStateToProps, {  })(TeamReview);
