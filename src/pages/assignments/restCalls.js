import {axiosRequest} from '../../helperFunctions';
import { API_URL as REST_URL } from '../../configuration/api';

export const addAssignment = (newAssignment, courseInstanceID) => {
  let courseInstanceFullID = `http://www.courses.matfyz.sk/data/course/${courseInstanceID}`;
  console.log(courseInstanceFullID);

  let assignmentData = {
    courseInstance: courseInstanceFullID,
    name: newAssignment.info.name,
    shortDescription: newAssignment.info.shortDescription,
    description: newAssignment.info.description,
    submissionAnonymousSubmission: newAssignment.submission.anonymousSubmission,
    submissionImprovedSubmission: newAssignment.submission.improvedSubmission,
    teamsDisabled: newAssignment.teams.disabled,
    reviewsDisabled: newAssignment.reviews.disabled,

    teamReviewsDisabled: newAssignment.teamReviews.disabled,
    hasDocument:[],
    hasField:[],
    reviewsQuestions:[],
  }

  if(!assignmentData.teamsDisabled){
    assignmentData = {
      ...assignmentData,
      teamsSubmittedAsTeam: newAssignment.teams.submittedAsTeam,
      teamsMinimumInTeam: parseInt(newAssignment.teams.minimumInTeam),
      teamsMaximumInTeam: parseInt(newAssignment.teams.maximumInTeam),
      teamsMultipleSubmissions: newAssignment.teams.multipleSubmissions,
    }
  }


  let newQuestions = newAssignment.reviews.questions.filter((question) => question.new).map((question) => ({
    question: question.question,
    rated: question.rated,
    deadline: 10,
  }));

  let exstingQuestionsIDs = newAssignment.reviews.questions.filter((question) => !question.new).map((question) => question['@id'] );

  let newFields = newAssignment.fields.fields.map((field) => ({
    name: field.title,
    description: field.description,
    label: field.type.label,
    fieldType: field.type.value,
  }));


  let periodsAxios=[];

  periodsAxios.push(axiosAddEntity( {//initial sub
    extraTime: newAssignment.submission.extraTime,
    openTime: newAssignment.submission.openTime,
    deadline: newAssignment.submission.deadline,
    startDate: newAssignment.submission.openTime,
    endDate: newAssignment.submission.deadline,
  }, 'AssignmentPeriod' ));

  if(assignmentData.submissionImprovedSubmission){
    periodsAxios.push(axiosAddEntity( {//imp sub
      openTime: newAssignment.submission.improvedOpenTime,
      deadline: newAssignment.submission.improvedDeadline,
      extraTime: newAssignment.submission.improvedExtraTime,
      startDate: newAssignment.submission.improvedOpenTime,
      endDate: newAssignment.submission.improvedDeadline,
    }, 'AssignmentPeriod' ));
  }

  if(!assignmentData.reviewsDisabled){
    periodsAxios.push(axiosAddEntity( {//peer review
      openTime: newAssignment.reviews.openTime,
      deadline: newAssignment.reviews.deadline,
      extraTime: newAssignment.reviews.extraTime,
      startDate: newAssignment.reviews.openTime,
      endDate: newAssignment.reviews.deadline,
    }, 'AssignmentPeriod' ));
    assignmentData = {
      ...assignmentData,
      reviewsPerSubmission: parseInt(newAssignment.reviews.reviewsPerSubmission),
      reviewedByTeam: newAssignment.reviews.reviewedByTeam,
      reviewsVisibility: newAssignment.reviews.visibility,
    }
  }

  if(!assignmentData.teamReviewsDisabled && !assignmentData.teamsDisabled){
    periodsAxios.push(axiosAddEntity( {//team review
      openTime: newAssignment.teamReviews.openTime,
      deadline: newAssignment.teamReviews.deadline,
      extraTime: newAssignment.teamReviews.extraTime,
      startDate: newAssignment.teamReviews.openTime,
      endDate: newAssignment.teamReviews.deadline,
    }, 'AssignmentPeriod' ));
  }

  let questionsAxios = [];
  if(!assignmentData.reviewsDisabled){
    questionsAxios = newQuestions.map((question) => axiosAddEntity( question, 'PeerReviewQuestion' ) )
  }

  let fieldsAxios =  newFields.map((field) => axiosAddEntity( field, 'Field' ) )

  /*
  let newMaterials = newAssignment.info.documents.map((document) => ({
    name: document.name,
    url: document.url
  }));
  console.log(newMaterials);
  */
  Promise.all([
    Promise.all( periodsAxios ),
    Promise.all( questionsAxios ),
    Promise.all( fieldsAxios ),
    //Promise.all([ newMaterials.map((material) => axiosAddEntity( material, 'AssignmentMaterial' ) ) ]),
  ]).then(([periods, questions, fields, /*materials*/])=>{
    console.log(periods);
    console.log(questions);
    console.log(fields);
    //console.log(materials);
    let index = 0;
    assignmentData.initialSubmissionPeriod = getIRIFromResponse(periods[index]);
    index ++;
    if(assignmentData.submissionImprovedSubmission){
      assignmentData.improvedSubmissionPeriod = getIRIFromResponse(periods[index]);
      index++;
    }

    if(!assignmentData.reviewsDisabled){
      assignmentData.peerReviewPeriod = getIRIFromResponse(periods[index]);
      index++;
      assignmentData.reviewsQuestions = exstingQuestionsIDs.concat(questions.map((question)=>getIRIFromResponse(question)));
    }

    if(!assignmentData.teamReviewsDisabled && !assignmentData.teamsDisabled){
      assignmentData.teamReviewPeriod = getIRIFromResponse(periods[index]);
    }
    assignmentData.hasField = fields.map((field)=>getIRIFromResponse(field));
    return axiosAddEntity( assignmentData, 'Assignment' );
  })
}

export const getIRIFromResponse = (response) => {
  return response.response.data.resource.iri;
}

export const getReviewQuestions = () => {
  return axiosRequest(
    'get',
    `${REST_URL}/PeerReviewQuestion`,
    null
  )
}

export const logCourses = () => {
  return axiosRequest(
    'get',
    `${REST_URL}/course`,
    null
  ).then( (response) => console.log(response) )
}

export const axiosAddEntity = ( data, entity  ) => {
  return axiosRequest(
    'post',
    `${REST_URL}/${entity}`,
    data
  )
}

/*
addCourse() {
  this.addCourseInstance();
  return;
  axiosRequest(
    'post',
    `${BACKEND_URL}/data/course`,
    {
      name:'Assignments test course',
      description: 'I test assignments here',
      abbreviation: 'AS',
      hasPrerequisite:[],
      hasAdmin:["http://www.courses.matfyz.sk/data/user/OkL1d"]
    }
  )
}

addCourseInstance() {
  axiosRequest(
    'post',
    `${BACKEND_URL}/data/CourseInstance`,
    {
      description:'Testing assignments here',
      endDate: "2020-07-09T23:00:00.000Z",
      hasInstructor: ["http://www.courses.matfyz.sk/data/user/OkL1d"],
      instanceOf: "http://www.courses.matfyz.sk/data/course/LpYwo",
      mentions:[],
      name: 'I test assignments here 1',
      reccomends:[],
      startDate: "2020-02-21T23:00:00.000Z",
      uses:[]
    }
  )
}
*/
