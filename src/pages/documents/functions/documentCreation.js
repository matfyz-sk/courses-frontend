import { DocumentEnums } from "../enums/document-enums"
import { axiosAddEntity, axiosUpdateEntity, getIRIFromAddResponse, getShortID } from "helperFunctions"

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
  
  const { name, mimeType, uri, filename } = newDocument
  if (newDocument.payload) {
    var content = newDocument.payload[0].content
  }

  if (canCreatePayload(props.entityName)) {
    if (props.entityName === DocumentEnums.file.entityName) {
      var payload = {
        content,
      }
    } else {
      var payload = {
        content: `""${content}""`, // needed for sparql/rdf
      }
    }
    console.log({ payload })
    var payloadId = await axiosAddEntity(payload, 'payload').then(
      response => {
        if (response.failed) {
          console.error('payload', response.error)
          props.setStatus(response.response ? response.response.status : 500)
          return
        }
        return getIRIFromAddResponse(response)
      }
    )
    console.log({ payloadId })
  }

  let newVersion = {
    ...properties,
    _type: props.entityName,
    name,
    isDeleted: false,
    restoredFrom: props.restoredFrom,
    author: [props.user.fullURI],
    owner: props.user.fullURI,
    courseInstance: [props.courseInstance['@id']], // TODO push to existing ones
  }
  // add addtional params
  switch (props.entityName) {
    case DocumentEnums.internalDocument.entityName:
      const internalDocumentParams = {
        payload: payloadId,
        mimeType,
      }
      newVersion = {
        ...newVersion,
        ...internalDocumentParams,
      }
      break
    case DocumentEnums.externalDocument.entityName:
      const externalDocumentParams = { uri }
      newVersion = {
        ...newVersion,
        ...externalDocumentParams,
      }
      break
    case DocumentEnums.file.entityName:
      const fileParams = {
        payload: payloadId,
        filename,
        mimeType,
      }
      newVersion = {
        ...newVersion,
        ...fileParams,
      }
      break
    default:
      break
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

const createNewVersion = async (newVersion, props) => {
  return await axiosAddEntity(newVersion, 'document').then(response => {
    if (response.failed) {
      console.error("whyy", response.error)
      props.setStatus(response.response ? response.response.status : 500)
      return
    }
    console.log({})
    return getIRIFromAddResponse(response)
  })
}

const setSuccessorOfOldVersion = (successorId, oldVersionId, props) => {
  const entityUrl = `${props.entityName}/${oldVersionId}`
  const dataToUpdate = {
    nextVersion: successorId,
  }

  axiosUpdateEntity(dataToUpdate, entityUrl).then(response => {
    if (response.failed) {
      console.error(response.error)
      props.setStatus(response.response ? response.response.status : 500)
    }
  })
}

const replaceInCurrentDocuments = (newVersionId, oldVersionId, props) => {
    const newCurrentDocuments = {
      hasDocument: [
        newVersionId,
        ...props.courseInstance.hasDocument
          .map(doc => doc['@id'])
          .filter(id => id !== oldVersionId),
      ],
    }
  // const newCurrentDocuments = {
  //     hasDocument: []
  // }
  const entityUrl = `courseInstance/${props.courseId}`

  axiosUpdateEntity(newCurrentDocuments, entityUrl).then(response => {
    if (response.failed) {
      console.error(response.error)
      props.setStatus(response.response ? response.response.status : 500)
      return
    }
    props.setCurrentDocumentsOfCourseInstance(
      newCurrentDocuments.hasDocument.map(doc => ({ '@id': doc }))
    )
    // props.history.push(
    //   redirect(ROUTES.DOCUMENTS, [{ key: 'course_id', value: props.courseId }])
    // )
  })
}

const editDocument = async (newDocument, oldDocument, props) => {
  console.log({newDocument, oldDocument, props})
  const data = await createNewVersionData(newDocument, oldDocument, props)
  console.log({data})
  const newVersionId = await createNewVersion(data, props)
  console.log("yasfinanlly", {newVersionId})
  if (!newVersionId) {
    console.error('Editing was unsuccessful!')
    return
  }
  if (props.isInEditingMode) {
    setSuccessorOfOldVersion(newVersionId, getShortID(oldDocument["@id"]), props)
  }
  replaceInCurrentDocuments(newVersionId, oldDocument["@id"], props)
  return getShortID(newVersionId)
}

export default editDocument