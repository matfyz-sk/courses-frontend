import {
  axiosDeleteAttributeValueOfEntity,
  axiosPartialEntityUpdate, axiosUpdateEntity, getShortID, getShortType,
} from '../../../helperFunctions'
import { DocumentEnums } from "../enums/document-enums";

export async function changeParent(fsObject, newParentFullId, oldParentId) {
  const entityName = getShortType(fsObject["@type"])
  if (entityName === DocumentEnums.folder.entityName) {
    const toUpdate = {
      parent: newParentFullId
    }
    await axiosUpdateEntity(toUpdate, `folder/${getShortID(fsObject["@id"])}`)
  }
  await axiosPartialEntityUpdate(
    { content: [fsObject['@id']] },
    `folder/${getShortID(newParentFullId)}`
  )
  await axiosDeleteAttributeValueOfEntity(
    { value: fsObject['@id'] },
    `folder/${oldParentId}/content`
  )
}
