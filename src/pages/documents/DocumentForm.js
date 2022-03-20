import { MenuItem, Select } from '@material-ui/core'
import React, { useState, useEffect, useCallback } from 'react'
import { withRouter } from 'react-router'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import {
  axiosGetEntities,
  getResponseBody,
  fileToBase64,
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
import Page404 from '../errors/Page404'
import { isValidHttpUrl } from '../../functions/validators'
import editDocument  from './functions/documentCreation'
import downloadBase64File from './functions/downloadBase64File'


//TODO add conventional styling
const ICON_SIZE = 56
const ICON_COLOR = '#237a23'

const customErrorStyle = {
  marginTop: '.25rem',
  fontSize: '80%',
  color: '#dc3545',
}

const PAYLOAD_ENTITIES = [
  DocumentEnums.file.entityName,
  DocumentEnums.internalDocument.entityName,
]

function DocumentForm(props) {
  // FIXME large base64 file uploads not working
  // FIXME only owner can do

  const [status, setStatus] = useState(200)

  const [courseId, setCourseId] = useState(props.match.params.course_id)

  // when creating a brand new document
  const [entityName, setEntityName] = useState(props.entityName || '')

  // both used when document already exists
  const [id, setId] = useState(props.match.params.document_id || '')
  const [document, setDocument] = useState({})
  const isInEditingMode = useCallback(() => id !== '', [id])

  const [loadingCourseInstance, setLoadingCourseInstance] = useState(
    props.courseInstance == null
  )
  const [loadingDocument, setLoadingDocument] = useState(isInEditingMode())
  const [loading, setLoading] = useState(true)

  // shared among all document subclasses
  const [name, setName] = useState('')

  // document subclass specific
  const [fileLoaded, setFileLoaded] = useState(false)
  const [file, setFile] = useState(null)
  const [filePath, setFilePath] = useState('')
  const [filename, setFilename] = useState('')
  const [uri, setUri] = useState('')
  const [content, setContent] = useState('')
  const [mimeType, setMimeType] = useState('text/html')

  const fetchDocument = useCallback(() => {
    if (!isInEditingMode()) return

    setLoading(true)
    let entityUrl = `document/${id}?_join=payload`
    axiosGetEntities(entityUrl)
      .then(response => {
        if (response.failed) {
          console.error(response.error)
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
        switch (responseDocument['@type']) {
          case DocumentEnums.internalDocument.id:
            setEntityName(DocumentEnums.internalDocument.entityName)
            setContent(responseDocument.payload[0].content)
            setMimeType(responseDocument.mimeType)
            break
          case DocumentEnums.externalDocument.id:
            setEntityName(DocumentEnums.externalDocument.entityName)
            setUri(responseDocument.uri)
            break
          case DocumentEnums.file.id:
            setFilename(responseDocument.filename)
            setEntityName(DocumentEnums.file.entityName)
            setContent(responseDocument.payload[0].content)
            setMimeType(responseDocument.mimeType)
            break
          default:
            break
        }
        setLoadingDocument(false)
      })
  }, [courseId, isInEditingMode]) // ? shouldn't id be there as well?

  useEffect(() => {
    fetchDocument()    
  }, [fetchDocument])

  useEffect(() => {
    setLoadingCourseInstance(props.courseInstance == null)
  }, [props.courseInstance])

  useEffect(() => {
    if (!loadingCourseInstance && !loadingDocument) setLoading(false)
  }, [loadingCourseInstance, loadingDocument])


  const handleEdit = async e => {
    e.preventDefault()
    if (!formValid()) {
      window.scrollTo({ top: 0, behavior: 'smooth' })
      return
    }
    console.log({props})
    const editProps = {
      courseId,
      entityName,
      setStatus,
      isInEditingMode: isInEditingMode(),
      ...props,
    }
    const newVersionId = await editDocument(
      { name, mimeType, uri, filename, payload: [{ content }] },
      document,
      editProps
    )
    if (!newVersionId) {
      setStatus(500)
      return
    }
    props.history.push(
      redirect(ROUTES.DOCUMENTS, [
        { key: 'course_id', value: courseId },
      ])
    )
  }

  const mimeTypeOptions = ['text/html', 'text/markdown']

  // TODO change format selector accordingly
  // const langModes = { 'text/html': 'html', 'text/markdown': 'markdown' }

  const onChangeFile = e => {
    fileToBase64(e.target.files[0]).then(base64Content => {
      setContent(base64Content)
      console.log({ base64Content })
      setFileLoaded(true)
    })
    setMimeType(e.target.files[0].type)
    setFilename(e.target.files[0].name)
    setFilePath(e.target.value)
    console.log({ filename: e.target.files[0].name })
  }

  const onDownloadFile = async e => {
    e.preventDefault()
    downloadBase64File({mimeType, filename, payload: [{content}]}, window)
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
    <Form style={{ maxWidth: '1000px', margin: '20px auto' }} onSubmit={handleEdit}>
      <h1 style={{ marginBottom: '2em' }}>
        {isInEditingMode() ? 'Edit' : 'Create'} Document
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
            invalid={!isValidHttpUrl(uri)}
            value={uri}
            onChange={e => setUri(e.target.value)}
          />
          <FormFeedback>Valid url is required</FormFeedback>
        </FormGroup>
      )}

      {entityName === DocumentEnums.file.entityName && isInEditingMode() && (
        <>
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
        </>
      )}
      {fileLoaded && (
        <>
          <p>{filename}</p>
          <p>{mimeType}</p>
          <p>{filePath}</p>
        </>
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
        />
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
      <Button type="submit" color="success" >
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
