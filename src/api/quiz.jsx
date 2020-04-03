import apiConfig from '../configuration/api'

export const fetchQuestionGroups = () => {
  return `${apiConfig.API_URL}/questionGroups`
}
export const fetchTopicsToCreateModifyQuestionAssignment = () => {
  return `${apiConfig.API_URL}/topicsToCreateModifyQuestionAssignment`
}
export const fetchQuestionTypes = () => {
  return `${apiConfig.API_URL}/questionTypes`
}
export const fetchTopicsToCreateModifyQuestion = () => {
  return `${apiConfig.API_URL}/topicsToCreateModifyQuestion`
}
export const fetchGetAgents = () => {
  return `${apiConfig.API_URL}/getAgents`
}
export const fetchCreateQuestionAssignment = () => {
  return `${apiConfig.API_URL}/createQuestionAssignment`
}
export const fetchGetQuestionAssignment = () => {
  return `${apiConfig.API_URL}/getQuestionAssignment/`
}
export const fetchCreateNewQuestion = () => {
  return `${apiConfig.API_URL}/createNewQuestion`
}
export const fetchGetQuestionVersions = () => {
  return `${apiConfig.API_URL}/getQuestionVersions/`
}
export const fetchAddComment = () => {
  return `${apiConfig.API_URL}/addComment`
}
export const fetchApproveQuestionVersion = () => {
  return `${apiConfig.API_URL}/approveQuestionVersion`
}
export const fetchGetQuestionsForQuizAssignment = () => {
  return `${apiConfig.API_URL}/getQuestionsForQuizAssignment`
}
export const fetchCreateQuizAssignment = () => {
  return `${apiConfig.API_URL}/createQuizAssignment`
}
export const fetchGetQuizAssignment = () => {
  return `${apiConfig.API_URL}/getQuizAssignment/`
}
export const fetchQuizAssignments = () => {
  return `${apiConfig.API_URL}/quizAssignments`
}
export const fetchGetQuizTake = () => {
  return `${apiConfig.API_URL}/getQuizTake/`
}
export const fetchGenerateQuizTake = () => {
  return `${apiConfig.API_URL}/generateQuizTake/`
}
export const fetchSubmitQuizTake = () => {
  return `${apiConfig.API_URL}/submitQuizTake`
}
export const fetchSubmitReview = () => {
  return `${apiConfig.API_URL}/submitReview`
}
