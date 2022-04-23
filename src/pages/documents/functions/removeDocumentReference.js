import { axiosDeleteEntity, axiosGetEntities, getResponseBody, getShortID } from "../../../helperFunctions";

const removeDocumentReference = async (documentId, courseId) => {
  const referenceUrl = `documentReference?courseInstance=${courseId}`
  const response = await axiosGetEntities(referenceUrl)
  if (response.failed) {
    console.error("couldn't retrieve entity")
    return
  }
  const wantedRef = getResponseBody(response).filter(
    ref => getShortID(ref.hasDocument[0]['@id']) === documentId
  )
  if (wantedRef.length > 0) {
    axiosDeleteEntity(`documentReference/${getShortID(wantedRef[0]['@id'])}`)
  }
}

export default removeDocumentReference
