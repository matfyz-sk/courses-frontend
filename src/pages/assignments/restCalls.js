import { inputToTimestamp, getIRIFromAddResponse, axiosAddEntity } from '../../helperFunctions';

export const addAssignment = (newAssignment, courseInstanceID, afterFunction ) => {

  let assignmentData = {
    courseInstance: courseInstanceID,
    name: newAssignment.info.name,
    shortDescription: newAssignment.info.shortDescription.replace(/(?:\r\n|\r|\n)/g,''),
    description: newAssignment.info.description.replace(/(?:\r\n|\r|\n)/g,''),
    submissionAnonymousSubmission: newAssignment.submission.anonymousSubmission,
    submissionImprovedSubmission: newAssignment.submission.improvedSubmission,
    teamsDisabled: newAssignment.teams.disabled,
    reviewsDisabled: newAssignment.reviews.disabled,

    teamReviewsDisabled: newAssignment.teamReviews.disabled,
    hasMaterial:[],
    hasField:[],
    reviewsQuestion:[],
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

  let existingQuestionsIDs = newAssignment.reviews.questions.filter((question) => !question.new).map((question) => question['@id'] );

  let newMaterials = newAssignment.info.hasMaterial.filter((material) => material.new).map((material) => ({
    name: material.name,
    URL: material.URL
  }));

  let existingMaterialsIDs = newAssignment.info.hasMaterial.filter((material) => !material.new).map((material) => material['@id'] );

  let newFields = newAssignment.fields.fields.map((field) => ({
    name: field.title,
    description: field.description.replace(/(?:\r\n|\r|\n)/g,''),
    label: field.type.label,
    fieldType: field.type.value,
  }));
  console.log(newFields);

  let periodsAxios=[];

  periodsAxios.push(axiosAddEntity( {//initial sub
    openTime: inputToTimestamp(newAssignment.submission.openTime),
    deadline: inputToTimestamp(newAssignment.submission.deadline),
    extraTime: newAssignment.submission.extraTime,
    startDate: newAssignment.submission.openTime,
    endDate: newAssignment.submission.deadline,
  }, 'assignmentPeriod' ));

  if(assignmentData.submissionImprovedSubmission){
    periodsAxios.push(axiosAddEntity( {//imp sub
      openTime: inputToTimestamp(newAssignment.submission.improvedOpenTime),
      deadline: inputToTimestamp(newAssignment.submission.improvedDeadline),
      extraTime: newAssignment.submission.improvedExtraTime,
      startDate: newAssignment.submission.improvedOpenTime,
      endDate: newAssignment.submission.improvedDeadline,
    }, 'assignmentPeriod' ));
  }

  if(!assignmentData.reviewsDisabled){
    periodsAxios.push(axiosAddEntity( {//peer review
      openTime: inputToTimestamp(newAssignment.reviews.openTime),
      deadline: inputToTimestamp(newAssignment.reviews.deadline),
      extraTime: newAssignment.reviews.extraTime,
      startDate: newAssignment.reviews.openTime,
      endDate: newAssignment.reviews.deadline,
    }, 'assignmentPeriod' ));
    assignmentData = {
      ...assignmentData,
      reviewsPerSubmission: parseInt(newAssignment.reviews.reviewsPerSubmission),
      reviewedByTeam: newAssignment.reviews.reviewedByTeam,
      reviewsVisibility: newAssignment.reviews.visibility,
    }
  }

  if(!assignmentData.teamReviewsDisabled && !assignmentData.teamsDisabled){
    periodsAxios.push(axiosAddEntity( {//team review
      openTime: inputToTimestamp(newAssignment.teamReviews.openTime),
      deadline: inputToTimestamp(newAssignment.teamReviews.deadline),
      extraTime: newAssignment.teamReviews.extraTime,
      startDate: newAssignment.teamReviews.openTime,
      endDate: newAssignment.teamReviews.deadline,
    }, 'assignmentPeriod' ));
  }

  let questionsAxios = [];
  if(!assignmentData.reviewsDisabled){
    questionsAxios = newQuestions.map((question) => axiosAddEntity( question, 'PeerReviewQuestion' ) )
  }

  let materialsAxios = newMaterials.map((material) => axiosAddEntity( material, 'material' ) )

  let fieldsAxios =  newFields.map((field) => axiosAddEntity( field, 'Field' ) )

  Promise.all([
    Promise.all( periodsAxios ),
    Promise.all( questionsAxios ),
    Promise.all( fieldsAxios ),
    Promise.all( materialsAxios ),
  ]).then(([periods, questions, fields, materials])=>{
    console.log('Everything is ready');
    console.log(periods);
    console.log(questions);
    console.log(fields);
    console.log(materials);
    let index = 0;
    //periods
    assignmentData.initialSubmissionPeriod = getIRIFromAddResponse(periods[index]);
    index ++;

    if(assignmentData.submissionImprovedSubmission){
      assignmentData.improvedSubmissionPeriod = getIRIFromAddResponse(periods[index]);
      index++;
    }

    if(!assignmentData.reviewsDisabled){
      assignmentData.peerReviewPeriod = getIRIFromAddResponse(periods[index]);
      index++;
      assignmentData.reviewsQuestion = existingQuestionsIDs.concat(questions.map((question)=>getIRIFromAddResponse(question)));
    }

    if(!assignmentData.teamReviewsDisabled && !assignmentData.teamsDisabled){
      assignmentData.teamReviewPeriod = getIRIFromAddResponse(periods[index]);
    }
    //end of periods

    assignmentData.hasMaterial = existingMaterialsIDs.concat(materials.map((material)=>getIRIFromAddResponse(material)));
    assignmentData.hasField = fields.map((field)=>getIRIFromAddResponse(field));
    console.log(assignmentData);
    console.log(assignmentData);
    return axiosAddEntity( assignmentData, 'assignment' ).then(afterFunction);
  })
}
