import { axiosGetEntities, getResponseBody } from "../../../../helperFunctions"

export default async function getDeletedDocuments(courseId) {
    const entitiesUrl = `document?hasDocument=${courseId}&isDeleted=true`
    const response = await axiosGetEntities(entitiesUrl)
    if (response.failed) {
        return []
    }
    return getResponseBody(response)
}
