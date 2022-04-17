import {
  axiosGetEntities,
  getResponseBody,
  getShortID,
  getShortType,
} from 'helperFunctions'
import { DocumentEnums } from '../enums/document-enums'

async function getAllDeletedDescendants(folderId) {
  const response = await axiosGetEntities(`folder/${folderId}?_join=content`)
  const data = getResponseBody(response)[0]
  
  var deleted = []
  
  for (const fsObject of data.content) {
    if (typeof fsObject['@type'] !== 'string') {
      continue // TODO temp workaround
    }
    if (getShortType(fsObject['@type']) === DocumentEnums.folder.entityName) {
      deleted.push(
        ...(await getAllDeletedDescendants(getShortID(fsObject['@id'])))
      )
      continue
    }
    if (fsObject.isDeleted) {
      deleted.push(fsObject)
    }
  }
  return deleted
}

export default async function getDeletedDocuments(rootFolderId) {
  const allDeleted = await getAllDeletedDescendants(rootFolderId)
  return allDeleted
}
