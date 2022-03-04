import { MenuItem, Select } from '@material-ui/core'
import React, { useState, useEffect, useCallback } from 'react'
import { withRouter } from 'react-router'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import {
  axiosAddEntity,
  axiosGetEntities,
  axiosUpdateEntity,
  getResponseBody,
  getIRIFromAddResponse,
  fileToBase64,
  base64dataToFile,
} from 'helperFunctions'

import {
  Alert,
  Button,
  CustomInput,
  Form,
  FormFeedback,
  FormGroup,
  Label,
  Input,
} from 'reactstrap'
import { HiDownload } from 'react-icons/hi'
import CustomEditor from './wysiwyg/ckeditor'
import { DocumentEnums } from './enums/document-enums'
import { setCurrentDocumentsOfCourseInstance } from '../../redux/actions'
import * as ROUTES from '../../constants/routes'
import { redirect } from '../../constants/redirect'
import Page404 from 'pages/errors/Page404'
import { isValidHttpUrl } from '../../functions/validators'

const ICON_SIZE = 56
const ICON_COLOR = '#237a23'

const customErrorStyle = {
  marginTop: '.25rem',
  fontSize: '80%',
  color: '#dc3545',
}

function DocumentForm(props) {
  // FIXME props.courseInstance is null
  // FIXME ?? operator and ?. compatibility
  // FIXME empty fields are shown before they are filled... when editing existing one

  const [status, setStatus] = useState(200)

  const [loading, setLoading] = useState(false)
  const [courseId, setCourseId] = useState(props.match.params.course_id ?? '')

  // when creating a brand new document
  const [entityName, setEntityName] = useState(props.entityName ?? '')

  // both used when document already exists
  const [id, setId] = useState(props.match.params.document_id ?? '')
  const [document, setDocument] = useState({})

  // shared among all document subclasses
  const [name, setName] = useState('')

  // document subclass specific
  const [file, setFile] = useState(null)
  const [filePath, setFilePath] = useState('')
  const [filename, setFilename] = useState('')
  const [uri, setUri] = useState('')
  const [content, setContent] = useState('')
  const [mimeType, setMimeType] = useState('text/markdown')

  const fetchDocument = useCallback(() => {
    if (!id) return

    setLoading(true)
    const entityUrl = `document/${id}`
    axiosGetEntities(entityUrl)
      .then(response => {
        if (response.failed) {
          setStatus(response.response ? response.response.status : 500)
          return
        }
        return getResponseBody(response)
      })
      .then(data => {
        const responseDocument = data[0]
        if (
          responseDocument.isDeleted ||
          responseDocument.nextVersion.length !== 0
        ) {
          props.history.push(
            redirect(ROUTES.DOCUMENTS, [{ key: 'course_id', value: courseId }])
          )
          return
        }
        setDocument(responseDocument)
        setName(responseDocument.name)
        setContent(responseDocument.content)
        switch (responseDocument['@type']) {
          case DocumentEnums.internalDocument.id:
            setEntityName(DocumentEnums.internalDocument.entityName)
            setContent(responseDocument.content)
            setMimeType(responseDocument.mimeType)
            break
          case DocumentEnums.externalDocument.id:
            setEntityName(DocumentEnums.externalDocument.entityName)
            setUri(responseDocument.uri)
            break
          case DocumentEnums.file.id:
            setFilename(responseDocument.filename)
            setEntityName(DocumentEnums.file.entityName)
            setContent(responseDocument.content)
            setMimeType(responseDocument.mimeType)
            break
          default:
            break
        }
        setLoading(false || props.courseInstance == null)
      })
  }, [courseId, id])

  useEffect(() => {
    fetchDocument()
  }, [fetchDocument])

  useEffect(() => {
    setLoading(props.courseInstance == null) // TODO careful for bugs, looks like it introduced some ckeditor errors
  }, [props.courseInstance])

  const createNewVersionPayload = async () => {
    // destructuring previous version
    const {
      '@id': previousVersionId,
      '@type': type,
      createdAt,
      createdBy,
      nextVersion,
      ...properties
    } = document

    let newVersion = {
      ...properties, // empty previous version still valid
      _type: entityName,
      name,
      isDeleted: false,
      author: [props.user.fullURI], //? idk if we are adding a new author, if its a collaborative scenario?...
      owner: props.user.fullURI,
      courseInstance: [props.courseInstance['@id']], // TODO push to existing ones
    }
    // add addtional params
    switch (entityName) {
      case DocumentEnums.internalDocument.entityName:
        const internalDocumentParams = {
          content: `""${content}""`, // needed for sparql/rdf
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
          content: id ? content : await fileToBase64(file),
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

    if (id) {
      newVersion = {
        ...newVersion,
        previousVersion: previousVersionId,
        historicVersion: [
          previousVersionId,
          ...document.historicVersion.map(doc => doc['@id']),
        ],
      }
    }
    return newVersion
  }

  const createNewVersion = async newVersion => {
    const entityUrl = 'document'
    console.log({ newVersion })
    return await axiosAddEntity(newVersion, entityUrl).then(response => {
      if (response.failed) {
        console.error(response.error)
        setStatus(response.response ? response.response.status : 500)
        return
      }
      return getIRIFromAddResponse(response)
    })
  }

  const setSuccessorOfOldVersion = successorId => {
    const entityUrl = `${entityName}/${id}`
    const dataToUpdate = {
      nextVersion: successorId,
    }

    axiosUpdateEntity(dataToUpdate, entityUrl).then(response => {
      if (response.failed) {
        console.error(response.error)
        setStatus(response.response ? response.response.status : 500)
      }
    })
  }

  const replaceInCurrentDocuments = (newVersionId, oldVersionId) => {
    // ? works as intended when oldV is undefined... but maybe still add a condition?
    const entityUrl = `courseInstance/${courseId}`
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

    axiosUpdateEntity(newCurrentDocuments, entityUrl).then(response => {
      if (response.failed) {
        setStatus(response.response ? response.response.status : 500)
        return
      }
      props.setCurrentDocumentsOfCourseInstance(
        newCurrentDocuments.hasDocument.map(doc => ({ '@id': doc }))
      )
      props.history.push(
        redirect(ROUTES.DOCUMENTS, [{ key: 'course_id', value: courseId }])
      )
    })
  }

  const handleEdit = async e => {
    if (!formValid()) {
      return
    }
    e.preventDefault()
    const newVersion = await createNewVersionPayload()
    const newVersionId = await createNewVersion(newVersion)
    if (!newVersionId) {
      console.error('Editing was unsuccessful!')
      return
    }
    if (id) {
      setSuccessorOfOldVersion(newVersionId)
    }
    replaceInCurrentDocuments(newVersionId, document['@id'])
  }

  const mimeTypeOptions = ['text/html', 'text/markdown']
  const nonEditorTypes = [
    DocumentEnums.externalDocument.entityName,
    DocumentEnums.file.entityName,
  ]
  const langModes = { 'text/html': 'html', 'text/markdown': 'markdown' }

  const onChangeFile = e => {
    setFile(e.target.files[0])
    setMimeType(e.target.files[0].type)
    setFilename(e.target.files[0].name)
    setFilePath(e.target.value)
    console.log({ filename: e.target.files[0].name })
  }

  const onDownloadFile = async e => {
    const decodedFile = await base64dataToFile(content, filename, mimeType)
    const href = URL.createObjectURL(decodedFile)
    const a = Object.assign(window.document.createElement('a'), {
      href,
      style: 'display: none',
      download: filename,
    })
    window.document.body.appendChild(a)
    a.click()
    URL.revokeObjectURL(href)
    a.remove()
  }

  const formValid = () => {
    let valid = name.length > 0
    switch (entityName) {
      case DocumentEnums.externalDocument.entityName:
        valid = valid && isValidHttpUrl(uri)
        break
      case DocumentEnums.file.entityName:
        valid = valid && filename.length > 0
        break
      default:
        break
    }
    return valid
  }

  if (status === 404) {
    return <Page404 />
  }

  if (loading) {
    return (
      <Alert color="secondary" className="empty-message">
        Loading...
      </Alert>
    )
  }

  return (
    <Form style={{ maxWidth: '1000px', margin: '20px auto' }}>
      <h1 style={{ marginBottom: '2em' }}>
        {id ? 'Edit' : 'Create'} Document // TODO redundant heading???
      </h1>
      <FormGroup style={{ width: '40%' }}>
        <Label for="name">Name </Label>
        <Input
          id="name"
          invalid={name.length === 0}
          value={name}
          onChange={e => setName(e.target.value)}
        />
        <FormFeedback>Name is required</FormFeedback>
      </FormGroup>
      <br />
      <br />
      {entityName === DocumentEnums.externalDocument.entityName && (
        <FormGroup>
          <Label for="url"> Url </Label>
          <Input
            id="url"
            type="url"
            style={{ width: '40%' }}
            invalid={uri.length === 0}
            value={uri}
            onChange={e => setUri(e.target.value)}
          />
          <FormFeedback>Valid url is required</FormFeedback>
        </FormGroup>
      )}

      {entityName === DocumentEnums.file.entityName && id && (
        <Label for="file-download">
          Saved file:{' '}
          <Link
            id="file-download"
            to={{ textDecoration: 'none' }}
            onClick={onDownloadFile}
          >
            <HiDownload style={{ color: ICON_COLOR }} size={ICON_SIZE} />
          </Link>
        </Label>
      )}

      <FormGroup
        style={{ width: '40%' }}
        hidden={entityName !== DocumentEnums.file.entityName}
      >
        <Label for="file"> File </Label>
        <CustomInput
          id="file"
          type="file"
          invalid={filename.length === 0}
          label={filename || '...'}
          value={filePath}
          onChange={onChangeFile}
        >
          {/* <FormFeedback>File is required</FormFeedback> */}
        </CustomInput>
        {filename.length === 0 && (
          <p style={customErrorStyle}>File is required</p>
        )}
      </FormGroup>

      {entityName === DocumentEnums.internalDocument.entityName && (
        <FormGroup>
          <Label for="format"> Format </Label>
          <br />
          <Select
            id="format"
            value={mimeType}
            onChange={e => setMimeType(e.target.value)}
          >
            {mimeTypeOptions.map((option, i) => (
              <MenuItem key={i} value={option}>
                {option}
              </MenuItem>
            ))}
          </Select>

          <br />
          <br />
          <CustomEditor
            content={content}
            setContent={setContent}
            mimeType={mimeType}
          />
          {/* <CustomEditor content={content} setContent={setContent}
              ckeditor={CKSUPEREDITOR.HTMLClassicEditor}
            />
             <CustomEditor content={content} setContent={setContent}
                ckeditor={CKSUPEREDITOR.MarkdownClassicEditor}
            /> */}

          {content.length === 0 && (
            <p style={customErrorStyle}>Document can't be empty</p>
          )}
        </FormGroup>
      )}
      <br />

      {status !== 200 && (
        <Alert color="warning">
          There has been a server error, try again please!
        </Alert>
      )}
      <Button color="success" onClick={handleEdit}>
        Save editing
      </Button>
      <pre>{JSON.stringify(document, null, 2)}</pre>
    </Form>
  )
}

const mapStateToProps = state => {
  const { authReducer, courseInstanceReducer } = state
  return {
    user: authReducer.user,
    courseInstance: courseInstanceReducer.courseInstance,
  }
}

export default withRouter(
  connect(mapStateToProps, { setCurrentDocumentsOfCourseInstance })(
    DocumentForm
  )
)
