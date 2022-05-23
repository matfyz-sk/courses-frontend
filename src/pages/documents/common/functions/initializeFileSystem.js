import {
  axiosAddEntity,
  axiosUpdateEntity,
  getIRIFromAddResponse,
  getShortID,
} from '../../../../helperFunctions'

export async function initializeFileSystem(courseFullId) {
  const toCreate = {
    name: 'Home',
    courseInstance: courseFullId,
  }
  const response = await axiosAddEntity(toCreate, 'folder')
  if (response.failed) {
    console.error('error!')
    return
  }
  const newFolderId = getIRIFromAddResponse(response)
  const toUpdate = {
    fileExplorerRoot: newFolderId,
  }
  await axiosUpdateEntity(
    toUpdate,
    `courseInstance/${getShortID(courseFullId)}`
  )
  return newFolderId
}
