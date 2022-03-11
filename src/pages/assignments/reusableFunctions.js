import {
  axiosAddEntity,
  axiosDeleteEntity,
  axiosUpdateEntity,
  getIRIFromAddResponse,
  getShortID,
  htmlRemoveNewLines,
  inputToTimestamp
} from 'helperFunctions';

export const getAssignmentPeriods = (assignment) => {
  let periods = [ ...assignment.initialSubmissionPeriod ];
  if(assignment.submissionImprovedSubmission) {
    periods.push(...assignment.improvedSubmissionPeriod);
  }
  if(!assignment.reviewsDisabled) {
    periods.push(...assignment.peerReviewPeriod);
  }
  if(!assignment.teamReviewsDisabled && !assignment.teamsDisabled) {
    periods.push(...assignment.teamReviewPeriod);
  }
  return periods.map((period) => period['@id']);
}

export const findPeriod = (oldPeriod, periods) => {
  return periods.find((period) => period['@id'] === oldPeriod[0]['@id'])
}

export const assignPeriods = (originalAssignment, periods) => {
  let assignment = {
    ...originalAssignment,
    initialSubmissionPeriod: findPeriod(originalAssignment.initialSubmissionPeriod, periods)
  }
  if(assignment.submissionImprovedSubmission) {
    assignment.improvedSubmissionPeriod = findPeriod(originalAssignment.improvedSubmissionPeriod, periods);
  }
  if(!assignment.reviewsDisabled) {
    assignment.peerReviewPeriod = findPeriod(originalAssignment.peerReviewPeriod, periods);
  }
  if(!assignment.teamReviewsDisabled && !assignment.teamsDisabled) {
    assignment.teamReviewPeriod = findPeriod(originalAssignment.teamReviewPeriod, periods);
  }
  return assignment;
}

export const prepareAssignmentData = (newAssignment) => {
  let assignmentData = {
    name: newAssignment.info.name,
    shortDescription: htmlRemoveNewLines(newAssignment.info.shortDescription),
    description: htmlRemoveNewLines(newAssignment.info.description),
    submissionAnonymousSubmission: newAssignment.submission.anonymousSubmission,
    submissionImprovedSubmission: newAssignment.submission.improvedSubmission,
    teamsDisabled: newAssignment.teams.disabled,
    reviewsDisabled: newAssignment.reviews.disabled,

    teamReviewsDisabled: newAssignment.teams.disabled || newAssignment.teamReviews.disabled,
    hasMaterial: [],
    hasField: [],
    reviewsQuestion: [],
  }

  if(!assignmentData.teamsDisabled) {
    assignmentData = {
      ...assignmentData,
      teamsSubmittedAsTeam: newAssignment.teams.submittedAsTeam,
      teamsMinimumInTeam: parseInt(newAssignment.teams.minimumInTeam),
      teamsMaximumInTeam: parseInt(newAssignment.teams.maximumInTeam),
      teamsMultipleSubmissions: newAssignment.teams.multipleSubmissions,
    }
  }
  return assignmentData;
}

export const preparePeriod = (source, improved = false) => {
  return {
    openTime: inputToTimestamp(source[`${ improved ? 'improvedO' : 'o' }penTime`]),
    deadline: inputToTimestamp(source[`${ improved ? 'improvedD' : 'd' }eadline`]),
    extraTime: source[`${ improved ? 'improvedE' : 'e' }xtraTime`],
    startDate: source[`${ improved ? 'improvedO' : 'o' }penTime`],
    endDate: source[`${ improved ? 'improvedD' : 'd' }eadline`],
  }
}

