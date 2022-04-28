import {
  axiosDeleteAttributeValueOfEntity,
  axiosPartialEntityUpdate,
  axiosUpdateEntity,
  getShortID,
  getShortType,
} from '../../../helperFunctions'
import { DocumentEnums } from '../enums/document-enums'

export async function changeParent(fsObject, newParentFullId, oldParentFullId) {
  const entityName = getShortType(fsObject['@type'])
  if (entityName === DocumentEnums.folder.entityName) {
    const toUpdate = {
      parent: newParentFullId,
    }
    await axiosUpdateEntity(toUpdate, `folder/${getShortID(fsObject['@id'])}`)
  }
  await axiosPartialEntityUpdate(
    { lastChanged: new Date() },
    `folder/${getShortID(oldParentFullId)}`
  )
  await axiosDeleteAttributeValueOfEntity(
    { value: fsObject['@id'] },
    `folder/${getShortID(oldParentFullId)}/content`
  )

  await axiosPartialEntityUpdate(
    { content: [fsObject['@id']], lastChanged: new Date() },
    `folder/${getShortID(newParentFullId)}`
  )
}
