import { DocumentEnums } from '../enums/document-enums'
import {
  axiosAddEntity,
  axiosGetEntities,
  axiosUpdateEntity,
  getIRIFromAddResponse,
  getResponseBody,
  getShortID,
} from '../../../helperFunctions'

const PAYLOAD_ENTITIES = [
  DocumentEnums.file.entityName,
  DocumentEnums.internalDocument.entityName,
]

const canCreatePayload = entityName => {
  return PAYLOAD_ENTITIES.includes(entityName)
}

const createNewVersionData = async (newDocument, oldDocument, props) => {
  // destructuring previous version
  const {
    '@id': previousVersionId,
    '@type': type,
    createdAt,
    createdBy,
    nextVersion,
    ...properties
  } = oldDocument

  const { entityName, name, mimeType, uri, filename, isDeleted, restoredFrom } = newDocument
  let content;
  if (newDocument.payload) {
    content = newDocument.payload[0].content
  }

  let payload;
  if (canCreatePayload(entityName)) {
    if (entityName === DocumentEnums.file.entityName) {
      payload = {
        content,
      }
    } else {
      payload = {
        content: `""${content}""`, // needed for sparql/rdf
      }
    }
  }

  let newVersion = {
    ...properties,
    // TODO add material attrs
    // ...props.materialAttrs.map(attr => ({attr: attr.map(ref => ref['@id'])})),
    // refersTo: props.materialAttrs.refersTo.map(ref => ref["@id"]),
    _type: entityName, // TODO should be multiple
    name,
    parent: props.folder["@id"],
    isDeleted,
    restoredFrom,
    courseInstance: [props.courseInstance['@id']],
  }

  // add additional params
  let subclassParams = {}
  switch (entityName) {
    case DocumentEnums.internalDocument.entityName:
      subclassParams = {
        payload,
        mimeType,
      }
      break
    case DocumentEnums.externalDocument.entityName:
      subclassParams = { uri }
      break
    case DocumentEnums.file.entityName:
      subclassParams = {
        payload,
        filename,
        mimeType,
      }
      break
    default:
      break
  }

  newVersion = {
    ...newVersion,
    ...subclassParams,
  }

  if (props.isInEditingMode) {
    newVersion = {
      ...newVersion,
      previousVersion: previousVersionId,
      historicVersion: [
        previousVersionId,
        ...oldDocument.historicVersion.map(doc => doc['@id']),
      ],
    }
  }
  return newVersion
}

const createNewVersion = async newVersion => {
  const response = await axiosAddEntity(newVersion, 'document')
  if (response.failed) {
    console.error(response.error)
    return
  }
  return getIRIFromAddResponse(response)
}

const setSuccessorOfOldVersion = async (successorId, oldVersionFullId, entityName) => {
  const entityUrl = `${entityName}/${getShortID(oldVersionFullId)}`
  const dataToUpdate = {
    nextVersion: successorId,
  }

  const response = await axiosUpdateEntity(dataToUpdate, entityUrl)
  if (response.failed) {
    console.error(response.error)
  }
}

const updateDocumentReferences = async (newVersionFullId, oldVersionFullId, courseInstance) => {
  const entitiesUrl = `documentReference?courseInstance=${getShortID(courseInstance["@id"])}`
  const response = await axiosGetEntities(entitiesUrl)
  if (response.failed) {
    console.error(response.error)
    return
  }
  const docRefs = getResponseBody(response).filter(
    ref => ref.hasDocument[0]['@id'] === oldVersionFullId
  )
  for (const ref of docRefs) {
    const entityUrl = `documentReference/${getShortID(ref['@id'])}`
    const data = {
      hasDocument: newVersionFullId,
    }
    const refResponse = await axiosUpdateEntity(data, entityUrl)
    if (refResponse.failed) {
      console.error(refResponse.error)
    }
  }
}

const replaceInParentFolder = async (newVersionFullId, oldVersionFullId, folder) => {
  const folderContent = {
    content: [
      newVersionFullId,
      ...folder.content
        .map(fsObj => fsObj['@id'])
        .filter(id => id !== oldVersionFullId),
    ],
    lastChanged: new Date(),
  }

  const entityUrl = `folder/${getShortID(folder["@id"])}`

  const response = await axiosUpdateEntity(folderContent, entityUrl)
  if (response.failed) {
    console.error(response.error)
  }
}

const replaceInCurrentDocuments = async (newVersionFullId, oldVersionFullId, props) => {
  const currentDocuments = {
    hasDocument: [
      newVersionFullId,
      ...props.courseInstance.hasDocument
        .map(doc => doc['@id'])
        .filter(id => id !== oldVersionFullId),
    ],
  }

  const entityUrl = `courseInstance/${getShortID(props.courseInstance["@id"])}`

  const response = await axiosUpdateEntity(currentDocuments, entityUrl)
  if (response.failed) {
    console.error(response.error)
    return
  }
  // because if I don't reload page courseInstance is not fetched again, but I need it up to date
  props.setCurrentDocumentsOfCourseInstance(
    currentDocuments.hasDocument.map(doc => ({ '@id': doc }))
  )
}

const editDocument = async (newDocument, oldDocument, props) => {
  const data = await createNewVersionData(newDocument, oldDocument, props)
  if (!data) {
    console.error('Editing was unsuccessful!')
    return
  }
  const newVersionFullId = await createNewVersion(data)
  if (!newVersionFullId) {
    console.error('Editing was unsuccessful!')
    return
  }
  // if (props.isMaterial) {
  //   createMaterial(newVersionFullId, props.materialAttrs)
  // }
  if (props.isInEditingMode) {
    setSuccessorOfOldVersion(newVersionFullId, oldDocument['@id'], newDocument.entityName) // no need for await
    updateDocumentReferences(newVersionFullId, oldDocument['@id'], props.courseInstance) // no need for await
  }

  await replaceInCurrentDocuments(newVersionFullId, oldDocument['@id'], props)
  await replaceInParentFolder(newVersionFullId, oldDocument['@id'], props.folder)
  return getShortID(newVersionFullId)
}

export default editDocument