export const addAssignment = (newAssignment, courseInstanceID, afterFunction) => {
  let assignmentData = prepareAssignmentData(newAssignment);
  assignmentData.courseInstance = courseInstanceID;

  let newQuestions = newAssignment.reviews.questions.filter((question) => question.new).map((question) => ({
    question: question.question,
    rated: question.rated,
    deadline: 10,
  }));

  let existingQuestionsIDs = newAssignment.reviews.questions.filter((question) => !question.new).map((question) => question['@id']);

  let newMaterials = newAssignment.info.hasMaterial.filter((material) => material.new).map((material) => ({
    name: material.name,
    URL: material.URL
  }));

  let existingMaterialsIDs = newAssignment.info.hasMaterial.filter((material) => !material.new).map((material) => material['@id']);

  let newFields = newAssignment.fields.fields.map((field) => ({
    name: field.title,
    description: htmlRemoveNewLines(field.description),
    label: field.type.label,
    fieldType: field.type.value,
  }));

  let periodsAxios = [];

  periodsAxios.push(axiosAddEntity({//initial sub
    ...preparePeriod(newAssignment.submission),
    courseInstance: courseInstanceID,
  }, 'assignmentPeriod'));

  if(assignmentData.submissionImprovedSubmission) {
    periodsAxios.push(axiosAddEntity({//imp sub
      ...preparePeriod(newAssignment.submission, true),
      courseInstance: courseInstanceID,
    }, 'assignmentPeriod'));
  }

  if(!assignmentData.reviewsDisabled) {
    periodsAxios.push(axiosAddEntity({//peer review
      ...preparePeriod(newAssignment.reviews),
      courseInstance: courseInstanceID,
    }, 'assignmentPeriod'));
    assignmentData = {
      ...assignmentData,
      reviewsPerSubmission: parseInt(newAssignment.reviews.reviewsPerSubmission),
      reviewedByTeam: newAssignment.reviews.reviewedByTeam,
      reviewsVisibility: newAssignment.reviews.visibility,
    }
  }

  if(!assignmentData.teamReviewsDisabled && !assignmentData.teamsDisabled) {
    periodsAxios.push(axiosAddEntity({//team review
      ...preparePeriod(newAssignment.teamReviews),
      courseInstance: courseInstanceID,
    }, 'assignmentPeriod'));
  }

  let questionsAxios = [];
  if(!assignmentData.reviewsDisabled) {
    questionsAxios = newQuestions.map((question) => axiosAddEntity(question, 'PeerReviewQuestion'))
  }

  let materialsAxios = newMaterials.map((material) => axiosAddEntity(material, 'material'))

  let fieldsAxios = newFields.map((field) => axiosAddEntity(field, 'Field'))

  Promise.all([
    Promise.all(periodsAxios),
    Promise.all(questionsAxios),
    Promise.all(fieldsAxios),
    Promise.all(materialsAxios),
  ]).then(([ periods, questions, fields, materials ]) => {
    let index = 0;
    //periods
    assignmentData.initialSubmissionPeriod = getIRIFromAddResponse(periods[index]);
    index++;

    if(assignmentData.submissionImprovedSubmission) {
      assignmentData.improvedSubmissionPeriod = getIRIFromAddResponse(periods[index]);
      index++;
    }

    if(!assignmentData.reviewsDisabled) {
      assignmentData.peerReviewPeriod = getIRIFromAddResponse(periods[index]);
      index++;
      assignmentData.reviewsQuestion = existingQuestionsIDs.concat(questions.map((question) => getIRIFromAddResponse(question)));
    }

    if(!assignmentData.teamReviewsDisabled && !assignmentData.teamsDisabled) {
      assignmentData.teamReviewPeriod = getIRIFromAddResponse(periods[index]);
    }
    //end of periods

    assignmentData.hasMaterial = existingMaterialsIDs.concat(materials.map((material) => getIRIFromAddResponse(material)));
    assignmentData.hasField = fields.map((field) => getIRIFromAddResponse(field));
    return axiosAddEntity(assignmentData, 'assignment').then(afterFunction);
  })
}

