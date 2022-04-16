import { DocumentEnums } from "../enums/document-enums"
import { axiosAddEntity, axiosGetEntities, axiosUpdateEntity, getIRIFromAddResponse, getResponseBody, getShortID } from "helperFunctions"

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
  
  const { name, mimeType, uri, filename, parent } = newDocument
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
    const response = await axiosAddEntity(payload, 'payload')
    if (response.failed) {
      console.error('payload', response.error)
      props.setStatus(response.response ? response.response.status : 500)
      return
    }
    var payloadId = getIRIFromAddResponse(response)
    console.log({ payloadId })
  }

  let newVersion = {
    ...properties,
    // TODO add material attrs
      // ...props.materialAttrs.map(attr => ({attr: attr.map(ref => ref['@id'])})),
    // refersTo: props.materialAttrs.refersTo.map(ref => ref["@id"]),
    _type: props.entityName, // TODO should be multiple
    name,
    parent,
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
  console.log({newVersion})
  const response = await axiosAddEntity(newVersion, 'document')
  if (response.failed) {
    console.error(response.error)
    props.setStatus(response.response ? response.response.status : 500)
    return
  }
  return getIRIFromAddResponse(response)
}

const setSuccessorOfOldVersion = async (successorId, oldVersionId, props) => {
  const entityUrl = `${props.entityName}/${getShortID(oldVersionId)}`
  const dataToUpdate = {
    nextVersion: successorId,
  }

  const response = await axiosUpdateEntity(dataToUpdate, entityUrl)
  if (response.failed) {
    console.error(response.error)
    props.setStatus(response.response ? response.response.status : 500)
  }
}

const updateDocumentReferences = async (newVersionId, oldVersionId, props) => {
  const entitiesUrl = `documentReference?courseInstance=${getShortID(
    props.courseInstance['@id']
  )}`
  const response = await axiosGetEntities(entitiesUrl)
  if (response.failed) {
    console.error(response.error)
    props.setStatus(response.response ? response.response.status : 500)
    return
  }
  const docRefs = getResponseBody(response).filter(
    ref => ref.hasDocument[0]['@id'] === oldVersionId
  )
  for (const ref of docRefs) {
    const entityUrl = `documentReference/${getShortID(ref['@id'])}`
    const data = {
      hasDocument: newVersionId,
    }
    const refResponse = axiosUpdateEntity(data, entityUrl)
    if (refResponse.failed) {
      console.error(refResponse.error)
    }
  }
}

// const replaceNewerVersionInEvents = async (newVersionId, oldVersionId, courseInstanceId) => {
//   const entitiesUrl = `event?courseInstance=${courseInstanceId}`
//   const response = await axiosGetEntities(entitiesUrl)
//   if (response.failed) {
//     console.error(response.error)
//     props.setStatus(response.response ? response.response.status : 500)
//     return
//   }
//   const events = getResponseBody(response)
//   for (const event of events) {
//     if (event.hasDocument.map(material => material['@id']).includes(oldVersionId)) {
//       const patchData = {
//         hasDocument: [
//           newVersionId,
//           ...data.hasDocument
//             .map(doc => doc['@id'])
//             .filter(id => id !== oldVersionId),
//         ],
//       }
//       axiosUpdateEntity(patchData, `event/${getShortID(event["@id"])}`)
//         .then(response => {
//           // TODO resolve
//           if (response.failed) {
//             console.error(response.error)
//             props.setStatus(response.response ? response.response.status : 500)
//           }
//         })
        
//     }
//   }
// }

const replaceInParentFolder = async (newVersionId, oldVersionId, props) => {
  const folderContent = {
    content: [
      newVersionId,
      ...props.folder.content
        .map(fsObj => fsObj['@id'])
        .filter(id => id !== oldVersionId),
    ],
  }
  // * easy deletion
  // const folderContent = {
  //     content: []
  // }
  const entityUrl = `folder/${getShortID(props.folder.id)}`

  const response = await axiosUpdateEntity(folderContent, entityUrl)
  if (response.failed) {
    console.error(response.error)
    props.setStatus(response.response ? response.response.status : 500)
    return
  }
  // props.setFolderContent???
}


const editDocument = async (newDocument, oldDocument, props) => {
  // TODO so await or mix??
  const data = await createNewVersionData(newDocument, oldDocument, props)
  if (!data) {
    console.error('Editing was unsuccessful!')
    return
  }
  const newVersionId = await createNewVersion(data, props)
  if (!newVersionId) {
    console.error('Editing was unsuccessful!')
    return
  }
  // if (props.isMaterial) {
  //   createMaterial(newVersionId, props.materialAttrs)
  // }
  if (props.isInEditingMode) {
    setSuccessorOfOldVersion(newVersionId, oldDocument["@id"], props) // no need for await
    updateDocumentReferences(newVersionId, oldDocument["@id"], props) // no need for await
  }
  // await needed so we can see the change via redux
  await replaceInParentFolder(newVersionId, oldDocument["@id"], props)
  return getShortID(newVersionId)
}

export default editDocument