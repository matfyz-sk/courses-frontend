import {
  axiosAddEntity,
  axiosGetEntities,
  getIRIFromAddResponse,
  getResponseBody,
  getShortID,
} from '../../../../helperFunctions'

async function createReferenceOfDocument(document, courseInstance) {
  const referenceData = {
    hasDocument: document['_id'],
    courseInstance: courseInstance['_id'],
  }
  const response = await axiosAddEntity(referenceData, 'documentReference')
  if (response.failed) {
    console.error('failed to create entity')
    return
  }
  return getIRIFromAddResponse(response)
}

export default async function getReferenceOfDocument(document, courseInstance) {
  const courseId = getShortID(courseInstance['_id'])
  const referenceUrl = `documentReference?courseInstance=${courseId}`
  const response = await axiosGetEntities(referenceUrl)
  if (response.failed) {
    console.error("couldn't retrieve entity")
    return
  }
  const wantedRef = getResponseBody(response).filter(
    ref => ref.hasDocument[0]['_id'] === document['_id']
  )
  if (wantedRef.length > 0) {
    return wantedRef[0]['_id']
  }
  return await createReferenceOfDocument(document, courseInstance)
}
