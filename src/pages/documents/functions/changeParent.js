import {
  axiosDeleteAttributeValueOfEntity,
  axiosPartialEntityUpdate,
} from '../../../helperFunctions'

export async function changeParent(fsObject, newParentId, oldParentId) {
  await axiosPartialEntityUpdate(
    { content: fsObject['@id'] },
    `folder/${newParentId}`
  )
  await axiosDeleteAttributeValueOfEntity(
    { value: fsObject['@id'] },
    `folder/${oldParentId}/content`
  )
}