export const editAssignment = (newAssignment, assignment, afterFunction) => {
  const assignmentID = assignment['@id'];
  const courseInstance = assignment.courseInstance['@id'];

  let assignmentData = prepareAssignmentData(newAssignment);
  let newQuestions = newAssignment.reviews.questions.filter((question) => question.new).map((question) => ({
    question: question.question,
    rated: question.rated,
    deadline: 10,
  }));

  let existingQuestionsIDs = newAssignment.reviews.questions.filter((question) => !question.new).map((question) => question['@id']);

  let newMaterials = newAssignment.info.hasMaterial.filter((material) => material.new).map((material) => ({
    name: material.name,
    URL: material.URL
  }));

  let existingMaterialsIDs = newAssignment.info.hasMaterial.filter((material) => !material.new).map((material) => material['@id']);

  let newFields = newAssignment.fields.fields.filter((field) => field.exists === undefined).map((field) => ({
    name: field.title,
    description: htmlRemoveNewLines(field.description),
    label: field.type.label,
    fieldType: field.type.value,
  }));

  let existingFields = newAssignment.fields.fields.filter((field) => field.exists).map((field) => ({
    id: field.fieldID,
    name: field.title,
    description: htmlRemoveNewLines(field.description),
    label: field.type.label,
    fieldType: field.type.value,
  }));

  if(!assignmentData.reviewsDisabled) {
    assignmentData = {
      ...assignmentData,
      reviewsPerSubmission: parseInt(newAssignment.reviews.reviewsPerSubmission),
      reviewedByTeam: newAssignment.reviews.reviewedByTeam,
      reviewsVisibility: newAssignment.reviews.visibility,
    }
  }

  let axiosPeriods = [];
  let axiosDeletePeriods = [];
  //initial sub - always update
  axiosPeriods.push(axiosUpdateEntity(preparePeriod(newAssignment.submission), `assignmentPeriod/${ getShortID(assignment.initialSubmissionPeriod['@id']) }`));

  if(assignmentData.submissionImprovedSubmission && assignment.submissionImprovedSubmission) { //update existing
    axiosPeriods.push(axiosUpdateEntity(preparePeriod(newAssignment.submission, true), `assignmentPeriod/${ getShortID(assignment.improvedSubmissionPeriod['@id']) }`));
  } else if(assignmentData.submissionImprovedSubmission && !assignment.submissionImprovedSubmission) { //add new
    axiosPeriods.push(axiosAddEntity({
      ...preparePeriod(newAssignment.submission, true),
      courseInstance
    }, `assignmentPeriod`));
  } else if(!assignmentData.submissionImprovedSubmission && assignment.submissionImprovedSubmission) { //delete existing
    axiosDeletePeriods.push(axiosDeleteEntity(`assignmentPeriod/${ getShortID(assignment.improvedSubmissionPeriod['@id']) }`));
    axiosDeletePeriods.push(axiosDeleteEntity(`assignment/${ getShortID(assignmentID) }/improvedSubmissionPeriod`));
  }

  if(!assignmentData.reviewsDisabled && !assignment.reviewsDisabled) { //update existing
    axiosPeriods.push(axiosUpdateEntity(preparePeriod(newAssignment.reviews), `assignmentPeriod/${ getShortID(assignment.peerReviewPeriod['@id']) }`));
  } else if(!assignmentData.reviewsDisabled && assignment.reviewsDisabled) { //add new
    axiosPeriods.push(axiosAddEntity({...preparePeriod(newAssignment.reviews), courseInstance}, `assignmentPeriod`));
  } else if(assignmentData.reviewsDisabled && !assignment.reviewsDisabled) { //delete existing
    axiosDeletePeriods.push(axiosDeleteEntity(`assignmentPeriod/${ getShortID(assignment.peerReviewPeriod['@id']) }`));
    axiosDeletePeriods.push(axiosDeleteEntity(`assignment/${ getShortID(assignmentID) }/peerReviewPeriod`));
  }

  if(!assignmentData.teamReviewsDisabled && !assignment.teamReviewsDisabled) { //update existing
    axiosPeriods.push(axiosUpdateEntity(preparePeriod(newAssignment.teamReviews), `assignmentPeriod/${ getShortID(assignment.teamReviewPeriod['@id']) }`));
  } else if(!assignmentData.teamReviewsDisabled && assignment.teamReviewsDisabled) { //add new
    axiosPeriods.push(axiosAddEntity({
      ...preparePeriod(newAssignment.teamReviews),
      courseInstance
    }, `assignmentPeriod`));
  } else if(assignmentData.teamReviewsDisabled && !assignment.teamReviewsDisabled) { //delete existing
    axiosDeletePeriods.push(axiosDeleteEntity(`assignmentPeriod/${ getShortID(assignment.teamReviewPeriod['@id']) }`));
    axiosDeletePeriods.push(axiosDeleteEntity(`assignment/${ getShortID(assignmentID) }/teamReviewPeriod`));
  }

  let axiosQuestions = [];
  if(!assignmentData.reviewsDisabled) {
    axiosQuestions = newQuestions.map((question) => axiosAddEntity(question, 'PeerReviewQuestion'))
  }
  let axiosMaterials = newMaterials.map((material) => axiosAddEntity(material, 'material'))

  let axiosFields = newFields.map((field) => axiosAddEntity(field, 'field')).concat(
    existingFields.map((field) => axiosUpdateEntity({
      name: field.name,
      description: field.description,
      label: field.label,
      fieldType: field.fieldType,
    }, `field/${ getShortID(field.id) }`))
  )

  let axiosDeleteFields = assignment.hasField.map((field) => field['@id'])
    .filter((filedID) => !existingFields.some((field) => field.id === filedID))
    .map((fieldID) => axiosDeleteEntity(`field/${ getShortID(fieldID) }`))
  Promise.all([
    Promise.all(axiosPeriods),
    Promise.all(axiosDeletePeriods),
    Promise.all(axiosQuestions),
    Promise.all(axiosFields),
    Promise.all(axiosDeleteFields),
    Promise.all(axiosMaterials),
  ]).then(([ periodResponses, deletedPeriodResponses, questionResponses, fieldResponses, deletedFieldResponses, materialResponses ]) => {
    let periodsIDs = periodResponses.map((response) => getIRIFromAddResponse(response))
    let questionsIDs = questionResponses.map((response) => getIRIFromAddResponse(response))
    let fieldsIDs = fieldResponses.map((response) => getIRIFromAddResponse(response))
    let materialsIDs = materialResponses.map((response) => getIRIFromAddResponse(response))
    let index = 0;
    //periods
    assignmentData.initialSubmissionPeriod = periodsIDs[index];
    index++;

    if(assignmentData.submissionImprovedSubmission) {
      assignmentData.improvedSubmissionPeriod = periodsIDs[index];
      index++;
    }

    if(!assignmentData.reviewsDisabled) {
      assignmentData.peerReviewPeriod = periodsIDs[index];
      index++;
      assignmentData.reviewsQuestion = existingQuestionsIDs.concat(questionsIDs);
    }

    if(!assignmentData.teamReviewsDisabled) {
      assignmentData.teamReviewPeriod = periodsIDs[index];
    }
    //end of periods
    assignmentData.hasMaterial = existingMaterialsIDs.concat(materialsIDs);
    assignmentData.hasField = fieldsIDs;
    return axiosUpdateEntity(assignmentData, `assignment/${ getShortID(assignmentID) }`).then(afterFunction);
  })

}
