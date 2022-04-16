import {
  axiosAddEntity,
  axiosGetEntities,
  getIRIFromAddResponse,
  getResponseBody,
  getShortID,
} from 'helperFunctions'

async function createReferenceOfDocumment(document, courseInstance) {
  const referenceData = {
    hasDocument: document['@id'],
    courseInstance: courseInstance['@id'],
  }
  const response = await axiosAddEntity(referenceData, 'documentReference')
  if (response.failed) {
    console.error('failed to create entity')
    return
  }
  return getIRIFromAddResponse(response)
}

export default async function getReferenceOfDocument(document, courseInstance) {
  const courseId = getShortID(courseInstance['@id'])
  const referenceUrl = `documentReference?courseInstance=${courseId}`
  const response = await axiosGetEntities(referenceUrl)
  if (response.failed) {
    console.error("couldn't retrieve entity")
    return
  }
  const wantedRef = getResponseBody(response).filter(
    ref => ref.hasDocument[0]['@id'] === document['@id']
  )
  if (wantedRef.length > 0) {
    return wantedRef[0]['@id']
  }
  return await createReferenceOfDocumment(document, courseInstance)
}
