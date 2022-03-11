import { addMinutesToUnix, inputToTimestamp } from 'helperFunctions';

export const infoOK = (info) => {
  return info.name.length > 4
}

export const fieldsOK = (fields) => {
  return fields.fields.length > 0
}

export const getRealDeadline = (periodSource) => {
  let deadline = inputToTimestamp(periodSource.deadline);
  let extraTime = parseInt(periodSource.extraTime);
  if(isNaN(extraTime)) {
    extraTime = 0;
  }
  if(deadline !== null) {
    return addMinutesToUnix(deadline, extraTime);
  }
  return null;
}

export const periodOK = (periodSource, improved = false) => {
  let openTime = inputToTimestamp(improved ? periodSource.improvedOpenTime : periodSource.openTime);
  let deadline = inputToTimestamp(improved ? periodSource.improvedDeadline : periodSource.deadline);
  let extraTime = parseInt(improved ? periodSource.improvedExtraTime : periodSource.extraTime);
  return openTime !== null && deadline !== null && !isNaN(extraTime) &&
    openTime <= deadline && extraTime >= 0
}


export const submissionOK = (submission) => {
  let improvedOpenTime = inputToTimestamp(submission.improvedOpenTime);
  let realDeadline = getRealDeadline(submission)
  return periodOK(submission) &&
    (!submission.improvedSubmission || (
      periodOK(submission, true) &&
      realDeadline !== null &&
      realDeadline <= improvedOpenTime
    ))
}

export const teamsOK = (teams) => {
  return teams.disabled || (
    !isNaN(parseInt(teams.minimumInTeam)) &&
    !isNaN(parseInt(teams.maximumInTeam)) &&
    parseInt(teams.minimumInTeam) <= parseInt(teams.maximumInTeam) &&
    parseInt(teams.minimumInTeam) >= 2
  )
}

export const reviewsOK = (reviews, realDeadline) => {
  let openTime = inputToTimestamp(reviews.openTime);
  return reviews.disabled || (
    periodOK(reviews) &&
    (realDeadline === null || realDeadline <= openTime) &&
    reviews.questions.length > 0 &&
    parseInt(reviews.reviewsPerSubmission) >= 1
  );
}


export const teamReviewsOK = (teams, teamReviews, realDeadline) => {
  let openTime = inputToTimestamp(teamReviews.openTime);
  return teams.disabled || teamReviews.disabled || (
    periodOK(teamReviews) &&
    (realDeadline === null || realDeadline <= openTime)
  );
}
